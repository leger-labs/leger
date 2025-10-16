# Issue #17: Backup & Restore System

**⚠️ v0.1.0 Note**: This issue will integrate with existing Podman secret functionality from the setec integration. The backup system needs to coordinate with `internal/daemon/client.go` for secret-aware backups.

## Overview

Implement comprehensive backup and restore functionality with full volume support. This provides disaster recovery capabilities and enables safe experimentation with deployments.

## Scope

### 1. Backup Infrastructure
- Backup directory management
- Metadata tracking (what, when, why)
- Automatic backup on destructive operations
- Manual backup on demand

### 2. Volume Backup
- Enumerate volumes from quadlets
- Export volumes using `podman volume export`
- Include volume data in backups
- Compressed archive creation

### 3. Backup Commands
- `leger backup create [name]` - Create timestamped backup
- `leger backup list` - List available backups
- `leger backup info <id>` - Show backup details

### 4. Restore Commands
- `leger restore <backup-id>` - Restore from backup
- Rollback on restore failure
- Volume import using `podman volume import`
- Service restart after restore

### 5. Integration
- Automatic backup before `leger deploy remove`
- Automatic backup before `leger apply` (staged updates)
- Backup pruning (keep N most recent)

---

## Reference Material for This Issue

### Primary Specification
- **`docs/LEGER-CLI-SPEC-FINAL.md`**
  - § 4.3 (Backup Commands)
  - § 4.3.1 (Backup Create)
  - § 4.3.2 (Backup List)
  - § 4.3.3 (Backup Restore)

### Implementation Patterns

**Backup Workflow** (Port from Nushell to Go):
- `docs/quadlets/staged-updates.nu` (lines 280-350) - Backup functions
  - `createBackup()`
  - `listBackups()`
  - `restoreBackup()`

**Volume Operations**:
- Use `podman volume export` and `podman volume import`
- Example: `podman volume export myvolume | gzip > volume.tar.gz`
- Restore: `gzip -d < volume.tar.gz | podman volume import myvolume`

**Archive Creation**:
- Go standard library `archive/tar` and `compress/gzip`
- Alternative: `exec.Command("tar", "-czf")`

---

## Implementation Checklist

### Phase 1: Backup Infrastructure

- [ ] Create `internal/backup/` package

- [ ] Implement `manager.go`
  ```go
  type Manager struct {
      BackupDir string
  }
  
  type Backup struct {
      ID           string    // Timestamp-based: nginx-2025-10-16-120000
      DeploymentName string
      CreatedAt    time.Time
      Type         BackupType // Manual, Automatic
      Reason       string    // "before-update", "manual", "before-remove"
      Size         int64     // Total size in bytes
      QuadletFiles []string
      Volumes      []VolumeBackup
  }
  
  type VolumeBackup struct {
      Name         string
      ArchivePath  string
      Size         int64
  }
  
  func NewManager() (*Manager, error) {
      // Initialize ~/.local/share/bluebuild-quadlets/backups/
  }
  
  func (m *Manager) List() ([]Backup, error) {
      // List all backups
  }
  
  func (m *Manager) Get(backupID string) (*Backup, error) {
      // Get specific backup metadata
  }
  ```

- [ ] Implement metadata handling
  ```go
  func (m *Manager) SaveMetadata(backup *Backup) error
  func (m *Manager) LoadMetadata(backupID string) (*Backup, error)
  ```
  Metadata file: `{backup-dir}/{id}/.backup-metadata.json`

### Phase 2: Volume Backup

- [ ] Implement `internal/backup/volumes.go`
  ```go
  func (m *Manager) BackupVolume(volumeName, destPath string) error {
      // 1. Check if volume exists
      // 2. Export using: podman volume export volumeName
      // 3. Compress to destPath using gzip
      // 4. Return size and checksum
  }
  
  func (m *Manager) RestoreVolume(volumeName, sourcePath string) error {
      // 1. Decompress archive
      // 2. Check if volume exists (remove if yes)
      // 3. Create volume: podman volume create volumeName
      // 4. Import using: podman volume import volumeName
  }
  
  func (m *Manager) EnumerateVolumes(quadletDir string) ([]string, error) {
      // Parse .container and .volume files
      // Extract Volume= directives
      // Return list of volume names
  }
  ```
  Pattern: Port from `docs/quadlets/staged-updates.nu:backupVolumes()` (lines 300-330)

