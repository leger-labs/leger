# Leger CLI Implementation Mapping

Based on your technical specification and the three inspiration sources (pq, BlueBuild quadlets module, and current leger code), here's a comprehensive implementation plan.

## Executive Summary

**Leger CLI = pq's Go patterns + BlueBuild's advanced features + leger.run integration + Native Podman**

The final implementation will:
- Use **pq's Go/Cobra structure** as the foundation
- Incorporate **BlueBuild's staged updates, backup/restore, and validation** features
- Replace manual file operations with **native Podman quadlet commands**
- Integrate with **leger.run backend** via Tailscale authentication
- Manage secrets through **legerd daemon** (Setec fork)

---

## Package Structure

```go
leger/
├── cmd/
│   └── leger/
│       ├── main.go              // Entry point (from current leger)
│       ├── auth.go              // ✅ Already implemented
│       ├── config.go            // ✅ Partially implemented
│       ├── deploy.go            // 🔄 Needs major work
│       ├── secrets.go           // ✅ Already implemented
│       ├── status.go            // ✅ Partially implemented
│       ├── backup.go            // ❌ NEW - from BlueBuild
│       ├── staged.go            // ❌ NEW - from BlueBuild
│       └── service.go           // ❌ NEW - service management
│
├── internal/
│   ├── auth/                    // Authentication (Tailscale)
│   │   ├── auth.go              // ✅ From current leger
│   │   └── tailscale.go         // Tailscale client wrapper
│   │
│   ├── podman/                  // 🔄 ADAPT from pq + use native commands
│   │   ├── quadlet.go           // Native podman quadlet install/list/rm
│   │   ├── secrets.go           // Podman secrets API
│   │   ├── volumes.go           // Volume backup/restore
│   │   └── systemd.go           // Service management (from pq)
│   │
│   ├── git/                     // 🔄 ADAPT from pq + BlueBuild
│   │   ├── clone.go             // From pq cmd/install.go
│   │   ├── parser.go            // From BlueBuild git-source-parser.nu
│   │   └── source.go            // Handle leger.run + generic Git
│   │
│   ├── staging/                 // ❌ NEW - from BlueBuild
│   │   ├── manager.go           // Stage/apply/discard workflow
│   │   ├── diff.go              // Diff generation
│   │   └── manifest.go          // Staging metadata
│   │
│   ├── backup/                  // ❌ NEW - from BlueBuild
│   │   ├── manager.go           // Backup orchestration
│   │   ├── volumes.go           // Volume backup logic
│   │   └── restore.go           // Restore with rollback
│   │
│   ├── validation/              // ❌ NEW - from BlueBuild
│   │   ├── syntax.go            // Quadlet syntax validation
│   │   ├── dependencies.go      // Dependency graph analysis
│   │   ├── conflicts.go         // Port/volume conflict detection
│   │   └── security.go          // Security context warnings
│   │
│   ├── daemon/                  // 🔄 ADAPT from current leger
│   │   ├── client.go            // ✅ Already exists
│   │   ├── setec.go             // Setec client wrapper
│   │   ├── discovery.go         // Discover quadlets needing secrets
│   │   └── sync.go              // Secret sync to Podman
│   │
│   └── legerrun/                // ❌ NEW - leger.run backend client
│       ├── client.go            // HTTP client with Tailscale auth
│       ├── manifest.go          // Fetch manifests from leger.run
│       └── secrets.go           // Secret metadata from leger.run
│
├── pkg/
│   └── types/                   // Shared types
│       ├── quadlet.go           // Quadlet metadata structures
│       ├── manifest.go          // Manifest format (leger.run + generic)
│       ├── deployment.go        // Deployment state
│       └── config.go            // User configuration
│
├── go.mod
├── go.sum
├── Makefile
└── leger.spec                   // RPM packaging
```

---

## Code Mapping: What to Take From Each Source

### From `pq` (Go Patterns)

#### ✅ **Keep and Adapt**

