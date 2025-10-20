package backup

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/leger-labs/leger/internal/podman"
)

// Restore restores a deployment from a backup
// It creates a temporary safety backup before proceeding and can rollback on failure
func (m *Manager) Restore(backupID string) error {
	// Load backup metadata
	backup, err := m.Get(backupID)
	if err != nil {
		return err
	}

	// Verify backup directory exists
	backupPath := filepath.Join(m.BackupDir, backupID)
	if _, err := os.Stat(backupPath); err != nil {
		return fmt.Errorf("backup directory not found: %s", backupPath)
	}

	// Get deployment directory paths
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return fmt.Errorf("failed to get home directory: %w", err)
	}

	activeDir := filepath.Join(homeDir, ".local", "share", "bluebuild-quadlets", "active")
	deploymentPath := filepath.Join(activeDir, backup.DeploymentName)

	// Create temporary safety backup if deployment exists
	var tempBackupID string
	if _, err := os.Stat(deploymentPath); err == nil {
		fmt.Println("Creating safety backup of current state...")
		tempBackupID, err = m.CreateBackup(backup.DeploymentName, "pre-restore-safety")
		if err != nil {
			return fmt.Errorf("failed to create safety backup: %w", err)
		}
	}

	// Stop all services for this deployment
	systemdManager := podman.NewSystemdManager("user")
	if err := m.stopDeploymentServices(backup.DeploymentName, systemdManager); err != nil {
		fmt.Printf("Warning: failed to stop services: %v\n", err)
		// Continue anyway - services might not exist
	}

	// Remove current quadlet files using podman quadlet rm
	if err := m.removeCurrentQuadlets(backup.DeploymentName); err != nil {
		fmt.Printf("Warning: failed to remove current quadlets: %v\n", err)
		// Continue anyway - quadlets might not exist
	}

	// Ensure active directory exists
	if err := os.MkdirAll(deploymentPath, 0755); err != nil {
		return m.handleRestoreError(tempBackupID, fmt.Errorf("failed to create deployment directory: %w", err))
	}

	// Copy quadlet files from backup
	if err := m.restoreQuadletFiles(backupPath, deploymentPath, backup.QuadletFiles); err != nil {
		return m.handleRestoreError(tempBackupID, fmt.Errorf("failed to restore quadlet files: %w", err))
	}

	// Restore volumes
	if err := m.restoreVolumes(backupPath, backup.Volumes); err != nil {
		return m.handleRestoreError(tempBackupID, fmt.Errorf("failed to restore volumes: %w", err))
	}

	// Install quadlets using podman quadlet install
	if err := m.quadletManager.Install(deploymentPath); err != nil {
		return m.handleRestoreError(tempBackupID, fmt.Errorf("failed to install quadlets: %w", err))
	}

	// Start services
	if err := m.startDeploymentServices(backup.DeploymentName, systemdManager); err != nil {
		return m.handleRestoreError(tempBackupID, fmt.Errorf("failed to start services: %w", err))
	}

	// Clean up temporary safety backup if it exists
	if tempBackupID != "" {
		tempBackupPath := filepath.Join(m.BackupDir, tempBackupID)
		os.RemoveAll(tempBackupPath)
	}

	return nil
}

// handleRestoreError attempts to rollback to safety backup if restore fails
func (m *Manager) handleRestoreError(tempBackupID string, originalErr error) error {
	if tempBackupID == "" {
		return originalErr
	}

	fmt.Printf("\n⚠️  Restore failed, attempting rollback...\n")

	// Attempt to restore from temporary backup
	if err := m.rollbackRestore(tempBackupID); err != nil {
		return fmt.Errorf(`restore failed and rollback failed: %w

Original error: %v

Manual recovery required:
  1. Check service status: leger status
  2. Try restoring from another backup: leger backup list
  3. Or reinstall: leger deploy install <source>`, err, originalErr)
	}

	return fmt.Errorf("restore failed, rolled back to previous state: %w", originalErr)
}