- [ ] Implement compression helpers
  ```go
  func CompressArchive(src, dest string) error
  func DecompressArchive(src, dest string) error
  ```

### Phase 3: Backup Create

- [ ] Implement `internal/backup/manager.go:CreateBackup()`
  ```go
  func (m *Manager) CreateBackup(deploymentName, reason string) (string, error) {
      // 1. Generate backup ID (timestamp-based)
      // 2. Create backup directory
      // 3. Copy all quadlet files
      // 4. Enumerate volumes from quadlets
      // 5. Backup each volume
      // 6. Create metadata file
      // 7. Calculate total size
      // 8. Return backup ID
  }
  ```
  Pattern: Port from `docs/quadlets/staged-updates.nu:createBackup()` (lines 280-315)

- [ ] Implement `cmd/leger/backup.go`
  ```go
  func backupCreateCmd() *cobra.Command {
      return &cobra.Command{
          Use:   "create [name]",
          Short: "Create a backup",
          Long: `Create a timestamped backup of deployment.

Includes:
  - All quadlet files
  - Volume data (exported and compressed)
  - Metadata (services, versions, etc.)

Flags:
  --reason string   Reason for backup (default: "manual")`,
          RunE: func(cmd *cobra.Command, args []string) error {
              deploymentName := ""
              if len(args) > 0 {
                  deploymentName = args[0]
              } else {
                  // Get current deployment from state
              }
              
              reason := cmd.Flag("reason").Value.String()
              
              // Create backup
              backupID, err := backupMgr.CreateBackup(deploymentName, reason)
              if err != nil {
                  return err
              }
              
              // Load metadata to display
              backup, _ := backupMgr.Get(backupID)
              
              fmt.Printf("✓ Backup created: %s\n", backupID)
              fmt.Printf("  Size: %s\n", formatSize(backup.Size))
              fmt.Printf("  Volumes: %d\n", len(backup.Volumes))
              
              return nil
          },
      }
  }
  ```

### Phase 4: Backup List and Info

- [ ] Implement `cmd/leger/backup.go:backupListCmd()`
  ```go
  func backupListCmd() *cobra.Command {
      return &cobra.Command{
          Use:   "list",
          Short: "List all backups",
          RunE: func(cmd *cobra.Command, args []string) error {
              backups, err := backupMgr.List()
              if err != nil {
                  return err
              }
              
              // Display as table:
              // ID                      CREATED            TYPE       SIZE    REASON
              // nginx-2025-10-16-120000 2025-10-16 12:00  Manual     125MB   manual
              
              return nil
          },
      }
  }
  ```

- [ ] Implement `cmd/leger/backup.go:backupInfoCmd()`
  ```go
  func backupInfoCmd() *cobra.Command {
      return &cobra.Command{
          Use:   "info <backup-id>",
          Short: "Show backup details",
          RunE: func(cmd *cobra.Command, args []string) error {
              if len(args) == 0 {
                  return fmt.Errorf("backup ID required")
              }
              
              backup, err := backupMgr.Get(args[0])
              if err != nil {
                  return err
              }
              
              // Display detailed info:
              // - Backup ID
              // - Created at
              // - Type and reason
              // - Deployment name
              // - Quadlet files (list)
              // - Volumes (list with sizes)
              // - Total size
              
              return nil
          },
      }
  }
  ```

### Phase 5: Restore Functionality

