# Issue #16: Staged Updates Workflow

**⚠️ v0.1.0 Note**: This issue is largely independent of the setec integration but will integrate with the existing `internal/daemon/client.go` for service management operations.

## Overview

Implement the complete staged updates workflow: download updates to staging area, preview changes with diff, apply or discard. This provides safe, reviewable updates before applying them to production.

## Scope

### 1. Staging Infrastructure
- Staging directory management (`~/.local/share/bluebuild-quadlets/staged/`)
- Staging metadata tracking
- Version comparison logic

### 2. Stage Command
- `leger stage [source]` - Download updates to staging area
- Fetch from leger.run or Git
- Compare with current deployment
- Store in staging directory

### 3. Diff Command
- `leger diff` - Show changes between current and staged
- File-by-file diff generation
- Summary of modifications/additions/removals
- Port/volume conflict warnings

### 4. Apply Command
- `leger apply` - Apply staged updates to production
- Automatic backup before applying
- Stop affected services
- Install updated quadlets
- Restart services
- Update deployment state

### 5. Discard Command
- `leger discard` - Remove staged updates
- Clean staging directory
- Preserve current deployment

---

## Reference Material for This Issue

### Primary Specification
- **`docs/LEGER-CLI-SPEC-FINAL.md`**
  - § 4.2.2 (Deploy Update Command) - describes update flow
  - § 4.7 (Staged Update Commands)

### Implementation Patterns

**Staging Workflow** (Port from Nushell to Go):
- `docs/quadlets/staged-updates.nu` - **COMPLETE FILE** - Port all functions
  - Lines 1-50: Staging directory management
  - Lines 51-120: Download and stage logic
  - Lines 121-180: Diff generation
  - Lines 181-250: Apply workflow
  - Lines 251-300: Discard and cleanup

**Diff Generation**:
- Standard Go `diff` packages or `exec.Command("diff", "-u")`
- Format output similar to `git diff`

**Backup Integration**:
- Will integrate with Issue #17's backup system
- For now, create simple backup before apply

---

## Implementation Checklist

### Phase 1: Staging Infrastructure

- [ ] Create `internal/staging/` package

- [ ] Implement `manager.go`
  ```go
  type Manager struct {
      StagingDir string
      ActiveDir  string
      BackupDir  string
  }
  
  func NewManager() (*Manager, error) {
      // Initialize directories:
      // ~/.local/share/bluebuild-quadlets/staged/
      // ~/.local/share/bluebuild-quadlets/active/
      // ~/.local/share/bluebuild-quadlets/backups/
  }
  
  func (m *Manager) InitStaging(deploymentName string) error {
      // Create staging subdirectory for deployment
  }
  
  func (m *Manager) CleanStaging() error {
      // Remove all staged content
  }
  
  func (m *Manager) HasStagedUpdates() (bool, error) {
      // Check if staging directory has content
  }
  ```
  Pattern: Port from `docs/quadlets/staged-updates.nu:setupStagingDirectory()`

- [ ] Implement `manifest.go`
  ```go
  type StagingMetadata struct {
      DeploymentName  string    `json:"deployment_name"`
      SourceURL       string    `json:"source_url"`
      StagedVersion   string    `json:"staged_version"`
      CurrentVersion  string    `json:"current_version"`
      StagedAt        time.Time `json:"staged_at"`
      Checksum        string    `json:"checksum"`
  }
  
  func (m *Manager) SaveMetadata(meta *StagingMetadata) error
  func (m *Manager) LoadMetadata() (*StagingMetadata, error)
  ```

### Phase 2: Stage Command

- [ ] Implement staging logic in `internal/staging/manager.go`
  ```go
  func (m *Manager) StageUpdate(source string, deploymentName string) error {
      // 1. Fetch quadlets from source (leger.run or Git)
      // 2. Parse manifest
      // 3. Download all quadlet files to staging directory
      // 4. Save staging metadata
      // 5. Return success
  }
  ```
  Pattern: Port from `docs/quadlets/staged-updates.nu:stageQuadletUpdate()` (lines 51-120)

