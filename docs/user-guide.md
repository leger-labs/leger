# Leger CLI User Guide

## Table of Contents
- [Installation](#installation)
- [Authentication](#authentication)
- [Basic Deployment](#basic-deployment)
- [Managing Services](#managing-services)
- [Updates & Rollbacks](#updates--rollbacks)
- [Backup & Restore](#backup--restore)
- [Troubleshooting](#troubleshooting)

## Installation

### From RPM (Fedora/RHEL/CentOS)

```bash
# Download the latest RPM
curl -LO https://github.com/leger-labs/leger/releases/latest/download/leger-x86_64.rpm

# Install
sudo dnf install leger-x86_64.rpm

# Start the daemon
systemctl --user enable --now legerd.service
```

### From Source

```bash
# Clone repository
git clone https://github.com/leger-labs/leger
cd leger

# Build
go build -o leger ./cmd/leger

# Install binary
sudo install -m 755 leger /usr/local/bin/

# Set up systemd service
systemctl --user enable --now legerd.service
```

### Verify Installation

```bash
# Check version
leger version

# Verify daemon is running
systemctl --user status legerd.service
```

## Authentication

Leger uses Tailscale for authentication and secure communication with the secrets daemon.

### Login

```bash
# Authenticate with Tailscale
leger auth login

# Check authentication status
leger auth status
```

### Logout

```bash
leger auth logout
```

## Basic Deployment

### Install from Git Repository

```bash
# Install from GitHub
leger deploy install myapp --source https://github.com/org/quadlets/tree/main/myapp

# Install from local directory
leger deploy install myapp --source ~/my-quadlets/myapp

# Install from leger.run (your personal repository)
leger deploy install myapp
```

### List Deployments

```bash
# List all installed quadlets
leger deploy list

# Example output:
# NAME       TYPE        STATUS    PORTS
# myapp      container   active    8080:80
# db         container   active    5432:5432
```

### Remove Deployment

```bash
# Remove a deployment (with confirmation)
leger deploy remove myapp

# Remove without confirmation
leger deploy remove myapp --force

# Remove and delete volumes
leger deploy remove myapp --remove-volumes

# Backup volumes before removal
leger deploy remove myapp --backup-volumes
```

## Managing Services

### Check Status

```bash
# Status of all services
leger status

# Status of specific service
leger status myapp
```

### View Logs

```bash
# View logs
leger service logs myapp

# Follow logs
leger service logs myapp --follow

# Show last 50 lines
leger service logs myapp --lines 50
```

### Service Control

```bash
# Restart service
leger service restart myapp

# Stop service
leger service stop myapp

# Start service
leger service start myapp
```

## Updates & Rollbacks

Leger uses a staged update workflow for safe deployments.

### Stage Updates

```bash
# Stage updates for a specific deployment
leger stage myapp

# Stage updates for all deployments
leger stage all
```

### View Staged Updates

```bash
# List all staged updates
leger staged

# Show detailed diff for a deployment
leger diff myapp
```

### Apply Updates

```bash
# Apply staged update (with confirmation)
leger apply myapp

# Apply without confirmation
leger apply myapp --force

# Apply creates automatic backup before updating
```

### Discard Staged Updates

```bash
# Discard staged updates if you don't want to apply them
leger discard myapp
```

## Backup & Restore

### Create Backups

```bash
# Backup a specific deployment
leger backup create myapp

# Backup all deployments
leger backup all
```

### List Backups

```bash
# List backups for a deployment
leger backup list myapp

# Example output:
# ID                    VERSION  SIZE    CREATED
# 20241016-143000      1.0.0    2.3 GB  5 minutes ago
# 20241015-120000      0.9.0    2.1 GB  1 day ago
```

### Restore from Backup

```bash
# Restore a specific backup
leger backup restore myapp <backup-id>

# Example
leger backup restore myapp 20241016-143000
```

## Secrets Management

### List Secrets

```bash
# List secrets for a deployment
leger secrets list myapp
```

### Rotate Secrets

```bash
# Rotate a specific secret
leger secrets rotate db-password

# The daemon will automatically sync the new secret
```

## Configuration

### Config File Location

`~/.config/leger/config.yaml`

### Example Configuration

```yaml
# Git defaults
default-repo: https://github.com/myorg/quadlets
branch: main

# Directories
staging-dir: /var/lib/leger/staged
backup-dir: /var/lib/leger/backups
backup-retention: 7d

# Daemon configuration
daemon:
  setec-server: https://setec.example.ts.net
  poll-interval: 1h
  secret-prefix: leger/
```

### View Current Configuration

```bash
leger config show
```

## Validation

### Validate Before Installing

```bash
# Validate quadlet syntax
leger validate ~/my-quadlets/myapp

# Dry-run installation
leger deploy install myapp --source ~/my-quadlets/myapp --dry-run
```

### Check for Conflicts

```bash
# Validation automatically checks for:
# - Port conflicts
# - Volume name conflicts
# - Service name conflicts
```

## Troubleshooting

### Service Won't Start

```bash
# Check detailed status
leger status myapp

# View logs
leger service logs myapp --lines 100

# Validate configuration
leger validate myapp
```

### Secrets Not Working

```bash
# Check daemon is running
systemctl --user status legerd.service

# Check daemon logs
journalctl --user -u legerd.service

# Verify authentication
leger auth status

# Re-authenticate if needed
leger auth login
```

### Update Failed

```bash
# Check what's staged
leger staged

# Discard bad update
leger discard myapp

# Restore from backup
leger backup list myapp
leger backup restore myapp <backup-id>
```

### Daemon Issues

```bash
# Check daemon status
systemctl --user status legerd.service

# View daemon logs
journalctl --user -u legerd.service -f

# Restart daemon
systemctl --user restart legerd.service
```

## Best Practices

1. **Always stage updates first**
   - Use `leger stage` before applying updates
   - Review changes with `leger diff`

2. **Regular backups**
   - Create backups before major changes
   - Use `leger backup all` for full system backups

3. **Use user scope for personal services**
   - Default scope is user
   - Only use system scope when services need to be shared

4. **Monitor daemon logs**
   - Check logs regularly: `journalctl --user -u legerd.service -f`
   - Watch for secret sync issues

5. **Validate before committing**
   - Test quadlets locally with `leger validate`
   - Use `--dry-run` to preview installations

## Advanced Usage

### System-Wide Deployments

```bash
# Install as system service (requires root)
sudo leger deploy install monitoring --source https://github.com/org/monitoring --scope=system

# Check system services
sudo leger status
```

### Custom Configuration

```bash
# Use different config file
leger --config /path/to/config.yaml deploy install myapp

# Override specific settings
leger deploy install myapp --source https://custom.git/repo
```

### Integration with Podman

Leger uses native Podman commands, so you can also:

```bash
# View containers directly
podman ps --user

# Inspect containers
podman inspect systemd-myapp

# Check secrets
podman secret ls --user
```

## Getting Help

```bash
# General help
leger --help

# Command-specific help
leger deploy --help
leger deploy install --help

# Report issues
https://github.com/leger-labs/leger/issues
```

## Next Steps

- Read the [Command Reference](commands.md) for detailed command documentation
- Explore [Example Deployments](../examples/) for common setups
- Check [Architecture Documentation](architecture.md) to understand how Leger works
- See [Troubleshooting Guide](troubleshooting.md) for common issues
