# Leger CLI Technical Specification

## 1. System Overview

Leger is a deployment management system consisting of a command-line interface (CLI) and a daemon service. The system manages Podman Quadlet deployments with integrated secrets management via a forked Tailscale Setec implementation.

### 1.1 Design Constraints

- User's canonical configuration repository hosted at static.leger.run with UUID-based paths (preferred source)
- Support for arbitrary Git repositories (GitHub, GitLab, etc.) as additional sources
- Pre-rendered quadlet files (templates processed server-side via leger.run web interface)
- Tailscale authentication required for all leger.run services and legerd access
- User-scope systemd services (rootless by default)
- Native Podman quadlet commands for installation and lifecycle management

### 1.2 Core Capabilities

- Pull pre-configured quadlet deployments from leger.run or any Git repository
- Install using native Podman quadlet commands
- Manage secrets via local legerd daemon and native Podman secrets
- Deploy and lifecycle management of Podman Quadlet services
- Status monitoring of deployed services
- Backup and restore functionality with volume support
- Staged updates with diff preview capability

## 2. Architecture

### 2.1 Component Relationship

```
┌─────────────────────────────────────────────────────────────────┐
│                           leger CLI                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Auth Module  │  │Deploy Module │  │Status Module │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │Secrets Module│  │Backup Module │  │  Git Module  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                          │          │          │
                          │ Podman   │ Tailscale│ Git
                          ▼          ▼          ▼
         ┌─────────────────────────────────────────┐
         │        Native Podman Quadlet            │
         │     (podman quadlet install/rm/list)    │
         └─────────────────────────────────────────┘
                          │
                          ▼
         ┌─────────────────────────────────────────┐
         │           legerd daemon                 │
         │   (Tailscale Setec fork)               │
         │   Background secret sync                │
         │   Discovers quadlet secrets             │
         └─────────────────────────────────────────┘
                          │
                          ▼
         ┌─────────────────────────────────────────┐
         │      Podman Secret Store                │
         │   (~/.local/share/containers/storage)   │
         └─────────────────────────────────────────┘
                          │
                          ▼
         ┌─────────────────────────────────────────┐
         │    Podman Quadlet Services              │
         │    (systemd-managed containers)         │
         └─────────────────────────────────────────┘
```

### 2.2 Deployment Source Model

Configuration sources are Git repositories, with leger.run providing a user's canonical repository:

**Primary Source (leger.run-hosted):**
```
https://static.leger.run/{user-uuid}/latest/
├── manifest.json
├── openwebui.container
├── openwebui.volume
├── litellm.container
├── postgres.container
├── caddy.container
└── cockpit.container
```

**Additional Sources (Generic Git):**
```
https://github.com/org/quadlets/tree/main/myapp
├── .leger.yaml (optional metadata)
├── myapp.container
├── myapp.volume
└── myapp.network
```

The user UUID is obtained from Tailscale authentication. The CLI fetches pre-rendered quadlet files from leger.run or clones from generic Git repositories. The leger.run repository is automatically updated when users save changes via the web interface.

### 2.3 Secrets Architecture

Three-tier secrets system:

**Tier 1: leger.run API (Cloudflare KV)**
- Web interface for users to enter secret values
- Accessible only via Tailscale authentication
- User's web account tied to their Tailscale identity

**Tier 2: legerd Daemon (Setec Fork)**
- Background service running on user's machine
- Authenticates to leger.run using Tailscale
- Pulls encrypted secrets from Cloudflare KV
- Monitors for secret rotation
- Automatically discovers quadlets needing secrets

**Tier 3: Podman Secrets**
- legerd syncs secrets to Podman's secret store
- Quadlets reference Podman secrets using standard Secret= directives
- No leger-specific coupling in quadlet files

## 3. Binary Components

### 3.1 RPM Package Contents

```
/usr/bin/leger                    # CLI binary (single binary, daemon mode via subcommand)
/usr/lib/systemd/user/
    └── legerd.service            # User daemon unit (rootless)
/usr/lib/systemd/system/
    └── legerd.service            # System daemon unit
```

### 3.2 Runtime State Directories

```
~/.local/share/leger/             # CLI state
├── manifest.json                 # Current deployment manifest
├── deployments.yaml              # Deployment metadata
└── auth.json                     # Authentication state

~/.local/share/bluebuild-quadlets/  # Deployment working directories
├── active/                       # Current deployed configuration
├── staged/                       # Staged updates (pre-apply)
└── backups/                      # Timestamped backups

~/.config/containers/systemd/     # Systemd quadlet directory
└── {deployment}/                 # Deployed quadlets

~/.local/share/containers/storage/secrets/  # Podman secret store
└── filedriver/                   # Encrypted secrets
```