- [ ] Implement `internal/backup/restore.go`
  ```go
  func (m *Manager) Restore(backupID string) error {
      // 1. Load backup metadata
      // 2. Verify backup exists and is valid
      // 3. Create temporary backup of current state (for rollback)
      // 4. Stop all current services
      // 5. Remove current quadlet files using podman quadlet rm
      // 6. Copy quadlet files from backup
      // 7. Restore volumes
      // 8. Install quadlets using podman quadlet install
      // 9. Start services
      // 10. Verify services started
      // 11. Clean up temporary backup
  }
  
  func (m *Manager) RollbackRestore(tempBackupID string) error {
      // Restore from temporary backup if restore fails
      // Used when main restore encounters errors
  }
  ```
  Pattern: Port from `docs/quadlets/staged-updates.nu:restoreBackup()` (lines 340-380)

- [ ] Implement `cmd/leger/backup.go:restoreCmd()`
  ```go
  func restoreCmd() *cobra.Command {
      return &cobra.Command{
          Use:   "restore <backup-id>",
          Short: "Restore from backup",
          Long: `Restore deployment from backup.

Creates temporary backup of current state before restoring.
Automatically rolls back if restore fails.

Warning: This stops all services and replaces current deployment.

Flags:
  --force         Skip confirmation prompt`,
          RunE: func(cmd *cobra.Command, args []string) error {
              if len(args) == 0 {
                  return fmt.Errorf("backup ID required\n\nList backups: leger backup list")
              }
              
              backupID := args[0]
              
              // Display backup info
              backup, err := backupMgr.Get(backupID)
              if err != nil {
                  return err
              }
              
              fmt.Printf("Restoring backup: %s\n", backupID)
              fmt.Printf("  Created: %s\n", backup.CreatedAt.Format(time.RFC3339))
              fmt.Printf("  Deployment: %s\n", backup.DeploymentName)
              fmt.Printf("  Volumes: %d\n", len(backup.Volumes))
              fmt.Println()
              
              // Confirm (unless --force)
              force := cmd.Flag("force").Changed
              if !force {
                  if !confirmRestore() {
                      return nil
                  }
              }
              
              // Perform restore
              fmt.Println("Creating safety backup...")
              fmt.Println("Stopping services...")
              fmt.Println("Restoring quadlet files...")
              fmt.Println("Restoring volumes...")
              fmt.Println("Starting services...")
              
              if err := backupMgr.Restore(backupID); err != nil {
                  return fmt.Errorf("restore failed: %w", err)
              }
              
              fmt.Printf("✓ Restored successfully from %s\n", backupID)
              
              return nil
          },
      }
  }
  ```

### Phase 6: Integration with Deploy Commands

- [ ] Update `leger deploy remove` to create automatic backup
  ```go
  // In cmd/leger/deploy.go:deployRemoveCmd()
  func deployRemoveCmd() *cobra.Command {
      cmd.Flags().Bool("no-backup", false, "Skip automatic backup")
      cmd.Flags().Bool("backup", true, "Create backup before removal (default)")
      
      RunE: func(cmd *cobra.Command, args []string) error {
          // ... existing logic ...
          
          // Before removal:
          if !cmd.Flag("no-backup").Changed {
              fmt.Println("Creating automatic backup...")
              backupID, err := backupMgr.CreateBackup(name, "before-remove")
              if err != nil {
                  fmt.Printf("Warning: Backup failed: %v\n", err)
                  if !confirm("Continue without backup?") {
                      return nil
                  }
              } else {
                  fmt.Printf("✓ Backup created: %s\n", backupID)
              }
          }
          
          // Proceed with removal
      }
  }
  ```

