# Issue #19: Polish & Integration Testing

## Overview

Final polish for production readiness: improve UX with colors and progress indicators, comprehensive integration testing, and complete documentation.

## Scope

### 1. UX Improvements
- Color output for better readability
- Progress indicators for long operations
- Improved error message formatting
- Consistent table formatting
- Confirmation prompts

### 2. Integration Testing
- End-to-end test suite
- Multi-service deployment tests
- Update workflow tests
- Backup/restore workflow tests
- Failure scenario tests

### 3. Documentation
- User guide
- Command reference
- Architecture documentation
- Troubleshooting guide
- Example deployments

---

## Reference Material for This Issue

### Primary Specification
- **`docs/LEGER-CLI-SPEC-FINAL.md`** - Complete specification (verify all implemented)
- **`docs/leger-cli-better-pq/leger-usage-guide.md`** - User-facing examples

### Implementation Patterns
- Use Go libraries:
  - `github.com/fatih/color` - Colors
  - `github.com/schollz/progressbar/v3` - Progress bars
  - `github.com/olekukonko/tablewriter` - Tables

---

## Implementation Checklist

### Phase 1: UX Improvements

- [ ] Add color support
  ```go
  // internal/ui/colors.go
  var (
      Success = color.New(color.FgGreen).SprintFunc()
      Error   = color.New(color.FgRed).SprintFunc()
      Warning = color.New(color.FgYellow).SprintFunc()
      Info    = color.New(color.FgCyan).SprintFunc()
  )
  ```

- [ ] Add progress indicators
  ```go
  // internal/ui/progress.go
  func ShowProgress(message string, task func() error) error {
      bar := progressbar.Default(-1, message)
      defer bar.Finish()
      return task()
  }
  ```

- [ ] Standardize table formatting
  ```go
  // internal/ui/table.go
  func FormatTable(headers []string, rows [][]string) string
  ```

- [ ] Improve confirmation prompts
  ```go
  // internal/ui/confirm.go
  func Confirm(message string) bool {
      fmt.Printf("%s [y/N]: ", message)
      // Read input, default to No
  }
  ```

- [ ] Apply UX improvements across all commands
  - [ ] Deploy commands (install, list, remove)
  - [ ] Service commands (status, logs, restart)
  - [ ] Staging commands (stage, diff, apply, discard)
  - [ ] Backup commands (create, list, restore)
  - [ ] Config commands (show, pull)
  - [ ] Secrets commands (list, rotate)

### Phase 2: Integration Tests

- [ ] Create `tests/integration/` directory structure
  ```
  tests/integration/
  ├── deploy_test.go       # Install, list, remove
  ├── staging_test.go      # Stage, diff, apply, discard
  ├── backup_test.go       # Create, restore
  ├── secrets_test.go      # Rotation workflow
  ├── multiservice_test.go # Complex deployments
  └── helpers.go           # Test utilities
  ```

- [ ] Implement end-to-end workflows
  ```go
  // tests/integration/deploy_test.go
  func TestCompleteDeploymentWorkflow(t *testing.T) {
      // 1. Install from Git
      // 2. Verify service running
      // 3. Update deployment
      // 4. Verify update successful
      // 5. Remove deployment
      // 6. Verify cleanup
  }
  ```

- [ ] Test failure scenarios
  ```go
  func TestRollbackOnFailedUpdate(t *testing.T)
  func TestRestoreOnFailedApply(t *testing.T)
  func TestConflictDetection(t *testing.T)
  ```

- [ ] Test multi-service deployments
  ```go
  func TestMultiServiceDeployment(t *testing.T) {
      // Deploy stack: web + db + cache
      // Verify all services communicate
      // Update one service
      // Verify others unaffected
  }
  ```

- [ ] Create CI integration
  ```yaml
  # .github/workflows/integration-tests.yml
  name: Integration Tests
  on: [pull_request]
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - name: Install Podman
        - name: Run Integration Tests
          run: go test ./tests/integration/...
  ```

### Phase 3: Documentation

- [ ] Create **User Guide** (`docs/user-guide.md`)
  ```markdown
  # Leger CLI User Guide
  
  ## Installation
  ## Authentication
  ## Basic Deployment
  ## Managing Services
  ## Updates & Rollbacks
  ## Backup & Restore
  ## Troubleshooting
  ```

- [ ] Create **Command Reference** (`docs/commands.md`)
  ```markdown
  # Command Reference
  
  Complete documentation for all commands with examples
  ```

