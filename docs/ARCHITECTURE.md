# Leger Architecture

## Overview

Leger consists of two binaries:

### leger (CLI)
- **Purpose:** Manage Podman Quadlets from Git repositories
- **Language:** Go
- **Dependencies:** Tailscale, Podman
- **License:** Apache-2.0

### legerd (Daemon)
- **Purpose:** Secrets management service
- **Based on:** tailscale/setec (BSD-3-Clause)
- **Language:** Go
- **Dependencies:** Tailscale
- **License:** BSD-3-Clause

## Authentication

Both components use Tailscale identity:
- No separate authentication system
- Device must be on authenticated Tailnet
- Identity verified via `tailscale status`

## Secrets Flow

### Stage 1: Secrets Management (leger.run backend)
```
User → leger secrets set → Cloudflare Workers API
                                    ↓
                           Cloudflare KV (encrypted)
```

### Stage 2: Sync to Local Daemon
```
User → leger secrets sync → Fetch from leger.run API
                                    ↓
                           Push to legerd HTTP API
                                    ↓
                           SQLite (encrypted at /var/lib/legerd/)
```

### Stage 3: Deployment (legerd → Podman)
```
User → leger deploy install → Parse quadlet Secret= directives
                                    ↓
                           Fetch from legerd (setec.Store)
                                    ↓
                           Create Podman secrets
                                    ↓
                           Install quadlets
                                    ↓
                           Podman injects secrets as env vars
                                    ↓
                           Container starts with secrets
```

## Directory Structure

```
/usr/bin/leger                  # CLI
/usr/bin/legerd                 # Daemon
/etc/leger/config.yaml          # CLI config
/etc/default/legerd             # Daemon env
/var/lib/leger/                 # CLI state
  ├── staged/                   # Staged config updates
  ├── backups/                  # Quadlet backups
  └── manifests/                # Config metadata
/var/lib/legerd/                # Daemon state
  └── secrets.db                # Encrypted secrets
```

## Upstream Relationship

legerd maintains compatibility with setec:
- Same API endpoints
- Same database format
- Same client library
- Can sync upstream quarterly

See [docs/SETEC-SYNC.md](SETEC-SYNC.md) for details.