## 4. Command Specification

### 4.1 Authentication Commands

#### `leger auth login`

**Purpose**: Authenticate leger CLI with Tailscale identity and leger.run backend.

**Behavior**:
1. Verify Tailscale daemon is running
2. Extract Tailscale identity (user, tailnet, device)
3. Derive user UUID from Tailscale identity
4. Verify connectivity to leger.run API
5. Store authentication token locally

**Error Conditions**:
- Tailscale not installed → Exit with installation instructions
- Tailscale daemon not running → Exit with `sudo tailscale up` instructions
- leger.run API unreachable → Network error with retry suggestion
- Account not linked → Instructions to visit web UI first

#### `leger auth status`

**Purpose**: Display current authentication state.

**Behavior**:
1. Check Tailscale daemon status
2. Load local authentication state
3. Verify authentication with leger.run API
4. Check legerd daemon status
5. Display consolidated status

**Output Format**: Show Tailscale status, Leger authentication status, legerd daemon status, and accessible repositories.

#### `leger auth logout`

**Purpose**: Clear local authentication state.

**Behavior**:
1. Remove local authentication tokens
2. Do not affect Tailscale authentication
3. Optionally clear legerd secrets (with `--purge-secrets` flag)

### 4.2 Deployment Commands

#### `leger deploy install`

**Purpose**: Install quadlet deployment from leger.run or Git repository.

**Behavior**:
1. Authenticate with leger.run API (if using leger.run source)
2. Determine source type:
   - No URL provided: Use `https://static.leger.run/{user-uuid}/latest/`
   - URL provided: Clone from specified Git repository
3. Fetch manifest.json or discover quadlet files
4. Download/clone all quadlet files
5. Verify file checksums against manifest (if available)
6. Stage files in working directory
7. Validate quadlet syntax
8. Check for port/volume conflicts
9. Check if secrets are required (parse quadlet Secret= directives)
10. Verify legerd is running if secrets needed
11. Prompt for confirmation
12. Install using native Podman: `podman quadlet install --user {path}`
13. legerd automatically discovers new quadlets and syncs secrets
14. Start all services defined in manifest
15. Save deployment state