- [ ] Implement `cmd/leger/staged.go`
  ```go
  func stageCmd() *cobra.Command {
      return &cobra.Command{
          Use:   "stage [source]",
          Short: "Stage updates for review",
          Long: `Download updates to staging area for preview.
  
  If no source is provided, stages from leger.run default repository.
  
  After staging, use:
    leger diff      # Preview changes
    leger apply     # Apply staged updates
    leger discard   # Discard staged updates`,
          RunE: func(cmd *cobra.Command, args []string) error {
              source := ""
              if len(args) > 0 {
                  source = args[0]
              }
              
              // Get current deployment
              // Stage updates from source
              // Display summary
          },
      }
  }
  ```

### Phase 3: Diff Generation

- [ ] Implement `internal/staging/diff.go`
  ```go
  type DiffResult struct {
      Modified []FileDiff
      Added    []string
      Removed  []string
      Summary  DiffSummary
  }
  
  type FileDiff struct {
      Path      string
      OldPath   string
      NewPath   string
      DiffLines []string
  }
  
  type DiffSummary struct {
      FilesModified int
      FilesAdded    int
      FilesRemoved  int
      ServicesAffected []string
      PortConflicts []PortConflict
      VolumeConflicts []VolumeConflict
  }
  
  func (m *Manager) GenerateDiff() (*DiffResult, error) {
      // Compare active vs staged directories
      // Generate unified diffs for each file
      // Detect added/removed files
      // Analyze service impact
      // Check for conflicts
  }
  ```
  Pattern: Port from `docs/quadlets/staged-updates.nu:generateDiff()` (lines 121-180)

- [ ] Implement diff display logic
  ```go
  func (d *DiffResult) Display() {
      // Format: Similar to git diff
      // Use colors for +/- lines
      // Show summary at end
      // Highlight conflicts
  }
  ```

- [ ] Implement `cmd/leger/staged.go:diffCmd()`
  ```go
  func diffCmd() *cobra.Command {
      return &cobra.Command{
          Use:   "diff",
          Short: "Show differences between current and staged",
          Long: `Display changes that will be applied.

Shows:
  - Modified quadlet files (unified diff)
  - Added files
  - Removed files
  - Affected services
  - Port/volume conflicts`,
          RunE: func(cmd *cobra.Command, args []string) error {
              // Check if staged updates exist
              // Generate diff
              // Display diff
              // Show conflicts if any
          },
      }
  }
  ```

### Phase 4: Apply Command

- [ ] Implement apply logic in `internal/staging/manager.go`
  ```go
  func (m *Manager) ApplyStaged(deploymentName string) error {
      // 1. Verify staged updates exist
      // 2. Create backup of current deployment
      // 3. Identify affected services
      // 4. Stop affected services
      // 5. Remove old quadlets using podman quadlet rm
      // 6. Copy staged files to active directory
      // 7. Install updated quadlets using podman quadlet install
      // 8. Start services
      // 9. Clean staging directory
      // 10. Update deployment state
  }
  ```
  Pattern: Port from `docs/quadlets/staged-updates.nu:applyStagedUpdates()` (lines 181-250)

- [ ] Implement rollback on failure
  ```go
  func (m *Manager) Rollback(deploymentName string) error {
      // Restore from backup if apply fails
      // Stop failed services
      // Restore old quadlets
      // Restart services
  }
  ```

- [ ] Implement `cmd/leger/staged.go:applyCmd()`
  ```go
  func applyCmd() *cobra.Command {
      return &cobra.Command{
          Use:   "apply",
          Short: "Apply staged updates",
          Long: `Apply staged updates to production.

Creates automatic backup before applying.
Rolls back automatically if errors occur.

Flags:
  --no-backup     Skip automatic backup (not recommended)
  --force         Skip confirmation prompt`,
          RunE: func(cmd *cobra.Command, args []string) error {
              // 1. Check staged updates exist
              // 2. Display diff summary
              // 3. Prompt for confirmation (unless --force)
              // 4. Create backup (unless --no-backup)
              // 5. Apply updates
              // 6. Display success message
          },
      }
  }
  ```

### Phase 5: Discard Command

- [ ] Implement `internal/staging/manager.go:DiscardStaged()`
  ```go
  func (m *Manager) DiscardStaged() error {
      // Remove staging directory contents
      // Clean metadata
      // Keep current deployment unchanged
  }
  ```
  Pattern: Port from `docs/quadlets/staged-updates.nu:discardStaged()` (lines 251-280)

- [ ] Implement `cmd/leger/staged.go:discardCmd()`
  ```go
  func discardCmd() *cobra.Command {
      return &cobra.Command{
          Use:   "discard",
          Short: "Discard staged updates",
          Long: `Remove staged updates without applying.

Current deployment remains unchanged.`,
          RunE: func(cmd *cobra.Command, args []string) error {
              // 1. Check staged updates exist
              // 2. Prompt for confirmation
              // 3. Discard staged content
              // 4. Display confirmation
          },
      }
  }
  ```

### Phase 6: Integration

- [ ] Update `leger deploy update` to use staging
  ```go
  // cmd/leger/deploy.go
  func deployUpdateCmd() *cobra.Command {
      return &cobra.Command{
          Use:   "update",
          Short: "Update deployed services (uses staging)",
          Long: `Update deployment to latest version.

This command:
  1. Stages updates (leger stage)
  2. Shows diff (leger diff)
  3. Prompts for confirmation
  4. Applies updates (leger apply)

For manual control, use staged workflow:
  leger stage
  leger diff
  leger apply`,
          RunE: func(cmd *cobra.Command, args []string) error {
              // Convenience command that combines:
              // stage → diff → confirm → apply
          },
      }
  }
  ```

- [ ] Add status indicator to `leger status`
  ```go
  // Check if staged updates exist
  if staging.HasStagedUpdates() {
      fmt.Println("⚠️  Staged updates available")
      fmt.Println("   Run 'leger diff' to review")
      fmt.Println("   Run 'leger apply' to install")
  }
  ```

---

## Testing Checklist

### Unit Tests

- [ ] `internal/staging/manager_test.go`
  - [ ] InitStaging creates directories
  - [ ] CleanStaging removes content
  - [ ] HasStagedUpdates detects correctly
  - [ ] SaveMetadata/LoadMetadata work

- [ ] `internal/staging/diff_test.go`
  - [ ] GenerateDiff compares directories correctly
  - [ ] Detects modified files
  - [ ] Detects added/removed files
  - [ ] Identifies affected services
  - [ ] Catches port conflicts

- [ ] `internal/staging/manager_test.go` (apply/discard)
  - [ ] StageUpdate downloads correctly
  - [ ] ApplyStaged installs updates
  - [ ] Rollback restores backup
  - [ ] DiscardStaged cleans up

### Integration Tests

- [ ] **Stage updates**
  ```bash
  # Install initial version
  leger deploy install https://github.com/org/repo/tree/main/v1
  
  # Stage update
  leger stage https://github.com/org/repo/tree/main/v2
  
  # Verify staging directory
  ls ~/.local/share/bluebuild-quadlets/staged/
  ```

- [ ] **Generate diff**
  ```bash
  leger diff
  # Should show:
  # - Modified files with unified diff
  # - Added/removed files
  # - Summary of changes
  ```

- [ ] **Apply updates**
  ```bash
  leger apply
  # Should prompt for confirmation
  # Should create backup
  # Should stop services
  # Should install updates
  # Should start services
  ```

- [ ] **Discard updates**
  ```bash
  leger stage https://github.com/org/repo/tree/main/v2
  leger discard
  # Should remove staged content
  # Should keep current deployment
  ```

- [ ] **Deploy update convenience command**
  ```bash
  leger deploy update
  # Should stage → diff → prompt → apply
  ```

### Manual Verification

```bash
# Test complete workflow

