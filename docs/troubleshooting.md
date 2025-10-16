# Troubleshooting Guide

Common issues and solutions for Leger CLI.

## Table of Contents

- [Authentication Issues](#authentication-issues)
- [Daemon Issues](#daemon-issues)
- [Deployment Issues](#deployment-issues)
- [Service Issues](#service-issues)
- [Secret Issues](#secret-issues)
- [Update/Staging Issues](#updatestaging-issues)
- [Backup/Restore Issues](#backuprestore-issues)
- [Getting Help](#getting-help)

---

## Authentication Issues

### Problem: "not authenticated" error

**Symptoms:**
```
Error: not authenticated

Run: leger auth login
```

**Solution:**
```bash
# Re-authenticate
leger auth login

# Verify authentication
leger auth status
```

**Root Causes:**
- Tailscale not logged in
- Authentication token expired
- legerd daemon not running

---

### Problem: Tailscale verification failed

**Symptoms:**
```
Error: Tailscale verification failed: connection refused
```

**Solution:**
```bash
# Check Tailscale status
tailscale status

# If not logged in
tailscale up

# Try authentication again
leger auth login
```

---

## Daemon Issues

### Problem: legerd not running

**Symptoms:**
```
Error: legerd not running

Start with: systemctl --user start legerd.service
```

**Solution:**
```bash
# Check daemon status
systemctl --user status legerd.service

# Start daemon
systemctl --user start legerd.service

# Enable daemon to start on boot
systemctl --user enable legerd.service

# View daemon logs
journalctl --user -u legerd.service -f
```

---

### Problem: Daemon fails to start

**Symptoms:**
```
$ systemctl --user status legerd.service
● legerd.service - Leger Secrets Daemon
   Loaded: loaded
   Active: failed (Result: exit-code)
```

**Solution:**
```bash
# View detailed logs
journalctl --user -u legerd.service -n 50

# Common issues:
# 1. Port already in use
# 2. Permission issues
# 3. Config file errors

# Check config
leger config show

# Try restarting
systemctl --user restart legerd.service
```

---

## Deployment Issues

### Problem: Install fails with "invalid Git URL"

**Symptoms:**
```
Error: invalid Git URL: parse error
```

**Solution:**
```bash
# Use full HTTPS URL
leger deploy install myapp --source https://github.com/org/repo/tree/main/path

# Or use local path
leger deploy install myapp --source ~/quadlets/myapp

# Validate URL format:
# ✓ https://github.com/org/repo
# ✓ https://github.com/org/repo/tree/main/subdir
# ✗ git@github.com:org/repo.git (SSH not supported yet)
```

---

### Problem: Port conflicts detected

**Symptoms:**
```
⚠ Port conflicts detected:
  Port 8080/tcp used by: existing-app, myapp

Error: port conflicts found - use --force to skip this check
```

**Solution:**

**Option 1: Change port in quadlet**
```bash
# Edit your quadlet .container file
PublishPort=8081:80  # Changed from 8080
```

**Option 2: Remove conflicting service**
```bash
leger deploy remove existing-app
```

**Option 3: Force install (not recommended)**
```bash
leger deploy install myapp --force
```

---

### Problem: Quadlet validation failed

**Symptoms:**
```
Error: validation failed: missing required field 'Image' in myapp.container
```

**Solution:**
```bash
# Validate locally first
leger validate ~/quadlets/myapp

# Common validation issues:
# - Missing required fields (Image, ContainerName)
# - Invalid syntax
# - Missing .leger.yaml file

# Example valid .container file:
[Unit]
Description=My App

[Container]
Image=myapp:latest
ContainerName=myapp
PublishPort=8080:80

[Service]
Restart=always

[Install]
WantedBy=default.target
```

---

## Service Issues

### Problem: Service won't start

**Symptoms:**
```
$ leger service status myapp
myapp.service: failed
```

**Solution:**
```bash
# Check detailed status
systemctl --user status myapp.service

# View logs
leger service logs myapp --lines 100

# Common issues:
# 1. Image pull failed
# 2. Port already in use
# 3. Volume mount issues
# 4. Secret not available

# Check if image exists
podman images | grep myapp

# Check port usage
ss -tlnp | grep 8080

# Restart service
leger service restart myapp
```

---

### Problem: Can't view logs

**Symptoms:**
```
Error: failed to get logs: no such service
```

**Solution:**
```bash
# List all services
leger deploy list

# Check service name (should include .service)
systemctl --user list-units | grep myapp

# View logs directly via systemd
journalctl --user -u myapp.service -f
```

---

## Secret Issues

### Problem: Secrets not injected

**Symptoms:**
- Service starts but can't access secrets
- Environment variables not set
- Application reports missing credentials

**Solution:**
```bash
# Check daemon is running
systemctl --user status legerd.service

# View daemon logs
journalctl --user -u legerd.service

# Verify secrets exist
leger secrets list myapp

# Check Podman secrets
podman secret ls --user

# Re-sync secrets
systemctl --user restart legerd.service

# Restart service to pick up secrets
leger service restart myapp
```

---

### Problem: Secret not found in legerd

**Symptoms:**
```
Error: secret "myapp/db-password" not found in legerd

Ensure secrets are synced: leger auth login
```

**Solution:**
```bash
# Re-authenticate to sync secrets
leger auth login

# Verify secret exists in setec
setec -s https://setec.example.ts.net list | grep myapp

# If secret missing, create it in setec
setec -s https://setec.example.ts.net put leger/<uuid>/myapp/db-password

# Wait for daemon to sync (or restart)
systemctl --user restart legerd.service
```

---

## Update/Staging Issues

### Problem: No updates available

**Symptoms:**
```
$ leger stage myapp
No updates available for myapp
```

**Explanation:**
- Current version matches source version
- This is normal if already up-to-date

**To force re-stage:**
```bash
# Check current version
leger status myapp

# Stage from specific source
leger stage myapp --source https://github.com/org/repo/tree/main/myapp
```

---

### Problem: Apply failed midway

**Symptoms:**
```
$ leger apply myapp
Creating automatic backup...
✓ Backup created
Stopping service...
✓ Stopped
Installing new version...
Error: installation failed
```

**Solution:**
```bash
# Check what's staged
leger staged

# View available backups
leger backup list myapp

# Restore from automatic backup
leger backup restore myapp <backup-id>

# After restore, discard bad staged update
leger discard myapp
```

---

## Backup/Restore Issues

### Problem: Backup fails - insufficient space

**Symptoms:**
```
Error: failed to create backup: no space left on device
```

**Solution:**
```bash
# Check disk space
df -h

# Clean up old backups
leger backup list myapp
# Manually remove old backups from ~/.local/share/leger/backups/

# Configure retention in config
# ~/.config/leger/config.yaml
backup-retention: 3d  # Keep only 3 days
```

---

### Problem: Restore fails - backup not found

**Symptoms:**
```
Error: backup 20241016-143000 not found
```

**Solution:**
```bash
# List available backups
leger backup list myapp

# Check backup directory
ls -la ~/.local/share/leger/backups/myapp/

# Use correct backup ID from list output
```

---

## Performance Issues

### Problem: Slow operations

**Symptoms:**
- Commands take a long time
- Timeouts during install

**Solution:**
```bash
# Check network connectivity
ping github.com

# Check Tailscale connection
tailscale status

# For large images, increase timeout
# (not yet implemented - coming soon)

# Use local source for faster deploys
leger deploy install myapp --source ~/quadlets/myapp
```

---

## Debug Mode

Enable debug mode for detailed output:

```bash
# Set debug flag
leger --debug deploy install myapp

# Or set environment variable
export LEGER_DEBUG=1
leger deploy install myapp

# View all operations and API calls
```

---

## Common Error Messages

### "connection refused"
- **Cause**: Service not running or wrong port
- **Fix**: Check service status, verify ports

### "permission denied"
- **Cause**: Insufficient permissions
- **Fix**: Use `--user` for user services, `sudo` for system services

### "secret not found"
- **Cause**: Secret not synced or wrong name
- **Fix**: Run `leger auth login` to re-sync

### "port already in use"
- **Cause**: Port conflict with existing service
- **Fix**: Change port or remove conflicting service

### "timeout"
- **Cause**: Operation taking too long (network, large images)
- **Fix**: Check network, retry, or use local source

---

## Getting Detailed Logs

### Application Logs
```bash
leger service logs <service> --follow
```

### Daemon Logs
```bash
journalctl --user -u legerd.service -f
```

### Systemd Service Logs
```bash
systemctl --user status <service>.service
journalctl --user -u <service>.service -n 100
```

### Podman Logs
```bash
podman ps --user
podman logs <container-name>
```

---

## Getting Help

If you can't solve the issue:

1. **Gather information**:
   ```bash
   leger version
   leger auth status
   systemctl --user status legerd.service
   journalctl --user -u legerd.service -n 50
   ```

2. **Check existing issues**:
   - https://github.com/leger-labs/leger/issues

3. **Open a new issue**:
   - Include version information
   - Include error messages
   - Include steps to reproduce
   - Include relevant logs

4. **Community support**:
   - GitHub Discussions
   - IRC/Discord (if available)

---

## Emergency Recovery

### Complete Reset

If everything is broken:

```bash
# Stop all services
systemctl --user stop 'leger-*.service'
systemctl --user stop legerd.service

# Remove all deployments
leger deploy list
# Manually remove each: leger deploy remove <name> --force

# Reset configuration
rm -rf ~/.config/leger/
rm -rf ~/.local/share/leger/

# Re-authenticate
leger auth login

# Re-deploy from backups or source
```

### Restore All from Backup

```bash
# List all backups
find ~/.local/share/leger/backups/ -type d -name "2024*"

# Restore each deployment
leger backup restore myapp <backup-id>
leger backup restore db <backup-id>
```

---

## Prevention Tips

1. **Always stage before apply**
   ```bash
   leger stage myapp
   leger diff myapp
   leger apply myapp
   ```

2. **Regular backups**
   ```bash
   # Add to cron
   0 2 * * * leger backup all
   ```

3. **Validate before install**
   ```bash
   leger validate ~/quadlets/myapp
   leger deploy install myapp --dry-run
   ```

4. **Monitor daemon**
   ```bash
   # Watch for issues
   journalctl --user -u legerd.service -f
   ```

5. **Keep backups**
   - Set retention policy in config
   - Keep at least 7 days of backups
   - Test restores occasionally

---

## See Also

- [User Guide](user-guide.md) - General usage
- [Command Reference](commands.md) - All commands
- [Architecture](architecture.md) - How it works