**Flags**:
- `--source <url>`: Specify Git repository URL (default: user's leger.run repo)
- `--no-start`: Install but do not start services
- `--dry-run`: Validate and show what would be installed
- `--force`: Skip conflict checks

**Examples**:
```bash
# Install from user's leger.run repository
leger deploy install myapp

# Install from specific leger.run version
leger deploy install myapp --source https://static.leger.run/{uuid}/v2.1.0/

# Install from generic Git repository
leger deploy install --source https://github.com/org/quadlets/tree/main/nginx

# Install from local development directory
leger deploy install --source ~/dev/my-quadlet
```

#### `leger deploy update`

**Purpose**: Update deployed quadlets to latest version.

**Behavior**:
1. Fetch latest manifest from source (leger.run or Git)
2. Compare with current deployment version
3. Download new/changed files only
4. Stage in working directory
5. Generate diff between current and staged
6. Create automatic backup (unless `--no-backup`)
7. Prompt for confirmation
8. Stop affected services
9. Update quadlet files using `podman quadlet install --user {path}`
10. legerd automatically detects changes and re-syncs secrets
11. Start services
12. Update deployment state

**Flags**:
- `--no-backup`: Skip automatic backup
- `--dry-run`: Show diff without applying
- `--force`: Skip confirmation

#### `leger deploy list`

**Purpose**: List deployed quadlet services.

**Behavior**:
1. Read local deployment state
2. Execute `podman quadlet list --user` for user-scope deployments
3. Execute `podman quadlet list` for system-scope deployments (requires root)
4. Display table of services with status

**Output Format**: Table showing service name, status, ports, source URL, and version.

#### `leger deploy remove`

**Purpose**: Remove deployed quadlets and optionally clean up volumes.

**Behavior**:
1. Stop all services
2. Prompt for volume handling (keep/backup/remove)
3. Remove quadlet files using `podman quadlet rm --user {name}`
4. Optionally remove volumes via `podman volume rm`
5. legerd automatically detects removal and cleans up orphaned secrets
6. Update deployment state

**Flags**:
- `--keep-volumes`: Preserve all volumes (default)
- `--remove-volumes`: Remove volumes without backup
- `--backup-volumes`: Create backup before removal

### 4.3 Backup Commands

#### `leger backup create [NAME]`

**Purpose**: Create timestamped backup of deployment.

**Behavior**:
1. Identify active deployment (NAME optional)
2. Create backup directory with timestamp
3. Copy all quadlet files
4. Export volumes using `podman volume export`
5. Generate manifest with metadata
6. Display backup ID and size

#### `leger backup list`

**Purpose**: List available backups.

**Output Format**: Table showing backup ID, creation time, size, and type (manual/auto).

#### `leger backup restore <BACKUP_ID>`

**Purpose**: Restore deployment from backup.

**Behavior**:
1. Verify backup exists
2. Stop all current services
3. Remove current quadlet files using `podman quadlet rm --user {name}`
4. Restore quadlet files from backup
5. Import volumes using `podman volume import`
6. Install restored quadlets using `podman quadlet install --user {path}`
7. legerd automatically discovers restored quadlets and re-syncs secrets
8. Start services
9. Update deployment state

### 4.4 Secrets Commands

#### `leger secrets sync [SERVICE]`

**Purpose**: Manually trigger secret synchronization from leger.run to legerd and Podman.

**Behavior**:
1. Authenticate with leger.run API via Tailscale
2. Trigger legerd to fetch latest secrets from Cloudflare KV
3. legerd decrypts secrets locally
4. legerd creates/updates Podman secrets
5. Verify all secrets are available

**Arguments**:
- `[SERVICE]` (optional): Sync only secrets for specific service
- If omitted: Sync all secrets for all installed services

**Flags**:
- `--force`: Re-sync even if secrets haven't changed
- `--dry-run`: Show what would be synced without doing it

**Note**: legerd performs automatic background synchronization. This command is for manual intervention only.

**Error Conditions**:
- legerd not running → Instructions to start daemon
- leger.run unreachable → Network error
- Authentication failed → Re-authenticate with `leger auth login`
- Tailscale not authenticated → Authenticate to tailnet

#### `leger secrets list [--podman]`

**Purpose**: List secrets available in legerd and optionally Podman.

**Behavior**:
1. Query legerd for stored secrets
2. Display secret names (not values)
3. If `--podman` flag: Also list Podman secrets with usage info

#### `leger secrets rotate <SECRET_NAME>`

**Purpose**: Rotate a secret by fetching new value and updating everywhere.

**Behavior**:
1. User must update secret value in leger.run web interface first
2. Trigger legerd to fetch new value from Cloudflare KV
3. legerd updates Podman secret (removes old, creates new)
4. Optionally restart affected services
5. Display which services were affected

**Flags**:
- `--no-restart`: Update secret but don't restart services
- `--force`: Skip confirmation

### 4.5 Status Commands

#### `leger status`

**Purpose**: Display comprehensive system status.

**Behavior**:
1. Check Tailscale status
2. Check legerd daemon health
3. Execute `podman quadlet list --user` for service statuses
4. Query HTTP endpoints for health checks (if defined)
5. Display consolidated status

**Output Format**: Show Tailscale connection, legerd status, deployment info, and table of services with health checks.

#### `leger service logs <SERVICE>`

**Purpose**: View logs for a specific service.

**Behavior**:
1. Map service name to systemd unit
2. Execute `journalctl --user -u {service}.service`
3. Display logs with optional follow mode

**Flags**:
- `--follow` / `-f`: Follow logs in real-time
- `--lines N` / `-n N`: Show last N lines (default: 100)
- `--since TIMESTAMP`: Show logs since timestamp

#### `leger service restart <SERVICE>`

**Purpose**: Restart a specific service.

**Behavior**:
1. Map service name to systemd unit
2. Execute `systemctl --user restart {service}.service`
3. Wait for service to reach active state
4. Display status

### 4.6 Configuration Commands

#### `leger config show`

**Purpose**: Display current deployment configuration metadata.

**Behavior**:
1. Read local deployment state
2. Read current manifest from active deployment
3. Display formatted configuration

**Output Format**: Show deployment name, version, source URL, services list, required secrets, and volumes.

### 4.7 Staged Update Commands

#### `leger staged list`

**Purpose**: List staged updates not yet applied.

**Behavior**:
1. Check staged directory
2. Compare staged version with current deployment
3. Display available staged updates

#### `leger diff`

**Purpose**: Show diff between current and staged deployment.

**Behavior**:
1. Read current active quadlets
2. Read staged quadlets
3. Generate unified diff for each changed file
4. Display changes with summary

**Output Format**: Show file diffs and summary of modifications, additions, and removals.

## 5. Secret Injection Workflow

### 5.1 Native Podman Secrets Integration

Quadlet files use standard Podman secret references with no leger-specific directives:

```ini
[Unit]
Description=Open WebUI
After=network-online.target

[Container]
Image=ghcr.io/open-webui/open-webui:main
ContainerName=openwebui
PublishPort=3000:8080
Secret=openai_api_key,type=env,target=OPENAI_API_KEY
Secret=anthropic_api_key,type=env,target=ANTHROPIC_API_KEY

[Service]
Restart=always

[Install]
WantedBy=default.target
```

### 5.2 Secret Lifecycle

**legerd Background Operation**:
- Runs continuously as systemd user service
- Periodically scans `~/.config/containers/systemd/` for installed quadlets
- Parses all quadlet files for `Secret=` directives
- Extracts required secret names from quadlet configurations

**Secret Synchronization**:
- legerd authenticates to leger.run using Tailscale
- Fetches encrypted secrets from Cloudflare KV
- Decrypts secrets locally
- For each required secret:
  - Creates Podman secret: `podman secret create --user {name}`
  - If secret exists, removes and recreates with new value
- Monitors leger.run for secret rotation (configurable poll interval)

**Container Startup**:
- Podman reads `Secret=` directives from quadlet
- Retrieves secrets from Podman secret store
- Injects as environment variables or files into container
- Container process has access to secrets

**Persistence**:
- Secrets remain in Podman's secret store
- Encrypted at rest in `~/.local/share/containers/storage/secrets/`
- Persist across container restarts
- Updated automatically by legerd when rotated in leger.run

### 5.3 Secret Discovery and Mapping

legerd automatically discovers secrets by:
1. Monitoring quadlet installation directory
2. Parsing all `.container` files for `Secret=` directives
3. Extracting secret names (first parameter of Secret= directive)
4. Querying leger.run API for available secrets matching those names
5. Creating mapping: `quadlet_secret_name` → `leger.run/user/{uuid}/secret_name`

Example mapping:
- OpenWebUI quadlet requires: `openai_api_key`, `anthropic_api_key`, `openwebui_secret_key`
- legerd maps these to leger.run paths: `leger/{user-uuid}/openai_api_key`, etc.
- Creates corresponding Podman secrets with matching names
- Quadlets reference secrets by simple names (no paths needed)

## 6. Manifest Format

### 6.1 Deployment Manifest Structure

Located at source repository root as `manifest.json`:

**leger.run Format:**
```json
{
  "version": 3,
  "created_at": "2025-10-16T12:00:00Z",
  "user_uuid": "abc-123-def-456",
  "services": [
    {
      "name": "openwebui",
      "quadlet_file": "openwebui.container",
      "checksum": "sha256:abc123...",
      "image": "ghcr.io/open-webui/open-webui:main",
      "ports": ["3000:8080"],
      "secrets_required": ["openai_api_key", "anthropic_api_key"]
    }
  ],
  "volumes": [
    {
      "name": "openwebui-data",
      "mount_path": "/app/data"
    }
  ]
}
```

**Generic Git Format (.leger.yaml):**
```yaml
name: openwebui
description: Open WebUI for LLM interactions
version: 1.0.0

# Secrets automatically discovered from Secret= directives
# No need to explicitly list them

# Dependencies
requires:
  - redis
  - postgresql

# Metadata for display
ports:
  - 3000:8080

volumes:
  - openwebui-data:/app/data
```

**Auto-Discovery (No Manifest):**
If no manifest exists, leger CLI:
1. Scans directory for `.container`, `.volume`, `.network`, `.pod` files
2. Parses files for basic metadata
3. Generates ephemeral manifest
4. Proceeds with installation

## 7. Error Handling

### 7.1 Error Categories

**Authentication Errors**:
- `ERR_TAILSCALE_NOT_INSTALLED`: Tailscale binary not found
- `ERR_TAILSCALE_NOT_RUNNING`: Daemon not active
- `ERR_TAILSCALE_NOT_AUTHENTICATED`: Device not authenticated to tailnet
- `ERR_LEGER_NOT_AUTHENTICATED`: No valid leger.run authentication
- `ERR_LEGERD_NOT_RUNNING`: legerd daemon not active

**Deployment Errors**:
- `ERR_MANIFEST_FETCH_FAILED`: Cannot retrieve manifest from source
- `ERR_GIT_CLONE_FAILED`: Git repository clone failed
- `ERR_CHECKSUM_MISMATCH`: Downloaded file checksum does not match manifest
- `ERR_PORT_CONFLICT`: Requested port already in use
- `ERR_VOLUME_CONFLICT`: Volume name already exists
- `ERR_PODMAN_INSTALL_FAILED`: Native Podman quadlet install failed

**Secret Errors**:
- `ERR_LEGERD_NOT_RUNNING`: Cannot connect to legerd daemon
- `ERR_SECRET_FETCH_FAILED`: HTTP error retrieving secret from leger.run
- `ERR_SECRET_SYNC_FAILED`: legerd failed to sync secret to Podman
- `ERR_CLOUDFLARE_KV_UNAVAILABLE`: Cannot reach Cloudflare KV storage

**Service Errors**:
- `ERR_SERVICE_START_FAILED`: systemd failed to start service
- `ERR_SERVICE_UNHEALTHY`: Service started but health check failed

### 7.2 Error Message Guidelines

All error messages must include:
1. Clear description of problem
2. Root cause if determinable
3. Actionable remediation steps

## 8. Security Model

### 8.1 Threat Model

**Protected Against**:
- Unauthorized access via Tailscale network perimeter
- Secret exposure on disk (encrypted in legerd and Podman store)
- Man-in-the-middle attacks (Tailscale encrypted tunnel)
- Unauthorized leger.run access (Tailscale authentication required)

**Out of Scope**:
- Root compromise of host system
- Container escape vulnerabilities
- Supply chain attacks on container images
- Cloudflare infrastructure compromise

### 8.2 Secret Storage

**At Rest**:
- leger.run: Encrypted in Cloudflare KV
- legerd: Encrypted storage with Tailscale key material
- Podman: Encrypted filedriver store with restricted permissions (0600)

**In Transit**:
- leger.run → legerd: HTTPS over Tailscale encrypted tunnel
- legerd → Podman: Local filesystem operations
- All leger.run API calls: Authenticated via Tailscale

**In Use**:
- Secrets injected by Podman from encrypted store
- Never persisted as plaintext files
- Automatically managed by Podman lifecycle

### 8.3 Authentication Flow

1. User authenticates to Tailscale (one-time setup)
2. User accesses leger.run web interface (Tailscale auth required)
3. User enters secrets via web form (stored in Cloudflare KV)
4. User runs `leger auth login` on local machine
5. leger CLI verifies Tailscale authentication
6. leger CLI derives user UUID from Tailscale identity
7. User's legerd daemon authenticates to leger.run via Tailscale
8. legerd pulls secrets from Cloudflare KV
9. All subsequent operations use Tailscale authentication

## 9. Monitoring and Health Checks

### 9.1 Service Health Verification

For services with HTTP endpoints, the `leger status` command performs HTTP health checks with 5-second timeout and 2 retries.

### 9.2 legerd Health Check

**Endpoint**: Internal health monitoring (not exposed via HTTP)

**Health Indicators**:
- Tailscale connectivity status
- leger.run API reachability
- Podman secret store accessibility
- Last successful secret sync timestamp

**Failure Conditions**:
- Tailscale not authenticated → Daemon degraded
- leger.run unreachable → Daemon degraded
- Secret sync failures → Logged warnings

## 10. Design Decisions

### 10.1 Included in v1.0

- Native Podman quadlet commands for all operations
- Tailscale-based authentication
- Multi-source support (leger.run preferred, generic Git supported)
- Pre-rendered quadlet files from leger.run (no client-side templating)
- Background secret synchronization via legerd
- Backup and restore with volumes
- Staged updates with diff preview
- Service lifecycle management
- Secret rotation capability
- Auto-discovery of quadlet secrets

### 10.2 Explicitly Not Included

- Client-side template rendering
- Multi-device synchronization
- Blue-green deployments
- Custom repository URLs for leger.run (UUID-based only)
- Secret storage in leger CLI (all secrets in legerd/Podman)

### 10.3 Rationale for Key Decisions

**Server-Side Rendering Only:**
- Reduces CLI complexity
- Provides validated, tested quadlet output
- Enables advanced web UI features without CLI bloat
- User can always use generic Git repos if custom templating needed

**Native Podman Commands:**
- Reduces codebase by ~70%
- Better error handling from Podman
- Future-proof as Podman evolves
- Automatic systemd integration

**Background Secret Sync:**
- No leger-specific coupling in quadlets
- Works with standard Podman Secret= directives
- Automatic secret rotation
- Decoupled architecture

**Tailscale Authentication:**
- Zero-trust security model
- No separate credential management
- Unified authentication across web and CLI
- Encrypted network perimeter
