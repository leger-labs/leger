# Leger Backend Architecture & Specification

**Document Version:** 1.0  
**Status:** Final Specification for v0.1.0 Implementation  
**Purpose:** Complete architectural context and requirements for leger.run backend

---

## Executive Summary

The leger.run backend is the cloud-hosted API and secret storage service for the Leger deployment management system. After extensive research and architectural exploration, we have converged on a **CLI-first, minimal complexity approach** for v0.1.0 that eliminates unnecessary infrastructure while providing full secret management capabilities.

**Key Architectural Principle:** Start with CLI-only secret management using direct Tailscale API verification, with zero external infrastructure requirements. Add webapp convenience features in v0.2.0 using device code authentication flow.

**Technology Stack:**
- **API Platform:** Cloudflare Workers (serverless functions)
- **Storage:** Cloudflare KV (key-value store with encryption)
- **Authentication:** Tailscale API verification (no OAuth server required)
- **Static Hosting:** Cloudflare R2 or Pages (for future rendered quadlets)

**v0.1.0 Deliverable:** CLI can authenticate via Tailscale identity and manage secrets stored encrypted in Cloudflare KV. No webapp. No configuration rendering yet. Pure secret management foundation.

---

## Background and Context

### What is Leger?

Leger is a deployment management system for AI infrastructure on AMD-powered Linux systems, specifically targeting Fedora Atomic distributions (Bluefin/Aurora). It consists of three components:

1. **leger CLI** (Go) - ✅ **Complete** - Manages Podman Quadlet deployments locally using native `podman quadlet install` commands
2. **legerd daemon** (Go, setec fork) - ✅ **Complete** - Local secrets management daemon that creates Podman secrets
3. **leger.run backend** - ⚠️ **Your Task** - Cloud API and secret storage

### The CLI is Already Complete

This is critical to understand: **the CLI implementation is production-ready and complete**. All Issues #14-19 have been successfully implemented:

- Native Podman quadlet installation workflow
- Git repository cloning (GitHub, GitLab, generic)
- Multi-source detection and handling
- Staged updates with diff preview
- Comprehensive backup and restore
- Service lifecycle management
- Health checks and validation
- Polish and integration testing

**Your backend must match the CLI's expectations.** The CLI is the authoritative reference for API contracts and behavior. Do not modify CLI expectations - build the backend to serve them.

---

## Critical Research Findings

This section documents the architectural investigations that led to the v0.1.0 design. Understanding **why** certain approaches were rejected is as important as understanding what was chosen.

### Finding 1: Cloudflare Access is Not Viable for CLI Authentication

**What it is:** Cloudflare Access is an identity-aware proxy that can protect applications with various OAuth providers, including Tailscale.

**Why it seemed promising:** Initial assumption was that we could use Cloudflare Access to protect leger.run API endpoints, allowing only Tailscale-authenticated users through.

**Why it doesn't work:**
- Cloudflare Access is designed exclusively for **browser-based OAuth flows**
- Service tokens bypass identity verification entirely, defeating the purpose
- CLI tools cannot complete browser redirect flows required by OAuth
- Would require exposing authentication infrastructure beyond the Tailscale network
- Adds significant complexity without solving the core authentication problem

**Verdict:** ❌ **Rejected** - Fundamentally incompatible with CLI-first architecture

### Finding 2: tsidp Requires Infrastructure We Want to Avoid

**What it is:** `tsidp` is Tailscale's experimental OIDC/OAuth authorization server. It runs as a service within your Tailscale network and provides standard OAuth2/OIDC endpoints.

**Why it seemed promising:**
- Standard OIDC implementation following industry patterns
- Zero-click authentication for Tailscale users
- Works for both webapp and CLI authentication flows
- Supports authorization code flow and JWKS token validation

**Why it was rejected:**
- Requires deploying and maintaining a persistent service (tsidp instance)
- Marked as experimental, requiring `TAILSCALE_USE_WIP_CODE=1` flag
- **Violates the "no external infrastructure" constraint** - core project requirement
- Would need to run on Railway, AWS, Fly.io, or similar platforms
- Introduces operational overhead (monitoring, updates, availability)
- Creates a single point of failure in the authentication flow

**Verdict:** ❌ **Rejected** - Requires infrastructure deployment that we explicitly want to avoid

May revisit if Tailscale offers a hosted version in the future.

### Finding 3: Tailscale OAuth API is Machine-to-Machine Only

**Research finding:** Tailscale provides two distinct OAuth implementations that are often confused:

