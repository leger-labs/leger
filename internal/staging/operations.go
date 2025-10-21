package staging

import (
	"context"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

// StageUpdate downloads quadlets from source and stages them for review
func (m *Manager) StageUpdate(ctx context.Context, source string, deploymentName string) error {
	// Create staging directory
	if err := m.InitStaging(deploymentName); err != nil {
		return err
	}

	// Download/copy quadlets to staging
	// This will be integrated with existing download logic from deploy.go
	// For now, we'll assume the source is a local path or has been pre-downloaded
	// TODO: Integrate with git.Clone and legerrun.FetchManifest
	_ = m.GetStagingPath(deploymentName) // Will be used when download integration is complete

	// Create metadata
	meta := &StagingMetadata{
		DeploymentName: deploymentName,
		SourceURL:      source,
		StagedVersion:  "latest",  // TODO: Extract version from manifest
		CurrentVersion: "unknown", // TODO: Get from active deployment
		StagedAt:       time.Now(),
		Checksum:       "", // TODO: Calculate checksum
	}

	if err := m.SaveMetadata(meta); err != nil {
		return err
	}

	return nil
}

// ApplyStaged applies staged updates to the active deployment
func (m *Manager) ApplyStaged(ctx context.Context, deploymentName string) error {
	stagingPath := m.GetStagingPath(deploymentName)
	activePath := m.GetActivePath(deploymentName)

	// Verify staged updates exist
	if _, err := os.Stat(stagingPath); os.IsNotExist(err) {
		return fmt.Errorf(`no staged updates found for %q

Stage updates first:
  leger stage [source]

Or update directly:
  leger deploy update`, deploymentName)
	}

	// Create backup before applying
	fmt.Println("Creating backup...")
	if err := m.createBackup(ctx, deploymentName); err != nil {
		return fmt.Errorf("failed to create backup: %w", err)
	}

	// Get list of affected services
	services, err := m.getAffectedServices(deploymentName)
	if err != nil {
		return fmt.Errorf("failed to identify affected services: %w", err)
	}

	// Stop affected services
	if len(services) > 0 {
		fmt.Println("Stopping affected services...")
		for _, service := range services {
			if err := m.stopService(ctx, service); err != nil {
				fmt.Printf("⚠️  Warning: failed to stop %s: %v\n", service, err)
			}
		}
	}

	// Remove old quadlets if active deployment exists
	if _, err := os.Stat(activePath); err == nil {
		fmt.Println("Removing old quadlets...")
		if err := os.RemoveAll(activePath); err != nil {
			return m.rollbackOnError(ctx, deploymentName, fmt.Errorf("failed to remove old quadlets: %w", err))
		}
	}

	// Create active directory
	if err := os.MkdirAll(activePath, 0755); err != nil {
		return m.rollbackOnError(ctx, deploymentName, fmt.Errorf("failed to create active directory: %w", err))
	}

	// Copy staged files to active directory
	fmt.Println("Installing updated quadlets...")
	if err := copyDir(stagingPath, activePath); err != nil {
		return m.rollbackOnError(ctx, deploymentName, fmt.Errorf("failed to copy staged files: %w", err))
	}

	// Install quadlets using podman
	if err := m.installQuadlets(ctx, activePath); err != nil {
		return m.rollbackOnError(ctx, deploymentName, fmt.Errorf("failed to install quadlets: %w", err))
	}

	// Start services
	if len(services) > 0 {
		fmt.Println("Starting services...")
		for _, service := range services {
			if err := m.startService(ctx, service); err != nil {
				fmt.Printf("⚠️  Warning: failed to start %s: %v\n", service, err)
			}
		}
	}

	// Clean up staging
	if err := m.DiscardStaged(deploymentName); err != nil {
		fmt.Printf("⚠️  Warning: failed to clean staging: %v\n", err)
	}

	return nil
}

// Rollback restores from backup if apply fails
func (m *Manager) Rollback(ctx context.Context, deploymentName string) error {
	backupPath := m.getLatestBackupPath(deploymentName)
	if backupPath == "" {
		return fmt.Errorf("no backup found for deployment %q", deploymentName)
	}

	activePath := m.GetActivePath(deploymentName)

	// Remove failed deployment
	if err := os.RemoveAll(activePath); err != nil {
		return fmt.Errorf("failed to remove failed deployment: %w", err)
	}

	// Restore from backup
	if err := copyDir(backupPath, activePath); err != nil {
		return fmt.Errorf("failed to restore from backup: %w", err)
	}

	// Reinstall quadlets
	if err := m.installQuadlets(ctx, activePath); err != nil {
		return fmt.Errorf("failed to reinstall quadlets: %w", err)
	}

	// Restart services
	services, err := m.getAffectedServices(deploymentName)
	if err != nil {
		return fmt.Errorf("failed to identify services: %w", err)
	}

	for _, service := range services {
		if err := m.startService(ctx, service); err != nil {
			fmt.Printf("⚠️  Warning: failed to start %s: %v\n", service, err)
		}
	}

	return nil
}

// Helper functions

func (m *Manager) createBackup(ctx context.Context, deploymentName string) error {
	activePath := m.GetActivePath(deploymentName)

	// Check if active deployment exists
	if _, err := os.Stat(activePath); os.IsNotExist(err) {
		return nil // Nothing to backup
	}

	// Create backup directory
	timestamp := time.Now().Format("20060102-150405")
	backupPath := filepath.Join(m.BackupDir, deploymentName, timestamp)

	if err := os.MkdirAll(backupPath, 0755); err != nil {
		return fmt.Errorf("failed to create backup directory: %w", err)
	}

	// Copy active deployment to backup
	if err := copyDir(activePath, backupPath); err != nil {
		return fmt.Errorf("failed to copy to backup: %w", err)
	}

	return nil
}

func (m *Manager) getLatestBackupPath(deploymentName string) string {
	backupBaseDir := filepath.Join(m.BackupDir, deploymentName)

	entries, err := os.ReadDir(backupBaseDir)
	if err != nil || len(entries) == 0 {
		return ""
	}

	// Get the most recent backup (last entry when sorted)
	var latest string
	for _, entry := range entries {
		if entry.IsDir() {
			latest = filepath.Join(backupBaseDir, entry.Name())
		}
	}

	return latest
}

func (m *Manager) getAffectedServices(deploymentName string) ([]string, error) {
	stagingPath := m.GetStagingPath(deploymentName)

	var services []string

	err := filepath.Walk(stagingPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if !info.IsDir() && strings.HasSuffix(path, ".container") {
			serviceName := strings.TrimSuffix(filepath.Base(path), ".container") + ".service"
			services = append(services, serviceName)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return services, nil
}

func (m *Manager) stopService(ctx context.Context, serviceName string) error {
	cmd := exec.CommandContext(ctx, "systemctl", "--user", "stop", serviceName)
	return cmd.Run()
}

func (m *Manager) startService(ctx context.Context, serviceName string) error {
	cmd := exec.CommandContext(ctx, "systemctl", "--user", "start", serviceName)
	return cmd.Run()
}

func (m *Manager) installQuadlets(ctx context.Context, quadletDir string) error {
	cmd := exec.CommandContext(ctx, "podman", "quadlet", "install", "--user", quadletDir)
	var stderr strings.Builder
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("podman quadlet install failed: %w\nStderr: %s", err, stderr.String())
	}

	return nil
}

func (m *Manager) rollbackOnError(ctx context.Context, deploymentName string, originalErr error) error {
	fmt.Println("\n⚠️  Apply failed, rolling back...")

	if rollbackErr := m.Rollback(ctx, deploymentName); rollbackErr != nil {
		return fmt.Errorf(`apply failed and rollback failed: %w

Original error: %v

Manual recovery required:
  1. Check service status: leger status
  2. Restore from backup: leger restore <backup-id>
  3. Check logs: journalctl --user -u %s.service`, rollbackErr, originalErr, deploymentName)
	}

	return fmt.Errorf("apply failed, rolled back successfully: %w", originalErr)
}

// copyDir recursively copies a directory
func copyDir(src, dst string) error {
	return filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Get relative path
		relPath, err := filepath.Rel(src, path)
		if err != nil {
			return err
		}

		// Skip metadata file
		if filepath.Base(path) == ".staging-metadata.json" {
			return nil
		}

		targetPath := filepath.Join(dst, relPath)

		if info.IsDir() {
			return os.MkdirAll(targetPath, info.Mode())
		}

		// Copy file
		return copyFile(path, targetPath, info.Mode())
	})
}

// copyFile copies a single file
func copyFile(src, dst string, mode os.FileMode) error {
	sourceFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	destFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer destFile.Close()

	if _, err := io.Copy(destFile, sourceFile); err != nil {
		return err
	}

	return os.Chmod(dst, mode)
}
