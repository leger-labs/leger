# Guide for Claude Code - Leger CLI Implementation

This document provides context for Claude Code when working on Leger CLI issues.

---

## Project Status

### ✅ Complete (Issues #3-20)

**Phase 1: Foundation (Issues #3-8)**
- RPM packaging with nfpm
- CI workflow for releases
- Cobra CLI structure
- Tailscale integration
- legerd HTTP client (setec fork)
- Auth commands
- Secrets sync infrastructure


+**Phase 2: Full Implementation (Issues #14-20)**
+- Authentication commands (login/status/logout)
+- Secret management commands (set/list/get/delete)
+- Backend HTTP client with JWT token management
+- Token storage and validation
Implementing CLI authentication and secret management commands that interact with the leger.run backend API.


**leger.run Backend Integration - CLI Side**
**Scope:**
- Authentication commands (`leger auth login/status/logout`)
- Secret management commands (`leger secrets set/list/get/delete`)
- Backend HTTP client with JWT token management
- Token storage in `~/.config/leger/auth.json`

**Complete specification:** `/backlog/ISSUE-20.md`

---

## Key Documentation

### For Issue #XX

**Primary References:**
1. `/backlog/ISSUE-XX.md` - Complete implementation specification

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

## Backend Context

The leger.run backend uses:
- Cloudflare Workers (serverless API)
- Cloudflare KV (encrypted secret storage)
- Tailscale API for identity verification
- JWT tokens for authentication

**CLI's responsibility:** Call backend APIs correctly. Backend verification is handled server-side.

See `docs/leger-backend-architecture-decisions.md` for complete backend architecture (for context only - you're implementing the CLI side).

