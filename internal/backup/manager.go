package backup

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/leger-labs/leger/internal/podman"
	"github.com/leger-labs/leger/internal/quadlet"
)

const (
	metadataFileName = ".backup-metadata.json"
)

// Manager handles backup operations
type Manager struct {
	BackupDir      string
	quadletManager *podman.QuadletManager
	volumeManager  *podman.VolumeManager
}

// NewManager creates a new backup manager
func NewManager() (*Manager, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return nil, fmt.Errorf("failed to get home directory: %w", err)
	}

	backupDir := filepath.Join(homeDir, ".local", "share", "bluebuild-quadlets", "backups")

	// Ensure backup directory exists
	if err := os.MkdirAll(backupDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create backup directory: %w", err)
	}

	return &Manager{
		BackupDir:      backupDir,
		quadletManager: podman.NewQuadletManager("user"),
		volumeManager:  podman.NewVolumeManager(),
	}, nil
}

// List returns all available backups, sorted by creation time (newest first)
func (m *Manager) List() ([]Backup, error) {
	entries, err := os.ReadDir(m.BackupDir)
	if err != nil {
		if os.IsNotExist(err) {
			return []Backup{}, nil
		}
		return nil, fmt.Errorf("failed to read backup directory: %w", err)
	}

	var backups []Backup
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}

		metadataPath := filepath.Join(m.BackupDir, entry.Name(), metadataFileName)
		backup, err := m.loadMetadata(metadataPath)
		if err != nil {
			// Skip invalid backups
			continue
		}

		backups = append(backups, *backup)
	}

	// Sort by creation time, newest first
	sort.Slice(backups, func(i, j int) bool {
		return backups[i].CreatedAt.After(backups[j].CreatedAt)
	})

	return backups, nil
}

// Get retrieves a specific backup by ID
func (m *Manager) Get(backupID string) (*Backup, error) {
	metadataPath := filepath.Join(m.BackupDir, backupID, metadataFileName)

	backup, err := m.loadMetadata(metadataPath)
	if err != nil {
		return nil, fmt.Errorf("backup not found: %s\n\nList available backups:\n  leger backup list", backupID)
	}

	return backup, nil
}

// CreateBackup creates a new backup of the specified deployment
func (m *Manager) CreateBackup(deploymentName, reason string) (string, error) {
	if deploymentName == "" {
		return "", fmt.Errorf("deployment name is required")
	}

	// Generate backup ID with timestamp
	timestamp := time.Now().Format("2006-01-02-150405")
	backupID := fmt.Sprintf("%s-%s", deploymentName, timestamp)

	// Create backup directory
	backupPath := filepath.Join(m.BackupDir, backupID)
	if err := os.MkdirAll(backupPath, 0755); err != nil {
		return "", fmt.Errorf("failed to create backup directory: %w", err)
	}

	// Determine quadlet source directory
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("failed to get home directory: %w", err)
	}

	quadletDir := filepath.Join(homeDir, ".local", "share", "bluebuild-quadlets", "active", deploymentName)

	// Check if deployment exists
	if _, err := os.Stat(quadletDir); err != nil {
		if os.IsNotExist(err) {
			// Clean up the backup directory we just created
			os.RemoveAll(backupPath)
			return "", fmt.Errorf("deployment %q not found\n\nList deployments:\n  leger deploy list", deploymentName)
		}
		return "", fmt.Errorf("failed to access deployment directory: %w", err)
	}

	// Copy all quadlet files
	quadletFiles, err := m.copyQuadletFiles(quadletDir, backupPath)
	if err != nil {
		os.RemoveAll(backupPath)
		return "", fmt.Errorf("failed to copy quadlet files: %w", err)
	}

	// Backup volumes
	volumeBackups, err := m.backupVolumes(quadletDir, backupPath)
	if err != nil {
		os.RemoveAll(backupPath)
		return "", fmt.Errorf("failed to backup volumes: %w", err)
	}

	// Calculate total size
	totalSize, err := m.calculateDirectorySize(backupPath)
	if err != nil {
		// Non-fatal error, continue with size = 0
		totalSize = 0
	}

	// Determine backup type
	backupType := BackupTypeManual
	if strings.HasPrefix(reason, "before-") {
		backupType = BackupTypeAutomatic
	}

	// Create metadata
	backup := &Backup{
		ID:             backupID,
		DeploymentName: deploymentName,
		CreatedAt:      time.Now(),
		Type:           backupType,
		Reason:         reason,
		Size:           totalSize,
		QuadletFiles:   quadletFiles,
		Volumes:        volumeBackups,
	}

	// Save metadata
	if err := m.saveMetadata(backup); err != nil {
		os.RemoveAll(backupPath)
		return "", fmt.Errorf("failed to save backup metadata: %w", err)
	}

	return backupID, nil
}

