# Issue #18: Advanced Features - Secrets, Health Checks & Validation

## Overview

Implement advanced features that enhance Leger's production readiness: secret rotation via legerd integration, HTTP health checks for services, and comprehensive validation including dependency analysis and conflict detection.

## Scope

### 1. Secrets Rotation
- `leger secrets rotate <secret-name>` - Rotate secrets via legerd
- Integration with existing auth system
- Graceful service restart after rotation

### 2. Health Checks
- HTTP health check support in `leger service status`
- Configurable health endpoints
- Status indicators (healthy/unhealthy/unknown)

### 3. Enhanced Validation
- Dependency analysis between services
- Port conflict detection (enhanced)
- Volume conflict detection (enhanced)
- `leger validate` command
- `leger check-conflicts` command

---

## Reference Material for This Issue

### Primary Specification
- **`docs/LEGER-CLI-SPEC-FINAL.md`**
  - § 2.3 (Secrets Architecture)
  - § 4.4 (Secrets Commands)
  - § 4.5.1 (Service Status with health checks)

### Implementation Patterns

**Secrets Rotation**:
- Existing `internal/daemon/` client (legerd integration)
- Existing `cmd/leger/auth.go` (authentication patterns)

**Health Checks**:
- `docs/pq/pkg/systemd/daemon.go` - Service status patterns
- HTTP client for health endpoints

**Validation**:
- `docs/quadlets/quadlet-validator.nu` (Port entire file to Go)
  - Lines 1-60: Syntax validation
  - Lines 61-120: Port conflict detection
  - Lines 121-180: Volume conflict detection
  - Lines 181-240: Dependency analysis

---

## Implementation Checklist

### Phase 1: Secrets Rotation

**⚠️ v0.1.0 Note**: `cmd/leger/secrets.go` already exists with:
- ✅ `leger secrets sync` - Syncs from leger.run to legerd
- ✅ Basic secrets listing

**What's needed (extend existing):**

- [ ] Extend `internal/daemon/client.go` with rotation method
```go
  func (c *Client) RotateSecret(secretName string) error
```
  Pattern: Use existing setec.Client patterns

- [ ] Extend `cmd/leger/secrets.go` with rotation command
```go
  func secretsRotateCmd() *cobra.Command {
      // 1. Verify legerd is running
      // 2. Call legerd API to rotate secret
      // 3. Identify services using secret
      // 4. Restart affected services
      // 5. Confirm rotation success
  }
```
  Pattern: Similar to existing sync command

- [ ] Keep and enhance existing commands
  - ✅ `leger secrets sync` - Already works
  - [ ] `leger secrets list` - Enhance to show more detail
  - [ ] `leger secrets rotate <name>` - NEW

### Phase 2: Health Checks

- [ ] Create `internal/health/` package
  ```go
  type HealthCheck struct {
      URL      string
      Timeout  time.Duration
      Expected int // Expected status code
  }
  
  func (h *HealthCheck) Check() (bool, error)
  ```

- [ ] Extend quadlet parsing to extract health check configuration
  ```go
  // Parse custom labels or annotations like:
  // X-HealthCheck-URL=http://localhost:8080/health
  // X-HealthCheck-Timeout=5s
  ```

- [ ] Enhance `leger service status` command
  ```go
  func serviceStatusCmd() *cobra.Command {
      // 1. Get systemd status (existing)
      // 2. Load health check config from quadlet
      // 3. Perform health check if configured
      // 4. Display: Active + Health status
      //    Example: "active (healthy)" or "active (unhealthy)"
  }
  ```

### Phase 3: Enhanced Validation