| pq File | What to Take | Leger Destination | Changes Needed |
|---------|--------------|-------------------|----------------|
| `cmd/install.go` | Git cloning logic | `internal/git/clone.go` | Use as foundation, simplify |
| `cmd/install.go` | Directory copying | `internal/git/clone.go` | Keep for fallback |
| `cmd/list.go` | Repository listing | `cmd/leger/deploy.go` | Adapt for leger.run |
| `cmd/inspect.go` | File reading/display | `cmd/leger/deploy.go` | Enhance with validation |
| `cmd/remove.go` | Removal workflow | `cmd/leger/deploy.go` | Use native Podman commands |
| `pkg/systemd/*` | Systemd integration | `internal/podman/systemd.go` | Keep for service management |

#### ❌ **Replace with Native Podman**

| pq Operation | Current Implementation | New Implementation |
|--------------|----------------------|-------------------|
| Install quadlet | Manual file copy → `~/.config/containers/systemd/` | `podman quadlet install --user <path>` |
| List installed | Manual directory walk | `podman quadlet list --user --format json` |
| Remove quadlet | `os.RemoveAll()` + reload | `podman quadlet rm --user <name>` |
| Dry-run | Call generator directly | `podman quadlet install --dry-run` (or validate syntax) |

**Example: Replace pq's install logic**

```go
// OLD (pq cmd/install.go:119-127)
err = copyDir(filepath.Join(d, quadletName), filepath.Join(installDir, quadletName))
if !noSystemdDaemonReload {
    err = systemd.DaemonReload()
}

// NEW (leger internal/podman/quadlet.go)
func Install(quadletPath string, scope string) error {
    args := []string{"quadlet", "install"}
    if scope == "user" {
        args = append(args, "--user")
    }
    args = append(args, quadletPath)
    return exec.Command("podman", args...).Run()
}
```

---

### From `BlueBuild Quadlets Module` (Advanced Features)

#### ✅ **Port to Go**

| BlueBuild Feature | Nushell File | Leger Go Package | Implementation Notes |
|-------------------|--------------|------------------|---------------------|
| Staged updates | `staged-updates.nu` | `internal/staging/` | Port workflow logic to Go |
| Validation | `quadlet-validator.nu` | `internal/validation/` | Parse quadlet files, check syntax |
| Git source parser | `git-source-parser.nu` | `internal/git/parser.go` | Handle GitHub/GitLab URL parsing |
| Backup with volumes | `staged-updates.nu` (backup functions) | `internal/backup/` | Use `podman volume export` |
| Conflict detection | `quadlet-validator.nu` (checkPortConflicts) | `internal/validation/conflicts.go` | Port logic to Go |
| Dependency analysis | `quadlet-validator.nu` (parseUnitDependencies) | `internal/validation/dependencies.go` | Parse `[Unit]` section |

**Example: Port conflict detection from Nushell to Go**

```go
// From BlueBuild quadlet-validator.nu:checkPortConflicts
// PORT TO: internal/validation/conflicts.go

func CheckPortConflicts(ports []Port) ([]PortConflict, error) {
    // Get listening ports from system
    cmd := exec.Command("ss", "-tlnp")
    output, err := cmd.Output()
    if err != nil {
        return nil, err
    }
    
    var conflicts []PortConflict
    systemPorts := parseSSOutput(string(output))
    
    for _, port := range ports {
        if _, exists := systemPorts[port.Host]; exists {
            conflicts = append(conflicts, PortConflict{
                Port: port.Host,
                Protocol: port.Protocol,
                UsedBy: systemPorts[port.Host],
            })
        }
    }
    
    return conflicts, nil
}
```

---

### From `Current leger` Code

#### ✅ **Already Good - Keep**

| File | What's Good | Keep As-Is |
|------|-------------|------------|
| `cmd/leger/auth.go` | Tailscale auth integration | ✅ Yes |
| `internal/auth/` | Auth state management | ✅ Yes |
| `internal/daemon/client.go` | legerd client | ✅ Yes |

#### 🔄 **Needs Enhancement**

| File | Current State | What to Add |
|------|---------------|-------------|
| `cmd/leger/deploy.go` | Stub with "not implemented" | Full deployment logic with native Podman |
| `cmd/leger/config.go` | Basic show/pull stubs | Manifest fetching from leger.run |
| `cmd/leger/secrets.go` | Basic sync stub | Integration with legerd discovery |

---