- [ ] Update `leger apply` (from Issue #16) to create automatic backup
  ```go
  // In internal/staging/manager.go:ApplyStaged()
  func (m *Manager) ApplyStaged(deploymentName string) error {
      // Before applying:
      fmt.Println("Creating automatic backup...")
      backupMgr := backup.NewManager()
      backupID, err := backupMgr.CreateBackup(deploymentName, "before-apply")
      if err != nil {
          return fmt.Errorf("failed to create backup: %w", err)
      }
      fmt.Printf("✓ Backup created: %s\n", backupID)
      
      // Continue with apply logic
  }
  ```

- [ ] Add backup pruning (optional)
  ```go
  func (m *Manager) PruneOld(keepCount int) error {
      // Keep only N most recent backups per deployment
      // Remove older backups
  }
  ```

---

## Testing Checklist

### Unit Tests

- [ ] `internal/backup/manager_test.go`
  - [ ] CreateBackup creates correct structure
  - [ ] List returns all backups
  - [ ] Get retrieves specific backup
  - [ ] Metadata save/load works

- [ ] `internal/backup/volumes_test.go`
  - [ ] BackupVolume creates compressed archive
  - [ ] RestoreVolume imports correctly
  - [ ] EnumerateVolumes finds all volumes
  - [ ] Handles volumes that don't exist

- [ ] `internal/backup/restore_test.go`
  - [ ] Restore process works
  - [ ] RollbackRestore works
  - [ ] Handles errors gracefully

### Integration Tests

- [ ] **Create backup**
  ```bash
  # Deploy something
  leger deploy install https://github.com/rgolangh/podman-quadlets/tree/main/nginx
  
  # Create backup
  leger backup create nginx --reason "before-test"
  
  # Verify backup directory
  ls ~/.local/share/bluebuild-quadlets/backups/
  ```

- [ ] **List backups**
  ```bash
  leger backup list
  # Should show created backup
  ```

- [ ] **Backup info**
  ```bash
  leger backup info <backup-id>
  # Should show details, volumes, size
  ```

- [ ] **Restore backup**
  ```bash
  # Modify deployment
  leger deploy remove nginx --force --no-backup
  
  # Restore from backup
  leger restore <backup-id>
  
  # Verify service running
  systemctl --user status nginx.service
  ```

- [ ] **Automatic backup on remove**
  ```bash
  leger deploy remove nginx
  # Should create automatic backup
  # Should prompt for confirmation
  ```

- [ ] **Automatic backup on apply**
  ```bash
  leger stage <source>
  leger apply
  # Should create automatic backup before applying
  ```

### Manual Verification

```bash
# Complete workflow test

# 1. Deploy initial service
leger deploy install https://github.com/rgolangh/podman-quadlets/tree/main/nginx
systemctl --user status nginx.service
# Expected: Running

# 2. Create manual backup
leger backup create nginx --reason "test-backup"
# Expected: Backup created with ID

# 3. List backups
leger backup list
# Expected: Shows backup in table

# 4. Get backup details
leger backup info <backup-id>
# Expected: Shows files, volumes, size

# 5. Modify deployment (remove)
leger deploy remove nginx --force --no-backup

# 6. Verify removal
systemctl --user status nginx.service
# Expected: Service not found

# 7. Restore from backup
leger restore <backup-id>
# Expected: Prompts for confirmation
# Expected: Restores quadlet files
# Expected: Restores volumes
# Expected: Starts service

# 8. Verify restoration
systemctl --user status nginx.service
# Expected: Running again

podman volume ls
# Expected: Volumes restored

# 9. Test automatic backup on remove
leger deploy remove nginx
# Expected: Creates automatic backup
# Expected: Asks for confirmation

leger backup list
# Expected: Shows automatic backup

# 10. Test rollback (simulate failure)
# Manually corrupt a volume in backup
# Try to restore
leger restore <corrupted-backup-id>
# Expected: Restore fails
# Expected: Automatic rollback occurs
# Expected: Original deployment still works
```

---

## Error Handling Examples

```go
// ✅ GOOD - Backup creation errors
if err := backupMgr.CreateBackup(name, reason); err != nil {
    return fmt.Errorf(`Failed to create backup: %w

Possible causes:
  - Insufficient disk space
  - Volume export failed
  - Permission issues

Check available space:
  df -h ~/.local/share/bluebuild-quadlets/backups/

Check volume status:
  podman volume ls`, err)
}

// ✅ GOOD - Restore errors with rollback
if err := backupMgr.Restore(backupID); err != nil {
    fmt.Println("⚠️  Restore failed, rolling back...")
    if rbErr := backupMgr.RollbackRestore(tempBackupID); rbErr != nil {
        return fmt.Errorf(`Restore failed and rollback failed: %w

Original error: %v

Manual recovery required:
  1. Check service status: leger status
  2. Try restoring from another backup: leger backup list
  3. Or reinstall: leger deploy install <source>`, rbErr, err)
    }
    return fmt.Errorf("restore failed, rolled back to previous state: %w", err)
}

// ✅ GOOD - Volume export errors
if err := podman.ExportVolume(volumeName, archivePath); err != nil {
    return fmt.Errorf(`Failed to export volume %q: %w

Verify volume exists:
  podman volume inspect %s

Check if volume is in use:
  podman ps --filter volume=%s

Try stopping services first:
  leger service stop <service-name>`, volumeName, err, volumeName, volumeName)
}
```

---

## Acceptance Criteria

### Functionality
- [ ] Can create manual backups on demand
- [ ] Can create automatic backups before destructive operations
- [ ] Backups include all quadlet files
- [ ] Backups include all volumes (exported and compressed)
- [ ] Can list all backups with metadata
- [ ] Can view detailed backup information
- [ ] Can restore from any backup
- [ ] Restore creates safety backup before proceeding
- [ ] Automatic rollback on restore failure

### Volume Support
- [ ] Enumerates volumes from quadlet files correctly
- [ ] Exports volumes using `podman volume export`
- [ ] Compresses volume archives
- [ ] Imports volumes using `podman volume import`
- [ ] Handles missing volumes gracefully

### User Experience
- [ ] Backup creation shows progress
- [ ] Clear confirmation prompts before restore
- [ ] Detailed error messages with remediation
- [ ] Backup list formatted as readable table
- [ ] Backup info shows comprehensive details

### Code Quality
- [ ] Uses native Podman volume commands
- [ ] Proper error handling throughout
- [ ] Rollback mechanisms tested
- [ ] Conventional commits
- [ ] All exports functions documented

### Testing
- [ ] All unit tests pass
- [ ] Integration tests complete workflow
- [ ] Manual verification successful
- [ ] Rollback tested and working
- [ ] Volume backup/restore tested

---

## Dependencies

- **Issue #14** - Requires deploy install/remove infrastructure
- **Issue #16** - Integration with staged updates (apply creates backup)


## Notes

### Backup Directory Structure

```
~/.local/share/bluebuild-quadlets/backups/
├── nginx-2025-10-16-120000/           # Manual backup
│   ├── .backup-metadata.json
│   ├── nginx.container
│   ├── nginx.volume
│   └── volumes/
│       └── nginx-data.tar.gz
├── nginx-2025-10-16-140000/           # Automatic (before-remove)
│   ├── .backup-metadata.json
│   ├── nginx.container
│   └── volumes/
│       └── nginx-data.tar.gz
└── nginx-2025-10-16-160000/           # Automatic (before-apply)
    └── ...
```

### Backup Metadata Format

```json
{
  "id": "nginx-2025-10-16-120000",
  "deployment_name": "nginx",
  "created_at": "2025-10-16T12:00:00Z",
  "type": "manual",
  "reason": "before-update",
  "size": 125829120,
  "quadlet_files": [
    "nginx.container",
    "nginx.volume"
  ],
  "volumes": [
    {
      "name": "nginx-data",
      "archive_path": "volumes/nginx-data.tar.gz",
      "size": 104857600
    }
  ]
}
```

### Volume Export/Import Commands

```bash
# Export
podman volume export nginx-data | gzip > nginx-data.tar.gz

# Import
podman volume create nginx-data
gzip -d < nginx-data.tar.gz | podman volume import nginx-data
```

### Backup Pruning Strategy

Keep N most recent backups per deployment:
- Manual backups: Keep last 5
- Automatic backups: Keep last 10
- User can configure in `~/.config/leger/config.yaml`

### Success Metrics

After this issue, users should be able to:

1. Create backups manually or automatically
2. Backups include full state (quadlets + volumes)
3. Restore from any backup point
4. Have confidence with automatic rollback
5. List and inspect all backups
6. Safe experimentation knowing backups exist
7. Disaster recovery capability

This provides the safety net that makes Leger production-ready for critical deployments. 🚀