- [ ] Create `internal/validation/` package (extend from Issue #14)

- [ ] Implement `validator.go`
  ```go
  type Validator struct {
      QuadletDir string
  }
  
  func (v *Validator) ValidateAll() (*ValidationResult, error)
  ```
  Pattern: Port from `docs/quadlets/quadlet-validator.nu` (complete file)

- [ ] Implement `conflicts.go` (enhanced from Issue #14)
  ```go
  func CheckPortConflicts(services []Service) ([]PortConflict, error)
  func CheckVolumeConflicts(services []Service) ([]VolumeConflict, error)
  func CheckNameConflicts(services []Service) ([]NameConflict, error)
  ```

- [ ] Implement `dependencies.go`
  ```go
  type Dependency struct {
      Service    string
      DependsOn  []string
      RequiredBy []string
  }
  
  func AnalyzeDependencies(quadletDir string) ([]Dependency, error)
  // Parse After=, Requires=, Wants= from quadlet [Unit] sections
  // Build dependency graph
  // Detect circular dependencies
  ```

- [ ] Implement validation commands
  ```go
  func validateCmd() *cobra.Command {
      // Comprehensive validation of current deployment
      // - Syntax validation
      // - Conflict detection
      // - Dependency analysis
      // Returns: Clean report with issues highlighted
  }
  
  func checkConflictsCmd() *cobra.Command {
      // Quick conflict check only
      // Useful before staging/applying updates
  }
  ```

### Phase 4: Integration

- [ ] Add validation to `leger deploy install`
  ```go
  // Before installation, validate:
  // 1. Syntax
  // 2. Conflicts with existing deployments
  // 3. Circular dependencies
  ```

- [ ] Add validation to `leger stage`
  ```go
  // When staging, check for conflicts with current state
  ```

- [ ] Add health checks to `leger status` (overall status)
  ```go
  // Show health summary for all services
  ```

---

## Testing Checklist

### Unit Tests
- [ ] `internal/daemon/client_test.go` - Secrets rotation API
- [ ] `internal/health/check_test.go` - Health check logic
- [ ] `internal/validation/validator_test.go` - Validation functions
- [ ] `internal/validation/conflicts_test.go` - Conflict detection
- [ ] `internal/validation/dependencies_test.go` - Dependency analysis

### Integration Tests
- [ ] Secrets rotation with service restart
- [ ] Health checks for HTTP services
- [ ] Validation catches real conflicts
- [ ] Dependency analysis correct

### Manual Verification
```bash
# Test secrets rotation
leger secrets list
leger secrets rotate my-secret
# Verify: Secret rotated, services restarted

# Test health checks
leger service status nginx
# Expected: Shows "active (healthy)"

# Test validation
leger validate
# Expected: Clean report or lists issues

# Test conflict detection
leger check-conflicts
# Expected: No conflicts or lists specific conflicts
```

---

## Error Handling Examples

```go
// ✅ Secrets rotation
if !c.DaemonRunning() {
    return fmt.Errorf(`legerd not running

Start daemon:
  systemctl --user start legerd.service`)
}

// ✅ Health check failure
if !healthy {
    fmt.Printf("⚠️  Service %s is unhealthy\n", serviceName)
    fmt.Printf("   Health check: %s\n", healthURL)
    fmt.Printf("   Check logs: leger service logs %s\n", serviceName)
}

// ✅ Validation errors
if len(conflicts) > 0 {
    fmt.Println("❌ Validation failed:")
    for _, c := range conflicts {
        fmt.Printf("  Port %d: conflict between %s and %s\n", 
            c.Port, c.Service1, c.Service2)
    }
    return fmt.Errorf("resolve conflicts before deploying")
}
```

---

## Acceptance Criteria

### Functionality
- [ ] Can rotate secrets via legerd
- [ ] Services restart after secret rotation
- [ ] Health checks work for HTTP services
- [ ] Status shows health indicators
- [ ] Validation detects syntax errors
- [ ] Conflict detection works (ports, volumes, names)
- [ ] Dependency analysis identifies circular deps

### Code Quality
- [ ] Integrates with existing auth/daemon code
- [ ] Health checks are configurable
- [ ] Validation is comprehensive
- [ ] Error messages guide user

### Testing
- [ ] All unit tests pass
- [ ] Integration tests cover workflows
- [ ] Manual verification completed

---

## Dependencies

- **Issue #14** - Core deployment infrastructure
- **Issue #7** (Phase 1) - legerd HTTP client
- **Issue #8** (Phase 1) - Auth commands

---

## Notes

### Secrets Rotation Flow

```
User: leger secrets rotate db-password
  ↓
1. Verify legerd running
2. Call legerd API: POST /api/v1/secrets/rotate
3. legerd rotates secret in Podman
4. Leger identifies services using secret
5. Restart affected services
6. Confirm success
```

### Health Check Configuration

In quadlet files, use labels:
```ini
[Container]
Image=nginx:latest
Label=x-health-url=http://localhost:8080/health
Label=x-health-timeout=5s
Label=x-health-expected=200
```

### Validation Categories

1. **Syntax**: Valid quadlet format
2. **Conflicts**: Ports, volumes, names
3. **Dependencies**: Circular or missing
4. **Resources**: Disk space, memory limits

