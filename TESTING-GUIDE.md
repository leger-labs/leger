# Leger CLI Testing Guide

Comprehensive testing walkthrough for validating Leger functionality.
Execute these tests in order, documenting results as you go.

---

## Phase 1: System Status & Configuration (Read-Only)

### Test 1.1: Overall System Status
```bash
leger status
```
**Expected Output:**
- Authentication status with Leger Labs
- legerd daemon connection status
- List of deployed Podman Quadlets
- Git repository sync status

**Verify:**
- [ ] Command executes without errors
- [ ] Status information is clearly formatted
- [ ] Shows current system state

### Test 1.2: View Current Configuration
```bash
leger config show
```
**Expected Output:**
- Active configuration details
- Deployment settings
- Repository locations
- legerd connection details

**Verify:**
- [ ] Configuration displays correctly
- [ ] Paths and settings are accurate
- [ ] No sensitive data exposed inappropriately

### Test 1.3: View Configuration with Verbose Output
```bash
leger -v config show
```
**Verify:**
- [ ] Verbose flag provides additional debug info
- [ ] More detailed output than standard mode

---

## Phase 2: Validation & Conflict Checking

### Test 2.1: Validate Existing Deployments
```bash
leger validate
```
**Expected Output:**
- Syntax validation results
- Port conflict detection
- Volume conflict detection
- Dependency analysis
- Any warnings or errors

**Verify:**
- [ ] Validation runs successfully
- [ ] Clear error messages if issues found
- [ ] Lists all checked items

### Test 2.2: Validate Specific Directory
```bash
leger validate -d /path/to/quadlets
```
**Verify:**
- [ ] Can validate custom directories
- [ ] Handles non-existent paths gracefully

### Test 2.3: Quick Conflict Check
```bash
leger check-conflicts
```
**Expected Output:**
- Quick check for port conflicts
- Quick check for volume conflicts
- No full validation (faster than validate)

**Verify:**
- [ ] Runs faster than full validate
- [ ] Still catches critical conflicts

---

## Phase 3: Deployment Operations

### Test 3.1: List Current Deployments
```bash
leger deploy list
```
**Expected Output:**
- List of all deployed services
- Status of each deployment
- Version information

**Verify:**
- [ ] Shows all active deployments
- [ ] Information is up-to-date
- [ ] Clean, readable format

### Test 3.2: Install New Deployment (Dry Run)
```bash
leger deploy install test-app --dry-run --source /path/to/quadlets
```
**Expected Output:**
- Shows what would be installed
- Lists quadlet files that would be deployed
- Secret requirements
- No actual installation

**Verify:**
- [ ] Dry run doesn't make changes
- [ ] Shows complete installation plan
- [ ] Validates before showing plan

### Test 3.3: Install New Deployment (No Secrets)
```bash
leger deploy install test-app --no-secrets --no-start --source /path/to/quadlets
```
**Expected Output:**
- Installs quadlet files
- Skips secret injection
- Doesn't start services
- Success confirmation

**Verify:**
- [ ] Files installed correctly
- [ ] Services not started
- [ ] Can proceed to next steps

### Test 3.4: Install with Force (Skip Conflicts)
```bash
leger deploy install test-app2 --force --source /path/to/quadlets
```
**Verify:**
- [ ] Bypasses conflict checks
- [ ] Installs even with warnings
- [ ] Use carefully in testing only

### Test 3.5: List Deployments Again
```bash
leger deploy list
```
**Verify:**
- [ ] New deployment(s) appear in list
- [ ] Status accurately reflects state

---

## Phase 4: Service Management

### Test 4.1: Check Service Status
```bash
leger service status test-app
```
**Expected Output:**
- Service running state
- Health check results
- Container information
- Resource usage (if available)

**Verify:**
- [ ] Shows accurate service state
- [ ] Health checks work
- [ ] Clear status indicators

### Test 4.2: Start Service
```bash
leger service start test-app
```
**Verify:**
- [ ] Service starts successfully
- [ ] Appropriate startup messages
- [ ] Status changes to running

### Test 4.3: View Service Logs
```bash
leger service logs test-app -n 50
```
**Expected Output:**
- Last 50 lines of logs
- Formatted log output
- Timestamps

**Verify:**
- [ ] Logs display correctly
- [ ] Line limit works (-n flag)
- [ ] Readable format

### Test 4.4: Follow Logs in Real-Time
```bash
leger service logs test-app -f
```
**Verify:**
- [ ] Logs stream in real-time
- [ ] Can interrupt with Ctrl+C
- [ ] No data loss during streaming

### Test 4.5: Restart Service
```bash
leger service restart test-app
```
**Verify:**
- [ ] Service stops gracefully
- [ ] Service starts back up
- [ ] No data corruption

### Test 4.6: Stop Service
```bash
leger service stop test-app
```
**Verify:**
- [ ] Service stops cleanly
- [ ] Status reflects stopped state
- [ ] No hanging processes

