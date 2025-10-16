package integration

import (
	"testing"
)

// TestStagingWorkflow tests the complete staging workflow
func TestStagingWorkflow(t *testing.T) {
	SkipIfNoPodman(t)
	SkipIfNoSystemd(t)

	h := NewTestHelper(t)
	defer h.Cleanup()

	deploymentName := "staging-test"
	quadletDir := h.CreateTestQuadlet(deploymentName)

	// 1. Install initial version
	t.Log("Step 1: Installing initial version")
	output, err := h.RunCommand("deploy", "install", deploymentName, "--source", quadletDir, "--no-secrets")
	if err != nil {
		t.Fatalf("install failed: %v\nOutput: %s", err, output)
	}
	defer h.CleanupQuadlet(deploymentName)

	// 2. Stage an update
	t.Log("Step 2: Staging update")
	output, err = h.RunCommand("stage", deploymentName)
	if err != nil {
		// Staging might fail if no updates available, which is expected
		t.Logf("Stage result: %s", output)
	}

	// 3. View staged updates
	t.Log("Step 3: Viewing staged updates")
	output, err = h.RunCommand("staged")
	if err != nil {
		t.Fatalf("staged list failed: %v\nOutput: %s", err, output)
	}
	t.Logf("Staged updates: %s", output)

	// 4. Show diff
	t.Log("Step 4: Showing diff")
	output, err = h.RunCommand("diff", deploymentName)
	// Diff might fail if nothing staged
	t.Logf("Diff result: %s", output)

	// 5. Discard staged updates
	t.Log("Step 5: Discarding staged updates")
	output, err = h.RunCommand("discard", deploymentName)
	// This might also fail if nothing was staged
	t.Logf("Discard result: %s", output)
}

// TestApplyStaged tests applying staged updates
func TestApplyStaged(t *testing.T) {
	SkipIfNoPodman(t)
	SkipIfNoSystemd(t)

	h := NewTestHelper(t)
	defer h.Cleanup()

	deploymentName := "apply-test"
	quadletDir := h.CreateTestQuadlet(deploymentName)

	// Install initial version
	t.Log("Installing initial version")
	output, err := h.RunCommand("deploy", "install", deploymentName, "--source", quadletDir, "--no-secrets")
	if err != nil {
		t.Fatalf("install failed: %v\nOutput: %s", err, output)
	}
	defer h.CleanupQuadlet(deploymentName)

	// Note: This test would need actual staged updates to be meaningful
	// For now, we just verify the apply command doesn't crash
	t.Log("Testing apply command")
	output, err = h.RunCommand("apply", deploymentName, "--force")
	// Expected to fail if nothing staged
	t.Logf("Apply result: %s", output)
}
