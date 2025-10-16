# Issue #14: Core Deployment Infrastructure

## Overview

Implement the complete deployment infrastructure including package scaffolding, Git operations, native Podman integration, and full deployment workflow (install, list, remove, service management).

This is the foundation issue that enables all subsequent features.

## Scope

### 1. Internal Package Scaffolding
- Create all internal packages with interfaces and basic types
- Establish package structure per `docs/NEWEST-LEGER-CLI-IMPLEMENTATION-MAPPING.md`

### 2. Git Operations
- Repository cloning (GitHub, GitLab, leger.run)
- URL parsing (handle tree paths)
- Subpath extraction

### 3. Native Podman Integration
- Quadlet installation via `podman quadlet install`
- Service listing via `podman quadlet list`
- Quadlet removal via `podman quadlet rm`
- Systemd service management

### 4. Deploy Commands
- `leger deploy install <repo-url>` - Full installation workflow
- `leger deploy list` - List deployed quadlets with status
- `leger deploy remove <name>` - Remove with volume handling
- Service management (start/stop/restart/logs)

---

## Reference Material for This Issue

### Primary Specification
- **`docs/LEGER-CLI-SPEC-FINAL.md`**
  - § 4.2.1 (Deploy Install Command)
  - § 4.2.3 (Deploy List)
  - § 4.2.4 (Deploy Remove)
  - § 4.5 (Service Commands)

### Implementation Patterns

**Git Operations**:
- `docs/pq/cmd/install.go` (lines 50-200) - Git cloning patterns
- `docs/quadlets/git-source-parser.nu` - URL parsing (port from Nushell to Go)

**Native Podman Commands**:
- `docs/leger-cli-better-pq/pq_native_podman_implementation.go.example` (complete file) - Why and how to use native commands
- `docs/leger-cli-better-pq/pq_replacement_strategy.md` - Rationale for native approach

**Service Management**:
- `docs/pq/pkg/systemd/daemon.go` - Systemd integration patterns

**Package Structure**:
- `docs/NEWEST-LEGER-CLI-IMPLEMENTATION-MAPPING.md` - Complete package layout

### Usage Examples
- `docs/leger-cli-better-pq/leger-usage-guide.md` § Example 1 (Basic deployment)

---

## Implementation Checklist

**⚠️ v0.1.0 Baseline**: Some components already exist:
- `internal/quadlet/parser.go` handles Secret= directives
- `internal/legerrun/client.go` is complete
- `internal/daemon/client.go` wraps setec.Client
- `cmd/leger/deploy.go` has partial deploy logic for secrets

Focus on expanding these and adding missing pieces (Git, Podman native commands, full deploy workflow).

### Phase 1: Package Scaffolding

**NOTE**: Some packages already exist from v0.1.0 setec integration:
- ✅ `internal/quadlet/parser.go` - For Secret= directives (EXISTS)
- ✅ `internal/daemon/client.go` - setec.Client wrapper (EXISTS)
- ✅ `internal/legerrun/client.go` - leger.run API client (EXISTS)

**NEW packages to create:**

- [ ] Expand `internal/quadlet/` package
  - ✅ `parser.go` - Already has Secret= parsing
  - [ ] `general.go` - General quadlet file parsing (NEW)
  - [ ] `discovery.go` - Quadlet file discovery (NEW)

- [ ] Create `internal/podman/` package
  - [ ] `quadlet.go` - QuadletManager interface
  - [ ] `secrets.go` - SecretsManager interface (integrate with existing setec work)
  - [ ] `volumes.go` - VolumeManager interface
  - [ ] `systemd.go` - Service management

- [ ] Create `internal/git/` package
  - [ ] `clone.go` - Repository cloning
  - [ ] `parser.go` - URL parsing (GitHub/GitLab/leger.run)
  - [ ] `types.go` - Repository struct

