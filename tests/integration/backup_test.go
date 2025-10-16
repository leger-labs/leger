package integration

import (
	"testing"
	"time"
)

// TestBackupWorkflow tests the backup and restore workflow
func TestBackupWorkflow(t *testing.T) {
	SkipIfNoPodman(t)
	SkipIfNoSystemd(t)

	h := NewTestHelper(t)
	defer h.Cleanup()

	deploymentName := "backup-test"
	quadletDir := h.CreateTestQuadlet(deploymentName)

	// 1. Install deployment
	t.Log("Step 1: Installing deployment")
	output, err := h.RunCommand("deploy", "install", deploymentName, "--source", quadletDir, "--no-secrets")
	if err != nil {
		t.Fatalf("install failed: %v\nOutput: %s", err, output)
	}
	defer h.CleanupQuadlet(deploymentName)

	// Wait for service to be running
	time.Sleep(2 * time.Second)

	// 2. Create backup
	t.Log("Step 2: Creating backup")
	output, err = h.RunCommand("backup", "create", deploymentName)
	if err != nil {
		t.Fatalf("backup create failed: %v\nOutput: %s", err, output)
	}
	t.Logf("Backup created: %s", output)

	// 3. List backups
	t.Log("Step 3: Listing backups")
	output, err = h.RunCommand("backup", "list", deploymentName)
	if err != nil {
		t.Fatalf("backup list failed: %v\nOutput: %s", err, output)
	}
	t.Logf("Backups: %s", output)

	// 4. Test restore (would need backup ID from previous output)
	// For now, just verify the command exists
	t.Log("Step 4: Testing restore command exists")
	output, err = h.RunCommand("backup", "restore", "--help")
	if err != nil {
		t.Fatalf("restore help failed: %v\nOutput: %s", err, output)
	}
}

// TestBackupAll tests backing up all deployments
func TestBackupAll(t *testing.T) {
	SkipIfNoPodman(t)
	SkipIfNoSystemd(t)

	h := NewTestHelper(t)
	defer h.Cleanup()

	// Create and install a test deployment
	deploymentName := "backup-all-test"
	quadletDir := h.CreateTestQuadlet(deploymentName)

	output, err := h.RunCommand("deploy", "install", deploymentName, "--source", quadletDir, "--no-secrets")
	if err != nil {
		t.Fatalf("install failed: %v\nOutput: %s", err, output)
	}
	defer h.CleanupQuadlet(deploymentName)

	time.Sleep(2 * time.Second)

	// Backup all deployments
	t.Log("Creating backup of all deployments")
	output, err = h.RunCommand("backup", "all")
	if err != nil {
		t.Fatalf("backup all failed: %v\nOutput: %s", err, output)
	}
	t.Logf("Backup all result: %s", output)
}