# 1. Install initial deployment
leger deploy install https://github.com/rgolangh/podman-quadlets/tree/main/nginx
systemctl --user status nginx.service
# Expected: Running

# 2. Stage updates (use different version/repo)
leger stage https://github.com/rgolangh/podman-quadlets/tree/main/nginx-updated
# Expected: "Staged updates ready for review"

# 3. Check staging directory
ls -la ~/.local/share/bluebuild-quadlets/staged/
# Expected: Quadlet files present

# 4. View diff
leger diff
# Expected: Unified diff displayed
# Expected: Summary showing changes

# 5. Check status
leger status
# Expected: Shows "Staged updates available"

# 6. Apply updates
leger apply
# Expected: Prompts for confirmation
# Expected: Creates backup
# Expected: Stops nginx
# Expected: Updates quadlets
# Expected: Starts nginx

# 7. Verify service still running
systemctl --user status nginx.service
# Expected: Running with new configuration

# 8. Test discard workflow
leger stage https://github.com/rgolangh/podman-quadlets/tree/main/nginx-v3
leger diff
# Expected: Shows diff
leger discard
# Expected: Staging cleaned, current deployment unchanged

# 9. Test rollback (simulate failure)
# Manually break a quadlet in staging directory
# Try to apply
leger apply
# Expected: Apply fails, automatic rollback occurs
# Expected: Service still running with old config
```

---

## Error Handling Examples

```go
// ✅ GOOD - Staging errors
if !m.HasStagedUpdates() {
    return fmt.Errorf(`No staged updates found

Stage updates first:
  leger stage [source]

Or update directly:
  leger deploy update`)
}