- [ ] Create **Architecture Document** (`docs/architecture.md`)
  ```markdown
  # Leger Architecture
  
  ## Components
  ## Package Structure
  ## Integration Points
  ## Design Decisions
  ```

- [ ] Create **Troubleshooting Guide** (`docs/troubleshooting.md`)
  ```markdown
  # Troubleshooting
  
  ## Common Issues
  ## Error Messages
  ## Debug Mode
  ## Getting Help
  ```

- [ ] Create **Example Deployments** (`examples/`)
  ```
  examples/
  ├── nginx/
  │   ├── nginx.container
  │   └── .leger.yaml
  ├── wordpress/
  │   ├── wordpress.container
  │   ├── mysql.container
  │   ├── wordpress-data.volume
  │   └── .leger.yaml
  └── README.md
  ```

- [ ] Update main **README.md**
  - [ ] Quick start guide
  - [ ] Feature highlights
  - [ ] Links to documentation
  - [ ] Installation instructions

### Phase 4: Final Polish

- [ ] Add `--debug` flag for verbose output
- [ ] Add `--json` output option for scripting
- [ ] Add shell completions (bash, zsh, fish)
- [ ] Add version command with build info
- [ ] Review all error messages for consistency
- [ ] Add examples to command help text

---

## Testing Checklist

### Manual Testing - Complete Workflows

```bash
# Workflow 1: Fresh Installation
leger auth login
leger deploy install myapp
leger service status myapp
leger service logs myapp --lines 50

# Workflow 2: Updates
leger stage
leger diff
leger apply

# Workflow 3: Backup & Restore
leger backup create myapp
leger backup list
leger backup restore <id>

# Workflow 4: Multi-Service
leger deploy install https://github.com/org/wordpress-stack
leger status
# All services should be running

# Workflow 5: Error Recovery
# Simulate failure, verify rollback

# Workflow 6: Secrets
leger secrets list
leger secrets rotate db-password
```

### Integration Test Execution

```bash
# Run all integration tests
go test -v ./tests/integration/...

# Run specific test
go test -v ./tests/integration/ -run TestCompleteDeploymentWorkflow

# Run with coverage
go test -v -cover ./tests/integration/...
```

---

## Acceptance Criteria

### UX
- [ ] Colors improve readability
- [ ] Progress indicators for long operations
- [ ] Consistent table formatting
- [ ] Clear confirmation prompts
- [ ] Helpful error messages throughout

### Testing
- [ ] All integration tests pass
- [ ] CI runs integration tests on PRs
- [ ] Coverage >70% for critical paths
- [ ] Failure scenarios tested
- [ ] Multi-service deployments tested

### Documentation
- [ ] User guide complete
- [ ] All commands documented
- [ ] Architecture explained
- [ ] Troubleshooting guide helpful
- [ ] Example deployments work

### Polish
- [ ] Debug mode available
- [ ] JSON output option
- [ ] Shell completions
- [ ] Version info complete
- [ ] Help text includes examples

---

## Dependencies

**All previous issues (#14-18)** - This is the final integration issue

---

## Notes

### UX Principles

1. **Color coding**: Green=success, Red=error, Yellow=warning, Cyan=info
2. **Progress indicators**: Show for operations >2 seconds
3. **Tables**: Consistent formatting across all list commands
4. **Confirmations**: Required for destructive operations (unless --force)
5. **Examples**: Every command help includes real example

### Integration Test Strategy

- **Use real Podman**: Not mocked, actual quadlet operations
- **Test fixtures**: Sample quadlets in `tests/fixtures/`
- **Cleanup**: Every test cleans up after itself
- **Isolation**: Tests don't depend on each other
- **Realistic**: Test real-world scenarios

### Documentation Focus

- **User-facing**: Start with what users need
- **Progressive**: Basic → Advanced
- **Examples**: Concrete examples for every feature
- **Troubleshooting**: Common issues with solutions
- **Reference**: Complete command documentation

### Success Metrics

After this issue:
- [ ] CLI feels polished and professional
- [ ] Comprehensive test coverage
- [ ] Complete documentation
- [ ] Ready for 1.0 release
- [ ] Users can self-serve documentation

---

## Final Checklist

- [ ] All commands have color output
- [ ] All long operations show progress
- [ ] All list commands use tables
- [ ] All destructive operations confirm
- [ ] Integration tests cover all workflows
- [ ] CI runs tests automatically
- [ ] User guide complete
- [ ] Command reference complete
- [ ] Examples work end-to-end
- [ ] README updated