// copyQuadletFiles copies all quadlet files from source to destination
func (m *Manager) copyQuadletFiles(srcDir, destDir string) ([]string, error) {
	files, err := m.quadletManager.DiscoverQuadletFiles(srcDir)
	if err != nil {
		return nil, err
	}

	var copiedFiles []string
	for _, file := range files {
		baseName := filepath.Base(file)
		destPath := filepath.Join(destDir, baseName)

		data, err := os.ReadFile(file)
		if err != nil {
			return nil, fmt.Errorf("failed to read %s: %w", file, err)
		}

		if err := os.WriteFile(destPath, data, 0644); err != nil {
			return nil, fmt.Errorf("failed to write %s: %w", destPath, err)
		}

		copiedFiles = append(copiedFiles, baseName)
	}

	return copiedFiles, nil
}

// backupVolumes backs up all volumes referenced in quadlet files
func (m *Manager) backupVolumes(quadletDir, backupPath string) ([]VolumeBackup, error) {
	// Enumerate volumes from quadlet files
	volumes, err := m.enumerateVolumes(quadletDir)
	if err != nil {
		return nil, err
	}

	if len(volumes) == 0 {
		return []VolumeBackup{}, nil
	}

	// Create volumes subdirectory
	volumesDir := filepath.Join(backupPath, "volumes")
	if err := os.MkdirAll(volumesDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create volumes directory: %w", err)
	}

	var volumeBackups []VolumeBackup
	for _, volumeName := range volumes {
		// Check if volume exists
		exists, err := m.volumeManager.Exists(volumeName)
		if err != nil {
			return nil, fmt.Errorf("failed to check if volume %q exists: %w", volumeName, err)
		}

		if !exists {
			// Volume doesn't exist, skip it (might be created on first run)
			continue
		}

		// Export volume
		archiveName := fmt.Sprintf("%s.tar", volumeName)
		archivePath := filepath.Join(volumesDir, archiveName)

		if err := m.volumeManager.Export(volumeName, archivePath); err != nil {
			return nil, fmt.Errorf("failed to export volume %q: %w", volumeName, err)
		}

		// Get archive size
		fileInfo, err := os.Stat(archivePath)
		if err != nil {
			return nil, fmt.Errorf("failed to stat volume archive: %w", err)
		}

		volumeBackups = append(volumeBackups, VolumeBackup{
			Name:        volumeName,
			ArchivePath: filepath.Join("volumes", archiveName),
			Size:        fileInfo.Size(),
		})
	}

	return volumeBackups, nil
}

// enumerateVolumes finds all volumes referenced in quadlet files
func (m *Manager) enumerateVolumes(quadletDir string) ([]string, error) {
	files, err := m.quadletManager.DiscoverQuadletFiles(quadletDir)
	if err != nil {
		return nil, err
	}

	volumeSet := make(map[string]bool)

	for _, file := range files {
		// Only parse .container and .pod files (they can reference volumes)
		ext := filepath.Ext(file)
		if ext != ".container" && ext != ".pod" {
			continue
		}

		// Parse quadlet file to find Volume= directives
		volumes, err := quadlet.ParseVolumeDirectives(file)
		if err != nil {
			// Non-fatal: skip files we can't parse
			continue
		}

		for _, vol := range volumes {
			// Volume directive format: "volume-name:/path/in/container"
			// Extract just the volume name
			parts := strings.Split(vol, ":")
			if len(parts) > 0 {
				volumeName := strings.TrimSpace(parts[0])
				volumeSet[volumeName] = true
			}
		}
	}

	// Convert set to slice
	var volumes []string
	for vol := range volumeSet {
		volumes = append(volumes, vol)
	}

	return volumes, nil
}

// calculateDirectorySize calculates total size of directory
func (m *Manager) calculateDirectorySize(path string) (int64, error) {
	var size int64

	err := filepath.Walk(path, func(_ string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() {
			size += info.Size()
		}
		return nil
	})

	return size, err
}

// saveMetadata saves backup metadata to JSON file
func (m *Manager) saveMetadata(backup *Backup) error {
	metadataPath := filepath.Join(m.BackupDir, backup.ID, metadataFileName)

	data, err := json.MarshalIndent(backup, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal metadata: %w", err)
	}

	if err := os.WriteFile(metadataPath, data, 0644); err != nil {
		return fmt.Errorf("failed to write metadata file: %w", err)
	}

	return nil
}

// loadMetadata loads backup metadata from JSON file
func (m *Manager) loadMetadata(metadataPath string) (*Backup, error) {
	data, err := os.ReadFile(metadataPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read metadata: %w", err)
	}

	var backup Backup
	if err := json.Unmarshal(data, &backup); err != nil {
		return nil, fmt.Errorf("failed to parse metadata: %w", err)
	}

	return &backup, nil
}