// ✅ GOOD - Apply errors with rollback
if err := m.ApplyStaged(name); err != nil {
    fmt.Println("⚠️  Apply failed, rolling back...")
    if rollbackErr := m.Rollback(name); rollbackErr != nil {
        return fmt.Errorf(`Apply failed and rollback failed: %w

Original error: %v

Manual recovery required:
  1. Check service status: leger status
  2. Restore from backup: leger restore <backup-id>
  3. Check logs: journalctl --user -u %s.service`, rollbackErr, err, name)
    }
    return fmt.Errorf("Apply failed, rolled back successfully: %w", err)
}

// ✅ GOOD - Conflict warnings
conflicts := diff.Summary.PortConflicts
if len(conflicts) > 0 {
    fmt.Println("⚠️  Port conflicts detected:")
    for _, c := range conflicts {
        fmt.Printf("  Port %d already in use by %s\n", c.Port, c.UsedBy)
    }
    fmt.Println("\nResolve conflicts before applying")
    return fmt.Errorf("cannot apply with port conflicts")
}
```

---

## Acceptance Criteria

### Functionality
- [ ] `leger stage` downloads updates to staging area
- [ ] `leger diff` shows clear, readable diffs
- [ ] `leger apply` applies updates with automatic backup
- [ ] `leger discard` removes staged content
- [ ] `leger deploy update` provides convenient workflow
- [ ] Automatic rollback on apply failure
- [ ] Port/volume conflict detection
- [ ] Service impact analysis

### User Experience
- [ ] Diff output is readable (similar to git diff)
- [ ] Summary clearly shows what will change
- [ ] Confirmation prompts before destructive actions
- [ ] Progress indicators during apply
- [ ] Clear success/failure messages

### Code Quality
- [ ] Uses native Podman commands for installation
- [ ] Proper backup before apply
- [ ] Robust error handling with rollback
- [ ] All errors are actionable
- [ ] Conventional commits

### Testing
- [ ] All unit tests pass
- [ ] Integration tests complete workflow
- [ ] Manual verification successful
- [ ] Rollback tested and working

---

## Dependencies

- **Issue #14** - Requires deploy install/remove infrastructure
- **Issue #15** - Requires manifest parsing and multi-source support

---

## Notes

### Port from Nushell Strategy

The `docs/quadlets/staged-updates.nu` file contains all the staging logic in Nushell. Port these functions to Go:

1. **Directory management** → `internal/staging/manager.go`
2. **Staging workflow** → `StageUpdate()` method
3. **Diff generation** → `internal/staging/diff.go`
4. **Apply workflow** → `ApplyStaged()` method
5. **Discard** → `DiscardStaged()` method

**Key differences**:
- Nushell uses pipes; Go uses function returns
- Nushell has built-in table formatting; Go needs manual formatting
- Nushell's `diff` command → Go's `exec.Command("diff", "-u")` or diff library

### Staging Directory Structure

```
~/.local/share/bluebuild-quadlets/
├── active/              # Currently deployed
│   └── nginx/
│       ├── nginx.container
│       └── nginx.volume
├── staged/              # Pending updates
│   └── nginx/
│       ├── nginx.container (modified)
│       ├── nginx.volume
│       └── .staging-metadata.json
└── backups/             # Historical backups
    └── nginx-2025-10-16-120000/
        ├── nginx.container
        └── nginx.volume
```

### Diff Output Format

```
Files modified: 1
Files added: 0
Files removed: 0

=== nginx.container ===
--- active/nginx/nginx.container
+++ staged/nginx/nginx.container
@@ -5,7 +5,7 @@
 [Container]
-Image=nginx:1.25
+Image=nginx:1.26
 ContainerName=nginx
 PublishPort=8080:80

Summary:
  Services affected: nginx
  Port conflicts: none
  Volume conflicts: none
```

### Success Metrics

After this issue, users should be able to:

1. Stage updates safely without affecting production
2. Preview exactly what will change
3. Apply updates with confidence (automatic backup)
4. Discard updates if not satisfied
5. Have automatic rollback on failure
6. See clear diffs similar to Git
7. Understand service impact before applying

This implements the safe update workflow that makes Leger production-ready. 🚀