1. **Tailscale API OAuth** (Client Credentials grant)
   - Purpose: API automation and management operations
   - Flow: Machine-to-machine authentication for accessing Tailscale's management API
   - No authorization endpoint - only token endpoint
   - Cannot authenticate human users
   - Used for things like: programmatically adding devices, managing ACLs, reading network status

2. **tsidp** (Authorization Code grant)
   - Purpose: User authentication with Tailscale identity
   - Full OIDC/OAuth server implementation
   - Already covered above (rejected due to infrastructure requirement)

**Key insight:** The Tailscale API OAuth is for authenticating **your service to Tailscale**, not for authenticating **users to your service**. These are opposite directions of authentication.

**Verdict:** Tailscale API OAuth cannot be used for user authentication. It's the wrong tool for our use case.

### Finding 4: The "Impossible Trinity" Problem

**The critical insight that resolved weeks of circular reasoning:**

When a user on Tailscale visits a public Cloudflare Workers URL (like `app.leger.run`), they connect via their **public internet connection**, not through their Tailscale connection.

**The fundamental misconception:**
We initially assumed that Cloudflare Workers could see Tailscale IP addresses (100.x.y.z range) in the `cf-connecting-ip` header when Tailscale users connected. This is **impossible** because:

1. Tailscale IPs (100.64.0.0/10) are private RFC 6598 addresses
2. These addresses are never routable over the public internet
3. Cloudflare's edge network receives connections from users' **ISP-assigned public IPs**
4. The Tailscale connection is a separate overlay network, invisible to public routing

**The Impossible Trinity:**

You can choose any two, but not all three:

```
┌─────────────────────────────────────┐
│  1. Webapp on public Cloudflare     │
│     Workers (accessible via public  │
│     URL without VPN connection)     │
└─────────────────────────────────────┘
            ╱  ╲
           ╱    ╲
          ╱      ╲
         ╱        ╲
┌──────────────┐  ┌──────────────────┐
│  2. Detect   │  │  3. No external  │
│  Tailscale   │  │  infrastructure  │
│  users by IP │  │  (no tsidp, no   │
│  address     │  │  auth server)    │
└──────────────┘  └──────────────────┘
```

**The three combinations:**
- **Want #1 + #2?** → Need tsidp running somewhere (infrastructure) ❌
- **Want #1 + #3?** → Cannot detect Tailscale by IP, need device code flow ✅ (v0.2.0)
- **Want #2 + #3?** → CLI-only, no public webapp ✅ (v0.1.0)

**This is why we were going in circles** - we were trying to achieve all three simultaneously, which is architecturally impossible given the constraints.

### Finding 5: Direct Tailscale API Verification is Sufficient

**The breakthrough realization:** We don't need an OAuth server at all for v0.1.0.

**Why it works:**
1. CLI runs on user's device (already connected to Tailscale)
2. CLI can read local Tailscale identity using `tailscale status --json`
3. CLI sends this identity to leger.run backend
4. Backend verifies identity by calling Tailscale's management API
5. Backend issues JWT token for subsequent requests

**The verification flow:**
```
CLI extracts from local Tailscale:
  - User ID (u123456789)
  - Login name (alice@github)
  - Device ID (d987654321)
  - Device hostname
  - Tailnet name

Backend calls Tailscale API:
  GET /api/v2/tailnet/{tailnet}/devices
  (authenticated with Tailscale API key)

Backend finds device in response:
  - Verify device ID matches claim
  - Verify user ID matches device owner
  - Verify device is authorized
  - Verify device not expired

If all checks pass:
  - Issue JWT token to CLI
  - CLI stores token
  - CLI uses token for all subsequent requests
```

**Why this is secure:**
- CLI cannot forge Tailscale identity (backend verifies with authoritative source)
- Tailscale API key stored securely in backend (Cloudflare Workers secrets)
- JWT tokens are short-lived (30 days) with expiry enforcement
- Per-device authentication allows device revocation
- No additional infrastructure required

**Verdict:** ✅ **Chosen for v0.1.0** - Simple, secure, infrastructure-free

---

## Chosen Architecture: v0.1.0 CLI-Only

### Core Design Principles

1. **Constraint Adherence:**
   - ✅ Use only Tailscale services (API for verification, network for connectivity)
   - ✅ Use only Cloudflare services (Workers, KV, Pages/R2 later)
   - ✅ Zero external infrastructure (no VMs, no containers, no databases to manage)
   - ✅ No tsidp, no Cloudflare Access, no OAuth authorization server

2. **Design Philosophy:**
   - Start with the simplest possible implementation
   - Add complexity only when clearly justified by user needs
   - CLI is the primary interface (target users are developers)
   - Webapp is future convenience, not necessity for v0.1.0
   - Don't implement authentication patterns "because they're standard" - implement what works

