package staging

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

// Manager handles staging operations for quadlet updates
type Manager struct {
	StagingDir string
	ActiveDir  string
	BackupDir  string
}

// StagingMetadata contains information about staged updates
type StagingMetadata struct {
	DeploymentName string    `json:"deployment_name"`
	SourceURL      string    `json:"source_url"`
	StagedVersion  string    `json:"staged_version"`
	CurrentVersion string    `json:"current_version"`
	StagedAt       time.Time `json:"staged_at"`
	Checksum       string    `json:"checksum"`
}

// NewManager creates a new staging manager with default directories
func NewManager() (*Manager, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return nil, fmt.Errorf("failed to get user home directory: %w", err)
	}

	baseDir := filepath.Join(homeDir, ".local", "share", "bluebuild-quadlets")

	m := &Manager{
		StagingDir: filepath.Join(baseDir, "staged"),
		ActiveDir:  filepath.Join(baseDir, "active"),
		BackupDir:  filepath.Join(baseDir, "backups"),
	}

	return m, nil
}

// InitStaging creates staging subdirectory for a deployment
func (m *Manager) InitStaging(deploymentName string) error {
	stagingPath := filepath.Join(m.StagingDir, deploymentName)

	if err := os.MkdirAll(stagingPath, 0755); err != nil {
		return fmt.Errorf("failed to create staging directory: %w", err)
	}

	return nil
}

// CleanStaging removes all staged content
func (m *Manager) CleanStaging() error {
	if _, err := os.Stat(m.StagingDir); os.IsNotExist(err) {
		return nil // Nothing to clean
	}

	if err := os.RemoveAll(m.StagingDir); err != nil {
		return fmt.Errorf("failed to clean staging directory: %w", err)
	}

	return nil
}

// HasStagedUpdates checks if staging directory has content
func (m *Manager) HasStagedUpdates() (bool, error) {
	if _, err := os.Stat(m.StagingDir); os.IsNotExist(err) {
		return false, nil
	}

	entries, err := os.ReadDir(m.StagingDir)
	if err != nil {
		return false, fmt.Errorf("failed to read staging directory: %w", err)
	}

	// Check if there are any non-empty directories
	for _, entry := range entries {
		if entry.IsDir() {
			deploymentPath := filepath.Join(m.StagingDir, entry.Name())
			files, err := os.ReadDir(deploymentPath)
			if err != nil {
				continue
			}
			if len(files) > 0 {
				return true, nil
			}
		}
	}

	return false, nil
}

// SaveMetadata saves staging metadata to disk
func (m *Manager) SaveMetadata(meta *StagingMetadata) error {
	stagingPath := filepath.Join(m.StagingDir, meta.DeploymentName)
	if err := os.MkdirAll(stagingPath, 0755); err != nil {
		return fmt.Errorf("failed to create staging directory: %w", err)
	}

	metadataPath := filepath.Join(stagingPath, ".staging-metadata.json")

	data, err := json.MarshalIndent(meta, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal metadata: %w", err)
	}

	if err := os.WriteFile(metadataPath, data, 0644); err != nil {
		return fmt.Errorf("failed to write metadata: %w", err)
	}

	return nil
}

// LoadMetadata loads staging metadata from disk
func (m *Manager) LoadMetadata(deploymentName string) (*StagingMetadata, error) {
	metadataPath := filepath.Join(m.StagingDir, deploymentName, ".staging-metadata.json")

	data, err := os.ReadFile(metadataPath)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, fmt.Errorf("no staged updates for deployment %q", deploymentName)
		}
		return nil, fmt.Errorf("failed to read metadata: %w", err)
	}

	var meta StagingMetadata
	if err := json.Unmarshal(data, &meta); err != nil {
		return nil, fmt.Errorf("failed to parse metadata: %w", err)
	}

	return &meta, nil
}

// ListStagedDeployments returns a list of all staged deployments
func (m *Manager) ListStagedDeployments() ([]string, error) {
	if _, err := os.Stat(m.StagingDir); os.IsNotExist(err) {
		return []string{}, nil
	}

	entries, err := os.ReadDir(m.StagingDir)
	if err != nil {
		return nil, fmt.Errorf("failed to read staging directory: %w", err)
	}

	var deployments []string
	for _, entry := range entries {
		if entry.IsDir() {
			// Verify it has content
			deploymentPath := filepath.Join(m.StagingDir, entry.Name())
			files, err := os.ReadDir(deploymentPath)
			if err != nil {
				continue
			}
			if len(files) > 0 {
				deployments = append(deployments, entry.Name())
			}
		}
	}

	return deployments, nil
}

// DiscardStaged removes staged updates for a deployment
func (m *Manager) DiscardStaged(deploymentName string) error {
	stagingPath := filepath.Join(m.StagingDir, deploymentName)

	if _, err := os.Stat(stagingPath); os.IsNotExist(err) {
		return fmt.Errorf("no staged updates for deployment %q", deploymentName)
	}

	if err := os.RemoveAll(stagingPath); err != nil {
		return fmt.Errorf("failed to discard staged updates: %w", err)
	}

	return nil
}

// GetStagingPath returns the path to a deployment's staging directory
func (m *Manager) GetStagingPath(deploymentName string) string {
	return filepath.Join(m.StagingDir, deploymentName)
}

// GetActivePath returns the path to a deployment's active directory
func (m *Manager) GetActivePath(deploymentName string) string {
	return filepath.Join(m.ActiveDir, deploymentName)
}
