# Authentication

## v1.0 Token Behavior

**IMPORTANT:** Tokens do NOT expire in v1.0. They remain valid indefinitely until you manually log out.

### Token Lifecycle (v1.0)

- **Creation:** Generated on `leger auth login`
- **Expiry:** NONE - tokens never expire client-side
- **Invalidation:** Only via `leger auth logout` or server rejection
- **Future:** v1.1+ will add automatic token refresh with expiry validation

### Why No Expiry in v1.0?

1. **Simplicity:** Faster to ship first release
2. **UX:** Users don't get unexpected "token expired" errors
3. **Development:** Easier to test and debug
4. **Roadmap:** Auto-refresh requires server-side changes (v1.1+)

### Security Considerations

⚠️ **Warning:** Since tokens never expire:
- Anyone with access to `~/.local/share/leger/auth.json` has permanent access
- Server-side token revocation is not implemented in v1.0
- Run `leger auth logout` on shared machines

### Token Storage

- **Location:** `~/.local/share/leger/auth.json`
- **Permissions:** `0600` (owner read/write only)
- **Format:** JSON with token, expiry (ignored), user info

### Commands

```bash
# Authenticate (creates never-expiring token)
leger auth login

# Check authentication status
leger auth status

# Manually invalidate token
leger auth logout
```

## Roadmap: v1.1+ Auto-Refresh

Future versions will implement:
- ✅ Automatic token refresh
- ✅ Expiry validation with safety buffer
- ✅ Refresh token support (requires API changes)
- ✅ Server-side token revocation
