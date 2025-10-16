# Guide for Claude Code - Leger CLI Implementation

This document provides context for Claude Code when working on Leger CLI issues.

---

## Project Status

### ✅ Complete (Issues #3-19)

**Phase 1: Foundation (Issues #3-8)**
- RPM packaging with nfpm
- CI workflow for releases
- Cobra CLI structure
- Tailscale integration
- legerd HTTP client (setec fork)
- Auth commands
- Secrets sync infrastructure

**Phase 2: Full Implementation (Issues #14-19)**
- Core deployment infrastructure (native Podman quadlet commands)
- Git operations (GitHub, GitLab, generic)
- Multi-source detection and configuration management
- Staged updates workflow (stage/diff/apply/discard)
- Backup and restore system with volumes
- Advanced features (health checks, validation, conflict detection)
- Polish and comprehensive integration testing

### 🚧 Current Work: Issue #20

**leger.run Backend Integration - CLI Side**

Implementing CLI authentication and secret management commands that interact with the leger.run backend API.

**Scope:**
- Authentication commands (`leger auth login/status/logout`)
- Secret management commands (`leger secrets set/list/get/delete`)
- Backend HTTP client with JWT token management
- Token storage in `~/.config/leger/auth.json`

**Complete specification:** `/backlog/ISSUE-20.md`

---

## Key Documentation

### For Issue #20

**Primary References:**
1. `/backlog/ISSUE-20.md` - Complete implementation specification
2. `docs/leger-backend-architecture-decisions.md` - Backend architecture context (v0.1.0 design)

**Existing Code to Build Upon:**
- ✅ `internal/tailscale/status.go` - Tailscale identity reading
- ✅ `cmd/leger/auth.go` - Basic auth command structure
- ✅ `internal/legerrun/client.go` - HTTP client foundation (from Issue #15)

**What's New:**
- `internal/auth/` - Token storage and management
- Enhanced `internal/legerrun/client.go` - Add authentication and secret methods
- Complete `cmd/leger/secrets.go` - Full secret management commands
- JWT token handling
- Tailscale identity verification flow

---

## Implementation Principles

### 1. Issue #20 is Self-Contained

The issue file contains:
- Complete API specifications
- All required code patterns
- Testing requirements
- Integration points with existing code

**Workflow:**
1. Read `/backlog/ISSUE-20.md` completely
2. Reference `docs/leger-backend-architecture-decisions.md` for backend context
3. Implement following the patterns in Issue #20
4. Test per checklist

### 2. Build on Existing Foundation

**Reuse these existing packages:**
- `internal/tailscale/` - Already reads Tailscale status
- `internal/legerrun/` - HTTP client exists, needs auth methods added
- `cmd/leger/auth.go` - Basic structure exists, needs enhancement

**Create these new packages:**
- `internal/auth/` - Token storage and validation

### 3. User-Friendly Error Messages

```go
// ✅ GOOD
if err != nil {
    return fmt.Errorf(`not authenticated: %w

Authenticate with:
  leger auth login

Your Tailscale connection will be verified.`, err)
}

// ❌ BAD
return err
```

### 4. Conventional Commits

```
feat(auth): implement CLI authentication with Tailscale identity
feat(secrets): add secret management commands
fix(auth): handle expired token gracefully
test(secrets): add integration tests for CRUD operations
```

---

## Testing Requirements

### Unit Tests
- Token storage (save/load/clear)
- HTTP client methods (mock responses)
- Error handling and parsing

### Integration Tests
- Requires test leger.run backend or mocks
- Authentication flow end-to-end
- Secret CRUD operations
- Token expiry handling

### Manual Verification
Complete workflow checklist in `/backlog/ISSUE-20.md`

---

## Critical Success Factors

### ✅ DO
- Read Issue #20 completely first
- Reference backend architecture doc for context
- Build on existing packages where possible
- Write actionable error messages
- Include complete testing
- Use conventional commits

### ❌ DON'T
- Implement without reading the issue file
- Ignore existing code patterns
- Create cryptic errors
- Skip testing checklist
- Duplicate functionality

---

## Backend Context

The leger.run backend uses:
- Cloudflare Workers (serverless API)
- Cloudflare KV (encrypted secret storage)
- Tailscale API for identity verification
- JWT tokens for authentication

**CLI's responsibility:** Call backend APIs correctly. Backend verification is handled server-side.

See `docs/leger-backend-architecture-decisions.md` for complete backend architecture (for context only - you're implementing the CLI side).

---

## Summary for Issue #20

1. Read `/backlog/ISSUE-20.md` completely
2. Understand the authentication flow (CLI → backend → Tailscale API verification)
3. Implement auth commands with token storage
4. Implement secret management commands
5. Enhance HTTP client with new methods
6. Test against backend (or mocks)
7. Complete testing checklist
8. Use conventional commits

**The issue file is comprehensive - everything you need is there.**

---

## Getting Help

If blocked:
1. Re-read relevant section of Issue #20
2. Check backend architecture doc for context
3. Review existing similar patterns in codebase
4. Ask in PR with specific question + context
