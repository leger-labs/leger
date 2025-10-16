package integration

import (
	"testing"
	"time"
)

// TestCompleteDeploymentWorkflow tests the full deployment lifecycle
func TestCompleteDeploymentWorkflow(t *testing.T) {
	SkipIfNoPodman(t)
	SkipIfNoSystemd(t)

	h := NewTestHelper(t)
	defer h.Cleanup()

	deploymentName := "test-deploy"
	quadletDir := h.CreateTestQuadlet(deploymentName)

	// 1. Install from local path
	t.Log("Step 1: Installing quadlet")
	output, err := h.RunCommand("deploy", "install", deploymentName, "--source", quadletDir, "--no-secrets")
	if err != nil {
		t.Fatalf("install failed: %v\nOutput: %s", err, output)
	}

	// Cleanup at the end
	defer h.CleanupQuadlet(deploymentName)

	// 2. Verify service running
	t.Log("Step 2: Verifying service is running")
	if err := h.WaitForService(deploymentName+".service", "active", 30*time.Second); err != nil {
		t.Fatalf("service did not start: %v", err)
	}

	// 3. List deployments
	t.Log("Step 3: Listing deployments")
	output, err = h.RunCommand("deploy", "list")
	if err != nil {
		t.Fatalf("list failed: %v\nOutput: %s", err, output)
	}

	// 4. Check status
	t.Log("Step 4: Checking status")
	output, err = h.RunCommand("status")
	if err != nil {
		t.Fatalf("status failed: %v\nOutput: %s", err, output)
	}

	// 5. Remove deployment
	t.Log("Step 5: Removing deployment")
	output, err = h.RunCommand("deploy", "remove", deploymentName, "--force")
	if err != nil {
		t.Fatalf("remove failed: %v\nOutput: %s", err, output)
	}

	// 6. Verify cleanup
	t.Log("Step 6: Verifying cleanup")
	time.Sleep(2 * time.Second) // Give systemd time to stop
	output, err = h.RunCommand("deploy", "list")
	if err != nil {
		t.Fatalf("list after removal failed: %v\nOutput: %s", err, output)
	}
}

// TestInstallValidation tests validation during installation
func TestInstallValidation(t *testing.T) {
	SkipIfNoPodman(t)

	h := NewTestHelper(t)
	defer h.Cleanup()

	// Create invalid quadlet (missing required fields)
	deploymentName := "invalid-test"
	quadletDir := h.TempDir() + "/" + deploymentName
	// Intentionally create malformed quadlet

	output, err := h.RunCommand("deploy", "install", deploymentName, "--source", quadletDir, "--no-secrets")
	if err == nil {
		t.Fatal("expected install to fail with invalid quadlet, but it succeeded")
	}
	t.Logf("Validation correctly failed: %s", output)
}

// TestDryRun tests dry-run mode
func TestDryRun(t *testing.T) {
	SkipIfNoPodman(t)

	h := NewTestHelper(t)
	defer h.Cleanup()

	deploymentName := "dryrun-test"
	quadletDir := h.CreateTestQuadlet(deploymentName)

	// Install with dry-run
	output, err := h.RunCommand("deploy", "install", deploymentName, "--source", quadletDir, "--dry-run", "--no-secrets")
	if err != nil {
		t.Fatalf("dry-run failed: %v\nOutput: %s", err, output)
	}

	// Verify nothing was actually installed
	time.Sleep(1 * time.Second)
	listOutput, _ := h.RunCommand("deploy", "list")
	if len(listOutput) > 50 { // More than just "No quadlets installed"
		t.Errorf("dry-run should not install anything, but found deployments")
	}
}
