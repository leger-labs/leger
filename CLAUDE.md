# Guide for Claude Code - Leger CLI Implementation

This document provides context for Claude Code when working on Leger CLI issues (Phase 2).

## Project Overview

**Leger** is a Podman Quadlet manager with integrated secrets management. Phase 1 (Issues #3-8) established the foundation. Phase 2 implements the full CLI specification.

---

## Current Architecture

### Completed (Issues #3-8)
✅ RPM packaging with nfpm  
✅ CI workflow for releases  
✅ Cobra CLI structure  
✅ Tailscale integration (internal/tailscale/)  
✅ legerd HTTP client (internal/daemon/)  
✅ Auth commands (cmd/leger/auth.go)

### Implementation Phase (Issues #14-19)
The remaining work follows the **Leger CLI Technical Specification** (`docs/LEGER-CLI-SPEC-FINAL.md`).

---

## Issue Tracking

All issues #14+ are specified in detail in `/backlog/` directory:
- **Issue #14**: Core Deployment Infrastructure
- **Issue #15**: Configuration & Multi-Source Support
- **Issue #16**: Staged Updates Workflow
- **Issue #17**: Backup & Restore System
- **Issue #18**: Secrets & Validation
- **Issue #19**: Polish & Integration Testing

**Always read the issue file first** (`/backlog/ISSUE-XX.md`) before implementation.

Each issue file specifies:
- Complete scope and requirements
- Reference material to study (docs/pq/, docs/leger-cli-better-pq/, docs/quadlets/)
- Implementation checklist
- Testing requirements
- Dependencies

---

## Key Documentation

### Primary Specifications
- **`docs/LEGER-CLI-SPEC-FINAL.md`** - Complete CLI specification (ALWAYS reference)
- **`docs/NEWEST-LEGER-CLI-IMPLEMENTATION-MAPPING.md`** - Package structure and patterns

### Reference Implementations (Per-Issue Basis)

Each issue specifies which reference files to study. The main sources are:

**1. pq (Simple CLI patterns)**
- Location: `docs/pq/`
- Use for: Git cloning, basic CLI structure, systemd integration
- Key patterns:
  - Git operations
  - Repository listing
  - Removal workflows
  - Systemd service management

**2. Leger Better PQ (Native Podman strategy)**
- Location: `docs/leger-cli-better-pq/`
- Use for: Native Podman command integration, architecture patterns
- Key patterns:
  - Why native commands (70% less code)
  - Implementation examples
  - Usage patterns

**3. BlueBuild Quadlets (Advanced features)**
- Location: `docs/quadlets/`
- Use for: Staged updates, backup/restore, validation
- Key patterns (port from Nushell to Go):
  - Staging workflow
  - Validation logic
  - Git URL parsing
  - Conflict detection

**Note**: Issues specify exactly which files to study. Don't read everything at once - focus on what each issue requires.

---

## Implementation Principles

### 1. Native Podman Commands (CRITICAL)

**DO NOT manually copy files**. Use native Podman quadlet commands:

```go
// ✅ CORRECT
func Install(quadletPath string, scope string) error {
    args := []string{"quadlet", "install"}
    if scope == "user" {
        args = append(args, "--user")
    }
    args = append(args, quadletPath)
    return exec.Command("podman", args...).Run()
}

// ❌ WRONG - Don't do this
func install(quadletPath string) error {
    copyDir(quadletPath, installDir)
    systemdDaemonReload()
    // ...
}
```

**Benefits**: 70% less code, better error handling, automatic systemd integration.

### 2. Package Structure

Follow `docs/NEWEST-LEGER-CLI-IMPLEMENTATION-MAPPING.md`:

```
leger/
├── cmd/leger/           # CLI commands (partially complete)
├── internal/
│   ├── podman/         # ⚠️ NEW - Native Podman integration
│   ├── git/            # ⚠️ NEW - Git operations
│   ├── staging/        # ⚠️ NEW - Staged updates
│   ├── backup/         # ⚠️ NEW - Backup/restore
│   ├── validation/     # ⚠️ NEW - Validation
│   ├── legerrun/       # ⚠️ NEW - leger.run backend
│   ├── auth/           # ✅ EXISTS
│   └── daemon/         # ✅ EXISTS
└── pkg/types/          # ⚠️ NEW - Shared types
```

### 3. Reference Material Per Issue

Each issue specifies which files to study. Example format:

```markdown
## Reference Material for This Issue

**Primary Specification**: 
- docs/LEGER-CLI-SPEC-FINAL.md § 4.2 (Deploy Commands)

**Implementation Patterns**:
- docs/pq/cmd/install.go (Git cloning workflow)
- docs/leger-cli-better-pq/pq_native_podman_implementation.go.example (Native commands)

**Port from Nushell**:
- docs/quadlets/git-source-parser.nu (URL parsing logic)

**Usage Examples**:
- docs/leger-cli-better-pq/leger-usage-guide.md (User workflows)
```

**Workflow**:
1. Read issue file (`/backlog/ISSUE-XX.md`)
2. Study ONLY the reference files listed in that issue
3. Implement following the patterns
4. Test per checklist

### 4. Error Messages (User-Friendly)

All errors must guide users to solutions:

```go
// ✅ GOOD
return fmt.Errorf(`legerd not running

Start the daemon:
  systemctl --user start legerd.service

Check logs:
  journalctl --user -u legerd.service -f`)

// ❌ BAD
return fmt.Errorf("daemon error")
```

### 5. Conventional Commits (REQUIRED)

```
feat(deploy): implement quadlet installation from Git
fix(secrets): correct secret sync race condition
docs: update deployment workflow guide
test(backup): add volume backup tests
```

---

## Issue Sequence (6 Comprehensive Issues)

### Issue #14: Core Deployment Infrastructure
**Scope**: Package scaffolding + full deployment workflow (install/list/remove/service management)
**Effort**: 12-15 hours
**Dependencies**: None

### Issue #15: Configuration & Multi-Source Support
**Scope**: Manifest parsing + config commands + leger.run vs Git auto-detection
**Effort**: 10-12 hours
**Dependencies**: #14

### Issue #16: Staged Updates Workflow
**Scope**: Complete staging system (stage/diff/apply/discard)
**Effort**: 12-15 hours
**Dependencies**: #14

### Issue #17: Backup & Restore System
**Scope**: Backup with volumes + restore with rollback
**Effort**: 10-12 hours
**Dependencies**: #14

### Issue #18: Secrets & Validation
**Scope**: Secret rotation + health checks + enhanced validation
**Effort**: 12-14 hours
**Dependencies**: #14, #17 (for service management)

### Issue #19: Polish & Integration Testing
**Scope**: UX improvements + E2E tests + documentation
**Effort**: 15-18 hours
**Dependencies**: All previous

**Total**: ~72-86 hours of focused implementation

---

## Common Patterns

### Git Repository Cloning

Reference: `docs/pq/cmd/install.go:downloadDirectory()`

```go
func CloneQuadlet(gitURL, branch, quadletName string) (string, error) {
    // Parse URL (can include tree path)
    // Clone to temp directory
    // Extract specific directory
    // Return path to quadlet files
}
```

### Native Podman Integration

Reference: `docs/leger-cli-better-pq/pq_native_podman_implementation.go.example`

```go
// Use podman quadlet install/list/rm
// NOT manual file operations
```

### Manifest Handling

Reference: `docs/LEGER-CLI-SPEC-FINAL.md § 6`

```go
type Manifest struct {
    Version    int                 `json:"version"`
    CreatedAt  time.Time          `json:"created_at"`
    Services   []ServiceDefinition `json:"services"`
    Volumes    []VolumeDefinition  `json:"volumes"`
}
```

---

## Per-Issue Workflow

When assigned an issue:

1. **Read Issue File**: `/backlog/ISSUE-XX.md` completely
2. **Study References**: ONLY the files listed in "Reference Material" section
3. **Review Spec**: Relevant sections of `LEGER-CLI-SPEC-FINAL.md`
4. **Implement**: Following patterns from reference files
5. **Test**: Using checklist in issue
6. **Commit**: With conventional commit message

**Don't read all reference material upfront** - each issue tells you what's needed.

---

## GitHub Actions Integration

### Issue Creation

Issues are created manually with format:

```markdown
Title: feat(scope): Brief description

Body:
See /backlog/ISSUE-XX.md for complete specification.

@claude please implement this following the reference material listed in the issue file.

Dependencies: #YY
```

### Claude Code Response

Claude Code should:
1. Read `/backlog/ISSUE-XX.md`
2. Study ONLY specified reference files
3. Implement feature
4. Create PR with conventional commits
5. Include testing evidence in PR

---

## Critical Success Factors

### ✅ DO
- Read issue file completely first
- Study ONLY specified reference files (don't read everything)
- Use native Podman commands
- Write user-friendly error messages
- Include complete testing checklist
- Use conventional commits

### ❌ DON'T
- Skip reference material
- Manually copy quadlet files (use Podman)
- Implement without reading spec section
- Create cryptic error messages
- Skip testing checklist
- Use non-conventional commits
- Read all docs upfront (focus per-issue)

---

### Phase 2 (Current)
- **Full feature implementation**
- **Integration between components**
- **User-facing workflows end-to-end**
- **Complex testing requirements**

---

## Getting Help

If blocked:
1. Check if issue's reference files clarify
2. Review related spec section in `LEGER-CLI-SPEC-FINAL.md`
3. Look at similar patterns in reference implementations
4. Ask in PR comments with specific question + context

---

## Summary Checklist for Each Issue

- [ ] Read `/backlog/ISSUE-XX.md` completely
- [ ] Study ONLY listed reference files (don't over-read)
- [ ] Review spec sections mentioned
- [ ] Implement following patterns
- [ ] Write/update tests
- [ ] Update docs if needed
- [ ] Verify error messages are helpful
- [ ] Use conventional commit format
- [ ] Complete testing checklist
- [ ] Note any blockers or concerns