---

## Phase 5: Staged Updates Workflow

### Test 5.1: List Current Staged Updates
```bash
leger staged list
```
**Expected Output:**
- List of staged but not applied updates
- May be empty initially

**Verify:**
- [ ] Command works even with no staged updates
- [ ] Clear indication if empty

### Test 5.2: Stage Updates for Review
```bash
leger staged stage /path/to/updated/quadlets
```
**Expected Output:**
- Downloads updates to staging area
- Confirmation of staging
- What was staged

**Verify:**
- [ ] Updates downloaded successfully
- [ ] No changes to production yet
- [ ] Staging metadata recorded

### Test 5.3: List Staged Updates
```bash
leger staged list
```
**Verify:**
- [ ] Shows newly staged updates
- [ ] Includes deployment name, version, source
- [ ] Timestamp of staging

### Test 5.4: Show Differences
```bash
leger staged diff test-app
```
**Expected Output:**
- Unified diff of modified files
- List of added files
- List of removed files
- Affected services
- Port/volume conflicts

**Verify:**
- [ ] Clear diff output
- [ ] Shows all changes
- [ ] Highlights conflicts

### Test 5.5: Apply Staged Updates (with Backup)
```bash
leger staged apply test-app
```
**Expected Output:**
- Creates automatic backup
- Applies staged changes
- Confirmation prompt (unless --force)
- Success/failure message

**Verify:**
- [ ] Backup created first
- [ ] Changes applied correctly
- [ ] Services updated
- [ ] Rollback available if needed

### Test 5.6: Stage and Discard
```bash
leger staged stage /path/to/test/updates
leger staged diff test-app
leger staged discard test-app
```
**Verify:**
- [ ] Can stage updates
- [ ] Can review them
- [ ] Can discard without applying
- [ ] Production unchanged after discard

---

## Phase 6: Backup Operations

### Test 6.1: List All Backups
```bash
leger backup list
```
**Expected Output:**
- All available backups
- Metadata (timestamps, reasons, sizes)
- May include auto-created backups from Phase 5

**Verify:**
- [ ] Shows all backups
- [ ] Metadata is accurate
- [ ] Clear, sortable format

### Test 6.2: Create Manual Backup
```bash
leger backup create test-app
```
**Expected Output:**
- Backup in progress messages
- Includes quadlet files
- Includes volume data (exported & compressed)
- Includes metadata
- Backup ID/name

**Verify:**
- [ ] Backup completes successfully
- [ ] Timestamped appropriately
- [ ] Default reason is "manual"

### Test 6.3: Create Backup with Custom Reason
```bash
leger backup create test-app --reason "before-major-update"
```
**Verify:**
- [ ] Custom reason recorded
- [ ] Shows in backup list

### Test 6.4: View Backup Details
```bash
leger backup info <backup-id-from-list>
```
**Expected Output:**
- Detailed backup information
- Size breakdown
- Included files
- Services backed up
- Restore instructions

**Verify:**
- [ ] Shows comprehensive details
- [ ] All metadata accessible
- [ ] File list accurate

### Test 6.5: Restore from Backup (Test)
```bash
leger backup restore <backup-id> --force
```
**Expected Output:**
- Stops all services
- Creates temporary backup of current state
- Restores from specified backup
- Starts services back up
- Success confirmation

**Verify:**
- [ ] Services stop gracefully
- [ ] Safety backup created
- [ ] Restore completes successfully
- [ ] Services start with restored config
- [ ] Rollback available

### Test 6.6: Restore Without Force (Confirmation)
```bash
leger backup restore <backup-id>
```
**Verify:**
- [ ] Prompts for confirmation
- [ ] Shows what will be restored
- [ ] Can abort safely

---

## Phase 7: Deployment Updates

### Test 7.1: Update Deployment (Full Workflow)
```bash
leger deploy update test-app
```
**Expected Workflow:**
1. Stages updates automatically
2. Shows diff
3. Prompts for confirmation
4. Creates backup
5. Applies updates

**Verify:**
- [ ] Full workflow executes
- [ ] Each step works correctly
- [ ] Can abort at confirmation
- [ ] Backup created before applying

### Test 7.2: Update with Dry Run
```bash
leger deploy update test-app --dry-run
```
**Verify:**
- [ ] Shows what would happen
- [ ] No actual changes made
- [ ] Clear preview of changes

### Test 7.3: Update with Force (Skip Confirmation)
```bash
leger deploy update test-app --force
```
**Verify:**
- [ ] Skips confirmation prompt
- [ ] Still creates backup
- [ ] Updates applied automatically

### Test 7.4: Update Without Backup (Not Recommended)
```bash
leger deploy update test-app --no-backup --force
```
**Verify:**
- [ ] Skips backup creation
- [ ] Warning displayed
- [ ] Updates still applied

---

## Phase 8: Deployment Removal

