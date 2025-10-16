package integration

import (
	"context"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
	"time"
)

// TestHelper provides utilities for integration tests
type TestHelper struct {
	t       *testing.T
	tempDir string
	ctx     context.Context
}

// NewTestHelper creates a new test helper
func NewTestHelper(t *testing.T) *TestHelper {
	tempDir, err := os.MkdirTemp("", "leger-test-*")
	if err != nil {
		t.Fatalf("failed to create temp dir: %v", err)
	}

	return &TestHelper{
		t:       t,
		tempDir: tempDir,
		ctx:     context.Background(),
	}
}

// Cleanup removes temporary test files
func (h *TestHelper) Cleanup() {
	if h.tempDir != "" {
		os.RemoveAll(h.tempDir)
	}
}

// TempDir returns the temporary directory path
func (h *TestHelper) TempDir() string {
	return h.tempDir
}

// CreateTestQuadlet creates a simple test quadlet
func (h *TestHelper) CreateTestQuadlet(name string) string {
	quadletDir := filepath.Join(h.tempDir, name)
	if err := os.MkdirAll(quadletDir, 0755); err != nil {
		h.t.Fatalf("failed to create quadlet dir: %v", err)
	}

	// Create .leger.yaml
	legerYaml := `name: ` + name + `
version: 1.0.0
scope: user
description: Test quadlet for integration testing
`
	if err := os.WriteFile(filepath.Join(quadletDir, ".leger.yaml"), []byte(legerYaml), 0644); err != nil {
		h.t.Fatalf("failed to write .leger.yaml: %v", err)
	}

	// Create simple container file
	containerFile := `[Unit]
Description=Test Container ` + name + `

[Container]
Image=docker.io/library/nginx:alpine
ContainerName=` + name + `
PublishPort=8080:80

[Service]
Restart=always

[Install]
WantedBy=default.target
`
	if err := os.WriteFile(filepath.Join(quadletDir, name+".container"), []byte(containerFile), 0644); err != nil {
		h.t.Fatalf("failed to write container file: %v", err)
	}

	return quadletDir
}

// RunCommand runs a leger command and returns output
func (h *TestHelper) RunCommand(args ...string) (string, error) {
	cmd := exec.CommandContext(h.ctx, "leger", args...)
	output, err := cmd.CombinedOutput()
	return string(output), err
}

// WaitForService waits for a systemd service to reach a state
func (h *TestHelper) WaitForService(serviceName, state string, timeout time.Duration) error {
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		cmd := exec.Command("systemctl", "--user", "is-active", serviceName)
		output, err := cmd.Output()
		if err == nil && string(output) == state+"\n" {
			return nil
		}
		time.Sleep(time.Second)
	}
	return context.DeadlineExceeded
}

// CleanupQuadlet removes a deployed quadlet
func (h *TestHelper) CleanupQuadlet(name string) {
	// Stop and remove service (errors ignored in cleanup)
	_ = exec.Command("systemctl", "--user", "stop", name+".service").Run()
	_ = exec.Command("podman", "quadlet", "rm", "--user", name).Run()
}

// SkipIfNoPodman skips the test if Podman is not available
func SkipIfNoPodman(t *testing.T) {
	if _, err := exec.LookPath("podman"); err != nil {
		t.Skip("Podman not available, skipping integration test")
	}
}

// SkipIfNoSystemd skips the test if systemd is not available
func SkipIfNoSystemd(t *testing.T) {
	if _, err := exec.LookPath("systemctl"); err != nil {
		t.Skip("systemd not available, skipping integration test")
	}
}