3. **Scope Discipline:**
   - v0.1.0: Pure secret management via CLI
   - v0.2.0: Add webapp with device code flow (GitHub CLI pattern)
   - Future: Configuration rendering and deployment coordination

### What v0.1.0 Delivers

**For Users:**
- Authenticate leger CLI with Tailscale identity
- Store secrets encrypted in cloud (accessible from any device)
- Retrieve secrets for local deployment
- List, update, and delete secrets
- No webapp - pure CLI workflow

**Technical Scope:**
- Authentication endpoint for CLI
- Secret management endpoints (CRUD operations)
- Cloudflare KV storage with encryption
- JWT token issuance and validation
- Tailscale identity verification via API

**Explicitly Out of Scope for v0.1.0:**
- Webapp UI (deferred to v0.2.0)
- Device code authentication flow (v0.2.0)
- Configuration rendering (future)
- Static file hosting for quadlets (future)
- Multi-device management UI (future)

---

## API Specification for v0.1.0

### Base URL

Production: `https://api.leger.run` or `https://app.leger.run/api`

Environment variable for CLI: `LEGER_API_URL` (defaults to production)

### Authentication Flow

All API requests (except `/auth/cli`) require authentication via JWT token in header:
```
Authorization: Bearer {token}
```

### Endpoint: POST /auth/cli

**Purpose:** Authenticate CLI via Tailscale identity verification

**Request Headers:**
```
Content-Type: application/json
User-Agent: leger-cli/0.1.0
```

**Request Body:**
```json
{
  "tailscale": {
    "user_id": "u123456789",
    "login_name": "alice@github",
    "device_id": "d987654321",
    "device_hostname": "alice-laptop",
    "tailnet": "example.ts.net"
  },
  "cli_version": "0.1.0"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "leg_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 2592000,
    "user_uuid": "550e8400-e29b-41d4-a716-446655440000",
    "user": {
      "tailscale_email": "alice@github",
      "display_name": "Alice Smith"
    }
  }
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "error": {
    "code": "tailscale_verification_failed",
    "message": "Unable to verify Tailscale identity. Device not found in tailnet or unauthorized."
  }
}
```

**Backend Verification Logic:**
1. Extract Tailscale claims from request body
2. Call Tailscale API: `GET /api/v2/tailnet/{tailnet}/devices`
3. Find device in response matching claimed `device_id`
4. Verify `user_id` matches the device's owner
5. Verify device is authorized (not disabled)
6. Verify device has not expired
7. If all checks pass, derive deterministic user UUID from Tailscale user ID
8. Issue JWT token signed with Workers secret
9. Return token to CLI

**Token Format (JWT):**
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "alice@github",
  "tailscale_user_id": "u123456789",
  "tailscale_device_id": "d987654321",
  "iat": 1697472000,
  "exp": 1700064000
}
```

### Endpoint: GET /secrets/list

**Purpose:** List all secrets for authenticated user (metadata only, no values)

**Request Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "secrets": [
      {
        "name": "openai_api_key",
        "created_at": "2025-10-15T10:00:00Z",
        "updated_at": "2025-10-16T12:00:00Z",
        "version": 2
      },
      {
        "name": "anthropic_api_key",
        "created_at": "2025-10-15T10:05:00Z",
        "updated_at": "2025-10-15T10:05:00Z",
        "version": 1
      }
    ],
    "total_count": 2
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "invalid_token",
    "message": "Token expired or invalid. Re-authenticate with: leger auth login"
  }
}
```

### Endpoint: POST /secrets/set

**Purpose:** Create or update a secret

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "openai_api_key",
  "value": "sk-proj-abc123..."
}
```

**Success Response (200 OK for update, 201 Created for new):**
```json
{
  "success": true,
  "data": {
    "name": "openai_api_key",
    "version": 3,
    "updated_at": "2025-10-16T15:00:00Z",
    "message": "Secret updated successfully"
  }
}
```

**Validation:**
- Secret name: alphanumeric, underscores, hyphens only
- Secret name: max 64 characters
- Secret value: max 10KB (reasonable limit for API keys)
- Secret name cannot be empty
- Secret value cannot be empty

### Endpoint: GET /secrets/get/:name

**Purpose:** Retrieve secret value (for CLI use)

**Request Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "name": "openai_api_key",
    "value": "sk-proj-abc123...",
    "version": 3
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "secret_not_found",
    "message": "Secret 'openai_api_key' not found. Create it with: leger secrets set openai_api_key <value>"
  }
}
```