### Test 8.1: Remove Deployment (Keep Volumes)
```bash
leger deploy remove test-app
```
**Expected Output:**
- Confirmation prompt
- Stops services
- Removes quadlet files
- Keeps volumes by default

**Verify:**
- [ ] Confirmation works
- [ ] Services stopped
- [ ] Files removed
- [ ] Volumes preserved

### Test 8.2: Remove with Volume Backup
```bash
leger deploy remove test-app2 --backup-volumes
```
**Verify:**
- [ ] Creates volume backup first
- [ ] Then removes deployment
- [ ] Backup available for restore

### Test 8.3: Remove with Volume Deletion
```bash
leger deploy remove test-app3 --remove-volumes --force
```
**Verify:**
- [ ] Force skips confirmation
- [ ] Volumes deleted
- [ ] Complete removal
- [ ] Warning about data loss

---

## Phase 9: Configuration Management

### Test 9.1: Pull Configuration from Backend
```bash
leger config pull
```
**Expected Output:**
- Fetches latest config from Leger Labs
- Updates local config file
- Confirmation of update

**Verify:**
- [ ] Config downloaded successfully
- [ ] Local file updated
- [ ] No data loss

### Test 9.2: Pull Specific Config Version
```bash
leger config pull --version <version-id>
```
**Verify:**
- [ ] Can fetch specific versions
- [ ] Version control works
- [ ] Can rollback configs

### Test 9.3: Show Updated Configuration
```bash
leger config show
```
**Verify:**
- [ ] Shows newly pulled config
- [ ] Changes reflected
- [ ] Format consistent

---

## Phase 10: Edge Cases & Error Handling

### Test 10.1: Invalid Commands
```bash
leger deploy install
leger service status nonexistent-service
leger backup restore invalid-backup-id
```
**Verify:**
- [ ] Clear error messages
- [ ] Helpful suggestions
- [ ] No crashes or hangs

### Test 10.2: Invalid Flags
```bash
leger deploy install --invalid-flag
leger -x status
```
**Verify:**
- [ ] Flag validation works
- [ ] Shows available flags
- [ ] Help text accessible

### Test 10.3: Help Text
```bash
leger --help
leger deploy --help
leger service logs --help
```
**Verify:**
- [ ] Help available at all levels
- [ ] Accurate and complete
- [ ] Examples included where helpful

### Test 10.4: Config File Override
```bash
leger -c /custom/config.yaml status
```
**Verify:**
- [ ] Custom config file used
- [ ] Falls back to default if not found
- [ ] Error handling for invalid configs

### Test 10.5: Verbose Mode Throughout
```bash
leger -v deploy list
leger -v service status test-app
leger -v backup create test-app
```
**Verify:**
- [ ] Verbose flag works globally
- [ ] Provides useful debug info
- [ ] Doesn't break formatting

---

## Testing Checklist Summary

### Core Functionality
- [ ] Status & configuration viewing
- [ ] Validation & conflict checking
- [ ] Deployment installation
- [ ] Service management (start/stop/restart/logs/status)
- [ ] Staged updates workflow
- [ ] Backup & restore operations
- [ ] Deployment updates
- [ ] Deployment removal
- [ ] Configuration pulling

### Cross-Cutting Concerns
- [ ] Error handling & validation
- [ ] Help text & documentation
- [ ] Verbose mode
- [ ] Config file override
- [ ] Confirmation prompts
- [ ] Force flags
- [ ] Dry-run modes

### Quality Checks
- [ ] No data loss scenarios
- [ ] Automatic backups work
- [ ] Rollback capabilities
- [ ] Graceful service handling
- [ ] Clear user feedback
- [ ] Performance (reasonable speed)

---

## Notes & Issues Found

*(Document any issues, bugs, or unexpected behavior here as you test)*

| Test Phase | Issue Description | Severity | Expected | Actual | Status |
|------------|------------------|----------|----------|--------|--------|
|            |                  |          |          |        |        |

---

## Additional Test Scenarios

### Concurrent Operations
- Multiple deployments installed simultaneously
- Service operations during staging
- Backup during active service

### Resource Constraints
- Large volume backups
- Many concurrent services
- Limited disk space scenarios

### Network Issues
- Backend connectivity failures
- Git repository unreachable
- Slow network conditions

### Recovery Scenarios
- Interrupted operations
- Corrupted config files
- Missing dependencies

---

## Final Validation

Once all tests pass:

1. **Clean Environment Test**
   - Fresh system
   - Install from scratch
   - Deploy sample application
   - Full lifecycle test

2. **Documentation Review**
   - Compare actual behavior to docs
   - Note any discrepancies
   - Update docs if needed

3. **Production Readiness**
   - All tests passing
   - Error handling robust
   - User experience smooth
   - Performance acceptable

---

**Testing Date:** _______________  
**Tester:** _______________  
**Leger Version:** _______________  
**Result:** ⬜ Pass | ⬜ Pass with Issues | ⬜ Fail