- [ ] Create `internal/validation/` package (stubs for now)
  - [ ] `syntax.go` - Quadlet syntax validation
  - [ ] `conflicts.go` - Port/volume conflicts

- [ ] Create `pkg/types/` package
  - [ ] `quadlet.go` - QuadletMetadata, QuadletInfo
  - [ ] `manifest.go` - Manifest formats
  - [ ] `deployment.go` - Deployment state

### Phase 2: Git Operations

- [ ] Implement `internal/git/clone.go`
  ```go
  func Clone(repo Repository) (string, error)
  // 1. Create temp directory
  // 2. Execute git clone
  // 3. Extract subpath if needed
  // 4. Return path to quadlet files
  ```
  Pattern: `docs/pq/cmd/install.go:downloadDirectory()`

- [ ] Implement `internal/git/parser.go`
  ```go
  func ParseURL(gitURL, branch string) (*Repository, error)
  // Handle formats:
  // - https://github.com/org/repo/tree/branch/path
  // - https://github.com/org/repo
  // - https://static.leger.run/{uuid}/latest/
  ```
  Pattern: Port from `docs/quadlets/git-source-parser.nu` (lines 15-40)

### Phase 3: Native Podman Integration

- [ ] Implement `internal/podman/quadlet.go`
  ```go
  func Install(quadletPath string, scope string) error {
      args := []string{"quadlet", "install"}
      if scope == "user" {
          args = append(args, "--user")
      }
      args = append(args, quadletPath)
      return exec.Command("podman", args...).Run()
  }
  
  func List(scope string) ([]QuadletInfo, error) {
      args := []string{"quadlet", "list", "--format", "json"}
      if scope == "user" {
          args = append(args, "--user")
      }
      // Execute and parse JSON output
  }
  
  func Remove(name string, scope string) error {
      args := []string{"quadlet", "rm"}
      if scope == "user" {
          args = append(args, "--user")
      }
      args = append(args, name)
      return exec.Command("podman", args...).Run()
  }
  ```
  Pattern: `docs/leger-cli-better-pq/pq_native_podman_implementation.go.example` (lines 40-200)

- [ ] Implement `internal/podman/systemd.go`
  ```go
  func GetServiceStatus(serviceName, scope string) (ServiceStatus, error)
  func StopService(serviceName, scope string) error
  func StartService(serviceName, scope string) error
  func RestartService(serviceName, scope string) error
  func GetLogs(serviceName, scope string, follow bool, lines int) error
  ```
  Pattern: `docs/pq/pkg/systemd/daemon.go`