### Endpoint: DELETE /secrets/:name

**Purpose:** Delete a secret permanently

**Request Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "name": "openai_api_key",
    "deleted_at": "2025-10-16T15:30:00Z"
  }
}
```

### Error Response Format

All errors follow consistent structure:

**HTTP Status Codes:**
- `400 Bad Request` - Invalid input (validation failure)
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Valid token but insufficient permissions
- `404 Not Found` - Resource doesn't exist
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Backend error

**Error Body:**
```json
{
  "success": false,
  "error": {
    "code": "error_code_string",
    "message": "Human-readable error message with actionable guidance"
  }
}
```

**Error Codes:**
- `invalid_token` - JWT token invalid or expired
- `tailscale_verification_failed` - Could not verify Tailscale identity
- `secret_not_found` - Requested secret doesn't exist
- `invalid_secret_name` - Secret name validation failed
- `secret_value_too_large` - Secret exceeds size limit
- `rate_limit_exceeded` - Too many requests from this user
- `insufficient_permissions` - User lacks required permissions

---

## Security Model

### Authentication Security

**Tailscale Identity Verification:**
- Backend must never trust CLI-provided identity without verification
- Always call Tailscale API to verify device exists and is authorized
- Check device ownership matches claimed user
- Verify device has not been revoked or expired
- Cache verification results briefly (5 minutes) to reduce API calls

**JWT Token Security:**
- Tokens signed with HS256 algorithm using secret stored in Workers environment
- Secret must be cryptographically random (minimum 32 bytes)
- Tokens include expiry claim (`exp`) - enforce strictly
- Tokens include user UUID (`sub`) - never trust without validation
- Include Tailscale user ID and device ID in token for audit trail
- Tokens are opaque to CLI - no client-side parsing or modification

**Token Lifecycle:**
- Expiry: 30 days from issuance
- No refresh tokens in v0.1.0 (user re-authenticates)
- Token revocation: Not implemented in v0.1.0 (rely on expiry)
- Future: Per-device token management for selective revocation

### Secret Storage Security

**Encryption at Rest:**
- All secret values must be encrypted before storing in Cloudflare KV
- Use AES-256-GCM authenticated encryption
- Master encryption key stored in Cloudflare Workers secrets (not in code)
- Per-secret encryption: Generate unique nonce for each secret
- Store nonce alongside encrypted value in KV

**Encryption Format in KV:**
```json
{
  "encrypted_value": "base64-encoded-ciphertext",
  "nonce": "base64-encoded-nonce",
  "version": 1,
  "created_at": "2025-10-15T10:00:00Z",
  "updated_at": "2025-10-16T12:00:00Z"
}
```

**Key Management:**
- Master key generated once, stored in Workers environment variables
- Key rotation strategy: Not implemented in v0.1.0
- Future: Support key rotation with version tracking

**Access Control:**
- Secrets are namespaced by user UUID
- KV key format: `secrets:{user_uuid}:{secret_name}`
- User can only access their own secrets (enforced by UUID from token)
- No cross-user secret access
- No shared secrets in v0.1.0

### Network Security

**Transport Security:**
- All API communication over HTTPS (TLS 1.3)
- Cloudflare provides automatic TLS termination
- No plaintext transmission of secrets
- CLI validates TLS certificates

**Rate Limiting:**
- Per-user rate limits to prevent abuse
- Suggested limits:
  - Authentication: 10 attempts per hour per Tailscale user
  - Secret operations: 100 operations per hour per user
  - List operations: 200 requests per hour per user
- Return `429 Too Many Requests` with `Retry-After` header

**CORS Policy:**
- No CORS headers in v0.1.0 (API-only, no webapp)
- v0.2.0: Restrict to `app.leger.run` origin only

### Audit and Logging

**What to Log:**
- All authentication attempts (success and failure)
- All secret access operations (create, read, update, delete)
- Failed authorization attempts
- Rate limit hits
- Backend errors

**What NOT to Log:**
- Secret values (never log plaintext)
- JWT tokens (sensitive credentials)
- Encryption keys or nonces
- Full request bodies if they contain secrets

**Log Format:**
```json
{
  "timestamp": "2025-10-16T15:30:00Z",
  "user_uuid": "550e8400-...",
  "action": "secret_read",
  "resource": "openai_api_key",
  "ip_address": "203.0.113.42",
  "user_agent": "leger-cli/0.1.0",
  "result": "success"
}
```

**Retention:**
- Keep logs for 90 days minimum (compliance)
- Aggregate metrics indefinitely
- Allow user to request their audit log (future feature)

---

## Data Storage in Cloudflare KV

### KV Namespace Design

**Namespace: `leger_users`**

Purpose: Store user metadata and authentication state

Key format: `user:{user_uuid}`

Value format:
```json
{
  "user_uuid": "550e8400-e29b-41d4-a716-446655440000",
  "tailscale_user_id": "u123456789",
  "tailscale_email": "alice@github",
  "tailnet": "example.ts.net",
  "display_name": "Alice Smith",
  "created_at": "2025-10-01T08:00:00Z",
  "last_seen": "2025-10-16T15:30:00Z",
  "last_device_id": "d987654321",
  "last_device_hostname": "alice-laptop"
}
```

**Namespace: `leger_secrets`**

Purpose: Store encrypted secret values

Key format: `secrets:{user_uuid}:{secret_name}`

Value format:
```json
{
  "secret_id": "uuid-v4",
  "user_uuid": "550e8400-...",
  "name": "openai_api_key",
  "encrypted_value": "base64-encrypted-data",
  "nonce": "base64-nonce",
  "encryption_version": 1,
  "version": 3,
  "created_at": "2025-10-15T10:00:00Z",
  "updated_at": "2025-10-16T12:00:00Z",
  "last_accessed": "2025-10-16T15:30:00Z",
  "size_bytes": 128
}
```

**Namespace: `leger_audit`** (optional for v0.1.0)

Purpose: Store audit log entries

Key format: `audit:{user_uuid}:{timestamp}:{action_id}`

Value format: See audit logging section above

### User UUID Derivation

**Critical Requirement:** User UUID must be deterministic based on Tailscale identity.

**Why:** User must get same UUID across devices and re-authentications. This ensures their secrets remain accessible.

**Algorithm:**
```
user_uuid = UUID5(namespace_uuid, tailscale_user_id)

