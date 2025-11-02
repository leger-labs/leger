# Leger Command Reference

Complete reference for all Leger CLI commands.

## Global Flags

```bash
--config string    Path to config file (default: ~/.config/leger/config.yaml)
--debug            Enable debug output
--json             Output in JSON format
--help, -h         Show help
--version          Show version information
```

## Command Groups

- [auth](#auth-commands) - Authentication
- [deploy](#deploy-commands) - Deployment management
- [service](#service-commands) - Service control
- [stage/staged](#staging-commands) - Staged updates
- [backup](#backup-commands) - Backup and restore
- [secrets](#secrets-commands) - Secrets management
- [config](#config-commands) - Configuration
- [status](#status-command) - Status overview
- [validate](#validate-command) - Validation

---

## auth Commands

### leger auth login

Authenticate with Tailscale and leger.run.

```bash
leger auth login
```

**What it does:**
1. Authenticates with Tailscale
2. Obtains identity token
3. Connects to legerd daemon
4. Syncs secrets from setec

**Example:**
```bash
$ leger auth login
Opening browser for Tailscale authentication...
✓ Authenticated as user@example.com
✓ Connected to legerd
✓ Secrets synced
```

### leger auth logout

Log out and clear credentials.

```bash
leger auth logout
```

### leger auth status

Check authentication status.

```bash
leger auth status
```

**Output:**
```
Authenticated: yes
User: user@example.com
Tailscale: connected
legerd: running
Secrets synced: 5
```

---

## deploy Commands

### leger deploy install

Install a new quadlet deployment.

```bash
leger deploy install [name] [flags]
```

**Flags:**
- `--source string` - Source repository URL or local path
- `--no-start` - Install but don't start services
- `--dry-run` - Validate and show what would be installed
- `--force` - Skip conflict checks
- `--no-secrets` - Skip secret injection (for testing)

**Examples:**

```bash
# Install from GitHub
leger deploy install myapp --source https://github.com/org/quadlets/tree/main/myapp

# Install from local directory
leger deploy install myapp --source ~/quadlets/myapp

# Install from leger.run
leger deploy install myapp

# Dry run (validate only)
leger deploy install myapp --source ~/quadlets/myapp --dry-run
```

**Process:**
1. Verifies authentication
2. Downloads/locates quadlet files
3. Parses for secrets
4. Fetches secrets from legerd
5. Validates quadlets
6. Installs using `podman quadlet install`
7. Starts services

### leger deploy list

List all deployed quadlets.

```bash
leger deploy list
```

**Output:**
```
NAME       TYPE        STATUS    PORTS
myapp      container   active    8080:80
db         container   active    5432:5432
cache      container   active    6379:6379
```

### leger deploy remove

Remove a deployed quadlet.

```bash
leger deploy remove <name> [flags]
```

**Flags:**
- `--force` - Skip confirmation prompt
- `--keep-volumes` - Preserve volumes (default: true)
- `--remove-volumes` - Remove volumes without backup
- `--backup-volumes` - Create backup before removal

**Examples:**

```bash
# Remove with confirmation
leger deploy remove myapp

# Remove without confirmation
leger deploy remove myapp --force

# Remove and delete volumes
leger deploy remove myapp --remove-volumes

# Backup volumes before removing
leger deploy remove myapp --backup-volumes
```

### leger deploy update

Update a deployment to the latest version.

```bash
leger deploy update [deployment] [flags]
```

**Flags:**
- `--dry-run` - Preview changes without applying
- `--no-backup` - Skip automatic backup (not recommended)
- `--force` - Skip confirmation prompt

**Workflow:**
1. Stages updates (`leger stage`)
2. Shows diff (`leger diff`)
3. Prompts for confirmation
4. Applies updates (`leger apply`)

**Example:**
```bash
leger deploy update myapp
```

---

## service Commands

### leger service status

Show service status.

```bash
leger service status <name>
```

**Example:**
```bash
$ leger service status myapp
myapp.service: active (running)
Ports: 8080:80
Secrets: 2 injected
Uptime: 2 hours
```

### leger service logs

View service logs.

```bash
leger service logs <name> [flags]
```

**Flags:**
- `--follow, -f` - Follow log output
- `--lines, -n int` - Number of lines to show (default: 50)
- `--since string` - Show logs since timestamp

**Examples:**

```bash
# View last 50 lines
leger service logs myapp

# Follow logs
leger service logs myapp --follow

# Show last 100 lines
leger service logs myapp --lines 100

# Show logs from last hour
leger service logs myapp --since "1 hour ago"
```

### leger service restart

Restart a service.

```bash
leger service restart <name>
```

### leger service stop

Stop a service.

```bash
leger service stop <name>
```

### leger service start

Start a service.

```bash
leger service start <name>
```

---

## Staging Commands

### leger stage

Stage updates for deployment.

```bash
leger stage <deployment|all>
```

**Examples:**

```bash
# Stage updates for specific deployment
leger stage myapp

# Stage updates for all deployments
leger stage all
```

**Process:**
1. Fetches latest version from source
2. Downloads to staging directory
3. Validates new version
4. Marks as staged (not applied yet)

### leger staged

List staged updates.

```bash
leger staged
```

**Output:**
```
NAME       OLD VERSION  NEW VERSION  STAGED AT
myapp      1.0.0        1.1.0        2024-10-16 14:30:00
db         2.1.0        2.2.0        2024-10-16 14:31:00
```

### leger diff

Show differences in staged update.

```bash
leger diff <deployment>
```

**Output:**
```
Diff for myapp (1.0.0 → 1.1.0)

Modified files:
  myapp.container

--- a/myapp.container
+++ b/myapp.container
@@ -5,7 +5,7 @@
 [Container]
-Image=myapp:v1.0.0
+Image=myapp:v1.1.0
 ContainerName=myapp

New secrets:
  + myapp/api-key (optional)

Changes summary:
  - Image updated to v1.1.0
  - New optional secret available
```

### leger apply

Apply staged updates.

```bash
leger apply <deployment> [flags]
```

**Flags:**
- `--force` - Skip confirmation prompt
- `--no-backup` - Skip automatic backup (not recommended)

**Process:**
1. Creates automatic backup
2. Stops current service
3. Installs new version
4. Starts updated service
5. Verifies startup

**Example:**
```bash
leger apply myapp
```

### leger discard

Discard staged updates.

```bash
leger discard <deployment>
```

---

## backup Commands

### leger backup create

Create a backup of a deployment.

```bash
leger backup create <deployment|all>
```

**Examples:**

```bash
# Backup specific deployment
leger backup create myapp

# Backup all deployments
leger backup all
```

**What's backed up:**
- Quadlet files
- Configuration
- Volumes (data)
- Metadata

### leger backup list

List backups for a deployment.

```bash
leger backup list <deployment>
```

**Output:**
```
Backups for myapp:

ID                    VERSION  SIZE    CREATED
20241016-144000      1.0.0    2.3 GB  5 minutes ago  (auto-backup)
20241016-143500      1.0.0    2.3 GB  10 minutes ago (manual)
20241015-090000      0.9.0    2.1 GB  1 day ago
```

### leger backup restore

Restore from a backup.

```bash
leger backup restore <deployment> <backup-id>
```

**Example:**
```bash
leger backup restore myapp 20241016-143500
```

**Process:**
1. Stops current service
2. Restores quadlet files
3. Restores volumes
4. Reinstalls quadlets
5. Starts restored service

---

## secrets Commands

### leger secrets sync

Synchronize secrets from leger.run backend to local legerd daemon.

```bash
leger secrets sync [service]
```

**What it does:**
1. Fetches all secrets from leger.run (Cloudflare KV)
2. Connects to legerd daemon
3. Pushes each secret to legerd's local store
4. Verifies all secrets are available

**Arguments:**
- `[service]` (optional): Sync only secrets for specific service (future feature)

**Flags:**
- `--force`: Re-sync even if secrets haven't changed
- `--dry-run`: Show what would be synced without syncing

**Example:**
```bash
# Sync all secrets
$ leger secrets sync
Step 1/4: Authenticating...
✓ Authenticated as: alice@example.ts.net

Step 2/4: Connecting to legerd daemon...
✓ Connected to legerd

Step 3/4: Fetching secrets from leger.run...
✓ Found 3 secrets in leger.run
  - openai_api_key (version 1)
  - anthropic_api_key (version 2)
  - db_password (version 1)

Step 4/4: Syncing secrets to legerd...
  ✓ Synced openai_api_key (version 1)
  ✓ Synced anthropic_api_key (version 2)
  ✓ Synced db_password (version 1)

Sync Summary:
  Synced:  3

✓ Secrets synced successfully

Secrets are now available for deployment:
  leger deploy install <name>
```

**Note:** This is typically done automatically during `leger auth login`, but can be run manually to refresh secrets.

### leger secrets list

List secrets for a deployment.

```bash
leger secrets list [deployment]
```

**Output:**
```
Secrets for myapp:
NAME                    VERSION  SYNCED
myapp/db-password       3        yes
myapp/api-key           1        yes
```

### leger secrets rotate

Rotate a secret.

```bash
leger secrets rotate <secret-name>
```

**Process:**
1. Updates secret in setec
2. legerd detects change
3. Syncs new value to Podman
4. Services must be restarted to use new value

**Example:**
```bash
# Rotate secret
leger secrets rotate db-password

# Restart service to pick up new secret
leger service restart myapp
```

---

## config Commands

### leger config show

Show current configuration.

```bash
leger config show
```

### leger config pull

Pull configuration from leger.run.

```bash
leger config pull
```

---

## status Command

### leger status

Show overview of all deployments.

```bash
leger status [deployment]
```

**Output without argument:**
```
DEPLOYMENT     STATUS    SERVICES  UPTIME
myapp          active    1         2 hours
db             active    1         5 days
cache          active    1         5 days

Total: 3 deployments, 3 services
```

**Output with deployment name:**
```
myapp:
  Status: active (running)
  Services: 1
  Ports: 8080:80
  Volumes: myapp-data (2.3 GB)
  Secrets: 2 injected
  Uptime: 2 hours
```

---

## validate Command

### leger validate

Validate quadlet syntax and configuration.

```bash
leger validate <path>
```

**What it checks:**
- Quadlet file syntax
- Required fields
- Port conflicts
- Volume conflicts
- Service name conflicts
- Secret availability

**Example:**
```bash
$ leger validate ~/quadlets/myapp
Validating ~/quadlets/myapp...
✓ Syntax valid
✓ No dependency issues
✓ No conflicts detected
✓ Validation passed
```

---

## Environment Variables

- `LEGER_CONFIG` - Path to config file (overrides --config)
- `LEGER_DEBUG` - Enable debug mode (overrides --debug)
- `LEGER_TEST_MODE` - Enable test mode (disables actual operations)

---

## Exit Codes

- `0` - Success
- `1` - General error
- `2` - Invalid arguments
- `3` - Authentication failed
- `4` - Validation failed
- `5` - Operation cancelled by user

---

## See Also

- [User Guide](user-guide.md) - Getting started and workflows
- [Architecture](architecture.md) - How Leger works
- [Troubleshooting](troubleshooting.md) - Common issues and solutions