// rollbackRestore restores from a temporary safety backup
func (m *Manager) rollbackRestore(tempBackupID string) error {
	// Load temp backup metadata
	backup, err := m.Get(tempBackupID)
	if err != nil {
		return err
	}

	backupPath := filepath.Join(m.BackupDir, tempBackupID)

	homeDir, err := os.UserHomeDir()
	if err != nil {
		return fmt.Errorf("failed to get home directory: %w", err)
	}

	deploymentPath := filepath.Join(homeDir, ".local", "share", "bluebuild-quadlets", "active", backup.DeploymentName)

	// Remove failed restore files
	os.RemoveAll(deploymentPath)

	// Ensure directory exists
	if err := os.MkdirAll(deploymentPath, 0755); err != nil {
		return fmt.Errorf("failed to create deployment directory: %w", err)
	}

	// Restore quadlet files
	if err := m.restoreQuadletFiles(backupPath, deploymentPath, backup.QuadletFiles); err != nil {
		return fmt.Errorf("failed to restore quadlet files during rollback: %w", err)
	}

	// Restore volumes
	if err := m.restoreVolumes(backupPath, backup.Volumes); err != nil {
		return fmt.Errorf("failed to restore volumes during rollback: %w", err)
	}

	// Install quadlets
	if err := m.quadletManager.Install(deploymentPath); err != nil {
		return fmt.Errorf("failed to install quadlets during rollback: %w", err)
	}

	// Start services
	systemdManager := podman.NewSystemdManager("user")
	if err := m.startDeploymentServices(backup.DeploymentName, systemdManager); err != nil {
		return fmt.Errorf("failed to start services during rollback: %w", err)
	}

	return nil
}

// restoreQuadletFiles copies quadlet files from backup to deployment directory
func (m *Manager) restoreQuadletFiles(backupPath, deploymentPath string, quadletFiles []string) error {
	for _, fileName := range quadletFiles {
		srcPath := filepath.Join(backupPath, fileName)
		destPath := filepath.Join(deploymentPath, fileName)

		data, err := os.ReadFile(srcPath)
		if err != nil {
			return fmt.Errorf("failed to read %s: %w", fileName, err)
		}

		if err := os.WriteFile(destPath, data, 0644); err != nil {
			return fmt.Errorf("failed to write %s: %w", fileName, err)
		}
	}

	return nil
}

// restoreVolumes restores all volumes from backup
func (m *Manager) restoreVolumes(backupPath string, volumes []VolumeBackup) error {
	if len(volumes) == 0 {
		return nil
	}

	for _, vol := range volumes {
		archivePath := filepath.Join(backupPath, vol.ArchivePath)

		// Check if archive exists
		if _, err := os.Stat(archivePath); err != nil {
			return fmt.Errorf("volume archive not found: %s", archivePath)
		}

		// Remove existing volume if it exists
		exists, err := m.volumeManager.Exists(vol.Name)
		if err != nil {
			return fmt.Errorf("failed to check if volume exists: %w", err)
		}

		if exists {
			if err := m.volumeManager.Remove(vol.Name); err != nil {
				return fmt.Errorf("failed to remove existing volume %q: %w", vol.Name, err)
			}
		}

		// Import volume
		if err := m.volumeManager.Import(vol.Name, archivePath); err != nil {
			return fmt.Errorf("failed to import volume %q: %w", vol.Name, err)
		}
	}

	return nil
}

// stopDeploymentServices stops all systemd services for a deployment
func (m *Manager) stopDeploymentServices(deploymentName string, systemdManager *podman.SystemdManager) error {
	// Get list of services
	services, err := systemdManager.ListServices()
	if err != nil {
		return err
	}

	// Filter services by deployment name (assuming service names match deployment)
	for _, service := range services {
		if service == deploymentName || service == deploymentName+".service" {
			if err := systemdManager.Stop(service); err != nil {
				return fmt.Errorf("failed to stop service %s: %w", service, err)
			}
		}
	}

	return nil
}

// startDeploymentServices starts all systemd services for a deployment
func (m *Manager) startDeploymentServices(deploymentName string, systemdManager *podman.SystemdManager) error {
	// After installing quadlets, systemd will have generated the service files
	// Reload systemd to pick up the new services
	if err := systemdManager.DaemonReload(); err != nil {
		return fmt.Errorf("failed to reload systemd: %w", err)
	}

	// Get list of services
	services, err := systemdManager.ListServices()
	if err != nil {
		return err
	}

	// Start services matching deployment name
	for _, service := range services {
		if service == deploymentName || service == deploymentName+".service" {
			if err := systemdManager.Start(service); err != nil {
				return fmt.Errorf("failed to start service %s: %w", service, err)
			}
		}
	}

	return nil
}

// removeCurrentQuadlets removes currently installed quadlets for a deployment
func (m *Manager) removeCurrentQuadlets(deploymentName string) error {
	// List currently installed quadlets
	quadlets, err := m.quadletManager.List()
	if err != nil {
		// If list fails, quadlets might not exist - that's ok
		return nil
	}

	// Remove quadlets matching the deployment name
	for _, quadlet := range quadlets {
		// Check if quadlet name matches deployment
		// This is a simple heuristic - quadlet names often match deployment name
		if quadlet.Name == deploymentName || quadlet.Name == deploymentName+".container" {
			if err := m.quadletManager.Remove(quadlet.Name); err != nil {
				// Log but continue
				fmt.Printf("Warning: failed to remove quadlet %s: %v\n", quadlet.Name, err)
			}
		}
	}

	return nil
}