Where:
  namespace_uuid = "6ba7b810-9dad-11d1-80b4-00c04fd430c8" (DNS namespace or custom)
  tailscale_user_id = "u123456789" (from Tailscale)
```

**Properties:**
- Same Tailscale user always gets same UUID
- Different Tailscale users get different UUIDs
- Deterministic and reproducible
- No need to store mapping

**Implementation Note:** Use standard UUID v5 generation (SHA-1 based). While SHA-1 is weak for cryptographic purposes, it's fine for non-security UUID generation.

### KV Performance Considerations

**Read Performance:**
- KV is eventually consistent globally
- Reads are very fast (sub-millisecond from edge)
- Cache secret metadata aggressively (5-minute TTL)
- Don't cache secret values (security risk)

**Write Performance:**
- Writes are eventually consistent
- Write to closest Cloudflare datacenter
- Propagation to global edge: ~60 seconds
- User won't notice (CLI operations are infrequent)

**List Operations:**
- KV list is eventually consistent
- Use prefix matching for user's secrets: `secrets:{user_uuid}:`
- KV list returns up to 1000 keys (sufficient for v0.1.0)
- Future: Implement pagination if users exceed 1000 secrets

---

## Implementation Requirements

### Cloudflare Workers Setup

**Workers Structure:**
```
leger-backend/
├── src/
│   ├── index.ts              # Main request router
│   ├── auth/
│   │   ├── cli.ts            # POST /auth/cli handler
│   │   └── verify.ts         # Tailscale verification logic
│   ├── secrets/
│   │   ├── list.ts           # GET /secrets/list handler
│   │   ├── set.ts            # POST /secrets/set handler
│   │   ├── get.ts            # GET /secrets/get/:name handler
│   │   └── delete.ts         # DELETE /secrets/:name handler
│   ├── crypto/
│   │   └── encryption.ts     # AES-GCM encryption/decryption
│   └── middleware/
│       ├── auth.ts           # JWT validation middleware
│       └── ratelimit.ts      # Rate limiting middleware
├── wrangler.toml             # Cloudflare configuration
└── package.json
```

**Environment Variables (Workers Secrets):**
- `TAILSCALE_API_KEY` - Tailscale API key for verification
- `JWT_SECRET` - Secret for signing JWT tokens (256-bit minimum)
- `ENCRYPTION_KEY` - Master key for secret encryption (256-bit)
- `ENVIRONMENT` - "development" or "production"

**KV Bindings in wrangler.toml:**
```toml
kv_namespaces = [
  { binding = "USERS", id = "..." },
  { binding = "SECRETS", id = "..." },
  { binding = "AUDIT", id = "..." }  # optional
]
```

### Tailscale API Integration

**Required Tailscale API Key:**
- Create at: https://login.tailscale.com/admin/settings/keys
- Scope: Read-only access to devices
- Store in Workers secrets as `TAILSCALE_API_KEY`

**API Endpoint:**
```
GET https://api.tailscale.com/api/v2/tailnet/{tailnet}/devices
Authorization: Bearer {tailscale_api_key}
```

**Response Format:**
```json
{
  "devices": [
    {
      "id": "d987654321",
      "user": "u123456789",
      "name": "alice-laptop.example.ts.net",
      "hostname": "alice-laptop",
      "authorized": true,
      "expires": "2026-01-15T00:00:00Z"
    }
  ]
}
```

**Verification Logic:**
1. Make HTTP request to Tailscale API
2. Find device by ID in response
3. Check `device.user` matches claimed user ID
4. Check `device.authorized` is true
5. Check `device.expires` is in future (or null)
6. If all pass, identity is verified

**Error Handling:**
- Tailscale API unreachable: Return 503 Service Unavailable
- Device not found: Return 403 Forbidden (not verified)
- Unauthorized device: Return 403 Forbidden
- Expired device: Return 403 Forbidden

**Caching Strategy:**
- Cache positive verifications for 5 minutes
- Do not cache negative verifications (always recheck)
- Use Workers KV or Durable Objects for cache
- Key: `verify:{tailscale_user_id}:{device_id}`

### JWT Token Implementation

**Library Recommendation:** Use standard JWT library (e.g., `@tsndr/cloudflare-worker-jwt`)

**Token Generation:**
```typescript
const payload = {
  sub: user_uuid,
  email: tailscale_email,
  tailscale_user_id: user_id,
  tailscale_device_id: device_id,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
};