- [ ] Implement `internal/podman/volumes.go` (basic - full implementation in Issue #17)
  ```go
  func Exists(volumeName string) (bool, error)
  func Remove(volumeName string) error
  ```

### Phase 4: Validation

- [ ] Implement `internal/validation/syntax.go`
  ```go
  func ValidateQuadletSyntax(path string) error
  // Basic checks:
  // - File extensions (.container, .volume, etc.)
  // - Required sections exist ([Unit], [Container], etc.)
  // - Common syntax errors
  ```
  Pattern: Simplified version of `docs/quadlets/quadlet-validator.nu:validateContainer()`

- [ ] Implement `internal/validation/conflicts.go`
  ```go
  func CheckPortConflicts(ports []Port) ([]PortConflict, error)
  func CheckVolumeConflicts(volumes []Volume) ([]VolumeConflict, error)
  ```
  Pattern: Port from `docs/quadlets/quadlet-validator.nu:checkPortConflicts()` (lines 120-150)

### Phase 5: Deploy Commands

- [ ] Implement `leger deploy install`
  ```go
  // cmd/leger/deploy.go
  func deployInstallCmd() *cobra.Command {
      RunE: func(cmd *cobra.Command, args []string) error {
          // 1. Parse repository URL
          // 2. Clone repository
          // 3. Discover/validate quadlet files
          // 4. Check conflicts
          // 5. Install using native Podman
          // 6. Start services
          // 7. Save deployment state
      }
  }
  ```
  Flow: `docs/LEGER-CLI-SPEC-FINAL.md` § 4.2.1 (complete steps 1-15)

- [ ] Implement `leger deploy list`
  ```go
  func deployListCmd() *cobra.Command {
      RunE: func(cmd *cobra.Command, args []string) error {
          // 1. Call podman.List()
          // 2. Get service status for each
          // 3. Format as table
      }
  }
  ```
  Pattern: `docs/pq/cmd/list.go` + native Podman list

- [ ] Implement `leger deploy remove`
  ```go
  func deployRemoveCmd() *cobra.Command {
      RunE: func(cmd *cobra.Command, args []string) error {
          // 1. Confirm with user (unless --force)
          // 2. Stop services
          // 3. Handle volumes per flags
          // 4. Remove using native Podman
          // 5. Update deployment state
      }
  }
  ```
  Pattern: `docs/pq/cmd/remove.go` (confirmation) + native Podman remove

- [ ] Implement service management commands
  ```go
  func serviceStatusCmd() *cobra.Command
  func serviceLogsCmd() *cobra.Command
  func serviceStartCmd() *cobra.Command
  func serviceStopCmd() *cobra.Command
  func serviceRestartCmd() *cobra.Command
  ```
  Pattern: `docs/pq/pkg/systemd/daemon.go` (systemd integration)

---

## Testing Checklist

### Unit Tests

- [ ] `internal/git/parser_test.go`
  - [ ] Parse GitHub URLs with/without tree path
  - [ ] Parse GitLab URLs
  - [ ] Parse leger.run URLs
  - [ ] Invalid URLs return errors

- [ ] `internal/git/clone_test.go`
  - [ ] Mock git clone operations
  - [ ] Test subpath extraction
  - [ ] Test error handling

- [ ] `internal/podman/quadlet_test.go`
  - [ ] Mock `exec.Command` for Podman
  - [ ] Verify correct arguments passed
  - [ ] Test JSON parsing from list command
  - [ ] Test error handling

- [ ] `internal/podman/systemd_test.go`
  - [ ] Mock systemctl commands
  - [ ] Parse status correctly
  - [ ] Handle service not found

- [ ] `internal/validation/syntax_test.go`
  - [ ] Valid quadlet files pass
  - [ ] Invalid syntax caught
  - [ ] Missing sections detected

- [ ] `internal/validation/conflicts_test.go`
  - [ ] Port conflicts detected
  - [ ] Volume conflicts detected
  - [ ] No false positives

### Integration Tests

- [ ] **Deploy install from GitHub**
  ```bash
  leger deploy install --source https://github.com/rgolangh/podman-quadlets/tree/main/nginx
  ```
  - [ ] Quadlet installed successfully
  - [ ] Service starts
  - [ ] `podman quadlet list` shows it

- [ ] **Deploy list**
  ```bash
  leger deploy list
  ```
  - [ ] Shows installed quadlets
  - [ ] Displays correct status
  - [ ] Shows ports

- [ ] **Deploy remove**
  ```bash
  leger deploy remove nginx
  ```
  - [ ] Prompts for confirmation
  - [ ] Service stops
  - [ ] Quadlet removed
  - [ ] Verify with `podman quadlet list`

- [ ] **Service management**
  ```bash
  leger service status nginx
  leger service logs nginx
  leger service restart nginx
  ```
  - [ ] Status shows correctly
  - [ ] Logs display
  - [ ] Restart works

### Manual Verification

```bash
# Complete workflow test
# 1. Install test quadlet
leger deploy install --source https://github.com/rgolangh/podman-quadlets/tree/main/nginx

# 2. Verify installation
leger deploy list
# Expected: nginx listed with status "running"

podman quadlet list --user
# Expected: nginx.container present

systemctl --user status nginx.service
# Expected: active (running)

# 3. Test service management
leger service logs nginx --lines 20
# Expected: Log output displayed

leger service restart nginx
# Expected: Service restarts successfully

# 4. Test removal
leger deploy remove nginx --force
# Expected: Service stopped and removed

leger deploy list
# Expected: nginx not present
```

---

## Error Handling Examples

All error messages must be user-friendly:

```go
// ✅ GOOD - Actionable error messages
if err := git.Clone(repo); err != nil {
    return fmt.Errorf(`Failed to clone repository: %w

Verify the repository URL is correct:
  %s

If this is a private repository, ensure:
  - You have access to the repository
  - Your SSH keys are configured
  - You can manually clone: git clone %s`, err, repo.URL, repo.URL)
}

if err := podman.Install(path, scope); err != nil {
    return fmt.Errorf(`Podman quadlet install failed: %w

Verify Podman is installed:
  podman version

Check quadlet files are valid:
  ls %s

Try manual install:
  podman quadlet install --user %s`, err, path, path)
}

// ❌ BAD - Cryptic errors
if err != nil {
    return err
}
```

---

## Acceptance Criteria

### Functionality
- [ ] Can install quadlets from GitHub repositories
- [ ] Can install quadlets from GitLab repositories
- [ ] Can install quadlets from arbitrary Git URLs
- [ ] List command shows all deployed quadlets with status
- [ ] Remove command stops and removes quadlets
- [ ] Service management commands work
- [ ] Volume handling options work (keep/remove)

### Code Quality
- [ ] Uses native `podman quadlet install/list/rm` commands
- [ ] No manual file copying to systemd directories
- [ ] All errors are user-friendly with remediation steps
- [ ] Code follows Go best practices
- [ ] All exported functions have docstrings
- [ ] Conventional commit messages used

### Testing
- [ ] All unit tests pass
- [ ] Integration tests pass with real Git repositories
- [ ] Manual verification steps completed
- [ ] No lint errors

---

## Notes

### Critical Implementation Points

1. **Use Native Podman Commands**
   - This is THE fundamental principle
   - Never manually copy files
   - Let Podman handle systemd integration
   - Reduces code by ~70%

2. **Git Cloning Strategy**
   - Support GitHub tree paths (e.g., `/tree/main/path`)
   - Support GitLab project paths
   - Support leger.run URLs (handled differently in Issue #15)
   - Clone to temp directory, extract needed files

3. **Error Messages**
   - Every error must guide the user
   - Include remediation steps
   - Show relevant commands to debug
   - Never show raw Go errors to users

4. **Service Management**
   - Use systemctl for all service operations
   - Map quadlet names to systemd units correctly
   - Handle both user and system scope
   - Provide clear status output

### Common Pitfalls to Avoid

❌ **Don't manually copy files**
```go
// This defeats the purpose
os.MkdirAll(installDir, 0755)
copyDir(srcDir, installDir)
systemd.DaemonReload()
```

✅ **Do use native commands**
```go
exec.Command("podman", "quadlet", "install", "--user", path).Run()
```

❌ **Don't parse Podman output as text**
```go
// Fragile
output := string(cmd.Output())
lines := strings.Split(output, "\n")
```

✅ **Do use JSON output**
```go
cmd := exec.Command("podman", "quadlet", "list", "--format", "json")
var quadlets []QuadletInfo
json.Unmarshal(output, &quadlets)
```

---

## Success Metrics

After completing this issue, users should be able to:

1. Install any quadlet from a public Git repository
2. List all installed quadlets with their status
3. Remove quadlets cleanly
4. Manage service lifecycle (start/stop/restart/logs)
5. Experience clear, helpful error messages
6. Have all operations backed by native Podman commands

This issue establishes the foundation for all subsequent features. Get this right and the rest follows naturally.

---

**Remember**: This is a comprehensive issue combining multiple features. Take time to study the reference material. The patterns are all there - you're adapting proven code to the Leger architecture. 🚀