const token = await sign(payload, env.JWT_SECRET);
```

**Token Validation:**
```typescript
const isValid = await verify(token, env.JWT_SECRET);
if (!isValid) {
  return unauthorized("Invalid token");
}

const payload = decode(token);
if (payload.exp < Date.now() / 1000) {
  return unauthorized("Token expired");
}
```

**Token Prefix:** All tokens start with `leg_` to identify them (similar to GitHub's `ghp_` prefix)

### Encryption Implementation

**Algorithm:** AES-256-GCM (Galois/Counter Mode)

**Why GCM:** 
- Authenticated encryption (detects tampering)
- Fast in software and hardware
- NIST approved
- Built into Web Crypto API

**Encryption Flow:**
```typescript
async function encryptSecret(plaintext: string, key: CryptoKey): Promise<{
  ciphertext: string;
  nonce: string;
}> {
  const nonce = crypto.getRandomValues(new Uint8Array(12)); // 96 bits
  const encoded = new TextEncoder().encode(plaintext);
  
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce },
    key,
    encoded
  );
  
  return {
    ciphertext: base64Encode(ciphertext),
    nonce: base64Encode(nonce)
  };
}
```

**Decryption Flow:**
```typescript
async function decryptSecret(
  ciphertext: string,
  nonce: string,
  key: CryptoKey
): Promise<string> {
  const ciphertextBytes = base64Decode(ciphertext);
  const nonceBytes = base64Decode(nonce);
  
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: nonceBytes },
    key,
    ciphertextBytes
  );
  
  return new TextDecoder().decode(plaintext);
}
```

**Key Derivation:**
```typescript
async function getEncryptionKey(masterKey: string): Promise<CryptoKey> {
  const keyData = base64Decode(masterKey);
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}
```

**Master Key Generation (one-time):**
```bash
# Generate 256-bit key
openssl rand -base64 32
```

---

## CLI Integration Points

The backend must satisfy the expectations of the existing CLI implementation. The CLI is authoritative - the backend serves it.

### Authentication Flow from CLI Perspective

1. User runs: `leger auth login`
2. CLI executes: `tailscale status --json`
3. CLI parses: user ID, email, device ID, hostname, tailnet
4. CLI sends: `POST /auth/cli` with identity
5. CLI receives: JWT token and user UUID
6. CLI stores: Token in `~/.config/leger/auth.json`
7. CLI uses token: In `Authorization: Bearer {token}` header for all subsequent requests

### Secret Management from CLI Perspective

**Setting a secret:**
```bash
leger secrets set openai_api_key sk-proj-abc123
```
1. CLI loads token from `~/.config/leger/auth.json`
2. CLI sends: `POST /secrets/set` with name and value
3. CLI receives: Confirmation with version number
4. CLI displays: Success message

**Listing secrets:**
```bash
leger secrets list
```
1. CLI sends: `GET /secrets/list` with token
2. CLI receives: Array of secret metadata
3. CLI displays: Formatted table

**Getting a secret:**
```bash
export KEY=$(leger secrets get openai_api_key)
```
1. CLI sends: `GET /secrets/get/openai_api_key`
2. CLI receives: Secret value
3. CLI prints: Value to stdout (no newline for scripting)

**Deleting a secret:**
```bash
leger secrets delete openai_api_key
```
1. CLI prompts: "Delete secret 'openai_api_key'? [y/N]"
2. User confirms
3. CLI sends: `DELETE /secrets/openai_api_key`
4. CLI receives: Confirmation
5. CLI displays: Success message

### Error Handling from CLI Perspective

**The CLI expects specific error codes** to provide helpful messages:

- `invalid_token` → "Token expired. Re-authenticate with: leger auth login"
- `tailscale_verification_failed` → "Unable to verify Tailscale identity. Check: tailscale status"
- `secret_not_found` → "Secret not found. List secrets: leger secrets list"
- `rate_limit_exceeded` → "Rate limit exceeded. Try again in {seconds} seconds."

The backend must return these error codes consistently so the CLI can provide good UX.

---

## Future Roadmap: v0.2.0 and Beyond

### v0.2.0: Device Code Flow for Webapp

**Objective:** Add webapp UI for secret management while maintaining zero-infrastructure requirement.

**Pattern:** GitHub CLI-style device code authentication

**User Flow:**
1. User visits `app.leger.run` in browser
2. Webapp displays: "Authenticate with Leger CLI"
3. User runs in terminal: `leger auth webapp`
4. CLI generates 6-character code (e.g., "ABC-123")
5. CLI sends to backend: `POST /auth/device/request`
6. CLI displays: "Enter this code in webapp: ABC-123"
7. User types code in webapp
8. Webapp sends: `POST /auth/device/verify` with code
9. Backend verifies code, issues token to webapp
10. Webapp stores token, displays secret management UI

**Why This Works:**
- Webapp runs on public Cloudflare Workers (no infrastructure)
- Authentication still uses CLI with Tailscale verification
- Device code links webapp session to CLI session
- Proven pattern (GitHub, Azure, AWS CLIs all use this)
- No IP detection needed
- No OAuth server needed

**New Endpoints for v0.2.0:**
- `POST /auth/device/request` - CLI requests device code
- `POST /auth/device/verify` - Webapp verifies code
- `GET /auth/device/poll` - CLI polls for webapp approval

**Storage Requirement:**
- KV namespace for device codes (TTL: 10 minutes)
- Key: `device_code:{code}` → `{user_uuid, status, expires}`

### Future: Configuration Rendering

**When:** After webapp is stable and user adoption is strong

**Purpose:** Pre-render quadlet files based on user configuration

**Flow:**
1. User configures services via webapp (or CLI)
2. Backend renders quadlet templates with user settings
3. Backend publishes to `static.leger.run/{user_uuid}/latest/`
4. CLI fetches rendered quadlets: `leger deploy install`
5. CLI installs using native Podman commands

**Requirements:**
- Template engine for quadlet files
- Static file hosting (Cloudflare R2 or Pages)
- Versioning system for configurations
- Manifest generation with checksums

**Complexity:** High - deferred until proven user need

---

## Success Criteria for v0.1.0

### Functional Requirements

- [ ] CLI can authenticate using Tailscale identity
- [ ] Backend verifies identity via Tailscale API
- [ ] JWT tokens issued with proper expiry
- [ ] Users can create secrets
- [ ] Users can list their secrets (metadata only)
- [ ] Users can retrieve secret values
- [ ] Users can update existing secrets
- [ ] Users can delete secrets
- [ ] Secrets encrypted at rest in KV
- [ ] Per-user secret isolation enforced
- [ ] Token validation on all protected endpoints
- [ ] Rate limiting implemented
- [ ] Audit logging functional

### Security Requirements

- [ ] No secret values in logs
- [ ] AES-256-GCM encryption working
- [ ] Master encryption key stored securely
- [ ] Tailscale verification cannot be bypassed
- [ ] JWT tokens properly validated
- [ ] Token expiry enforced
- [ ] Per-user UUID namespace isolation
- [ ] HTTPS enforced (Cloudflare handles this)

### Performance Requirements

- [ ] Authentication: < 500ms average
- [ ] Secret retrieval: < 200ms average
- [ ] Secret creation: < 300ms average
- [ ] List secrets: < 200ms average
- [ ] Backend handles 100 requests/minute per user

### Testing Requirements

- [ ] Unit tests for encryption/decryption
- [ ] Unit tests for JWT generation/validation
- [ ] Integration test for authentication flow
- [ ] Integration test for secret CRUD operations
- [ ] End-to-end test with actual CLI
- [ ] Load testing with simulated users
- [ ] Security audit of authentication flow
- [ ] Verify secrets cannot be accessed cross-user

### Documentation Requirements

- [ ] API documentation (this document serves as spec)
- [ ] Deployment guide for Cloudflare Workers
- [ ] Environment variable configuration guide
- [ ] Troubleshooting guide
- [ ] Security model documentation

### User Experience Requirements

- [ ] CLI gets helpful error messages from API
- [ ] Error codes match CLI expectations
- [ ] API responses include actionable guidance
- [ ] Rate limit headers include retry guidance
- [ ] Authentication works first time

---

## Development and Deployment

### Development Environment

**Local Testing:**
- Use Wrangler CLI for local development
- `wrangler dev` runs Workers locally
- Connect to actual Tailscale API (or mock)
- Use local KV namespaces for testing

**Testing Strategy:**
1. Unit tests for individual functions
2. Integration tests for API endpoints
3. End-to-end tests with real leger CLI
4. Manual testing workflow completion

**CI/CD:**
- GitHub Actions for automated testing
- Automated deployment to staging on PR merge
- Manual promotion to production
- Rollback capability

### Deployment to Cloudflare

**Prerequisites:**
- Cloudflare account
- Workers paid plan (for KV and compute)
- Tailscale account with API key
- Domain for leger.run (or use workers.dev subdomain initially)

**Deployment Steps:**
1. Create KV namespaces (users, secrets, audit)
2. Generate encryption keys (store securely)
3. Set environment variables in Workers dashboard
4. Deploy Workers: `wrangler deploy`
5. Configure custom domain (if applicable)
6. Test authentication with CLI
7. Monitor logs and metrics

**Monitoring:**
- Cloudflare Workers analytics dashboard
- Error rate tracking
- Response time monitoring
- KV read/write metrics
- Rate limit hit tracking

---

## Appendix: Technology Choices

### Why Cloudflare Workers?

- **Serverless:** No infrastructure to manage
- **Global:** Edge compute in 300+ cities
- **Fast:** Sub-millisecond cold starts
- **Cost-effective:** Free tier generous, paid tier reasonable
- **Integrated:** Workers KV included, R2 available
- **TypeScript:** Excellent DX with type safety
- **Standard APIs:** Web Crypto API for encryption

### Why Cloudflare KV?

- **Eventually consistent:** Fine for secret storage (not real-time)
- **Global replication:** Secrets available worldwide
- **Low latency:** Sub-millisecond reads from edge
- **Simple API:** Easy to use, no SQL needed
- **Cost-effective:** 1GB free, cheap beyond that
- **Integrated:** Native Workers binding

### Why NOT Traditional Database?

- **Infrastructure:** PostgreSQL, MySQL require hosting
- **Scaling:** Need to manage scaling, backups
- **Cost:** More expensive than KV for this use case
- **Complexity:** Overkill for simple key-value storage
- **Latency:** Centralized DB slower than edge KV

### Why JWT Tokens?

- **Stateless:** No session storage needed
- **Self-contained:** All claims in token
- **Standard:** Well-understood pattern
- **Secure:** Industry-proven when done right
- **Simple:** Easy to validate on every request

### Why AES-256-GCM?

- **Standard:** NIST approved algorithm
- **Secure:** 256-bit keys, authenticated encryption
- **Fast:** Optimized in hardware and software
- **Built-in:** Web Crypto API support
- **Battle-tested:** Used everywhere (TLS, disk encryption, etc.)

---

## Closing Notes

### What Makes This Architecture "Right"

1. **Respects Constraints:** Zero infrastructure, Tailscale + Cloudflare only
2. **Solves Real Problem:** Secure secret storage across devices
3. **Enables Future:** Device code flow for webapp in v0.2.0
4. **Production Ready:** Security, performance, monitoring built-in
5. **Developer Friendly:** Clear API, good DX for CLI integration

### What Makes This Document Complete

This specification provides:
- **Context:** Why decisions were made (research findings)
- **Scope:** Clear v0.1.0 boundaries
- **Specifications:** Complete API contract
- **Security:** Comprehensive security model
- **Implementation:** Detailed technical requirements
- **Testing:** Clear success criteria
- **Future:** Roadmap for v0.2.0 and beyond

### For the Backend Developer

You have everything you need to implement v0.1.0:
- Complete API specification
- Security requirements
- Data storage design
- Integration points with CLI
- Success criteria

The CLI is waiting for you. Build the backend it expects, and Leger will be complete. 🚀
