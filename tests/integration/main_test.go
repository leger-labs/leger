package integration

import (
	"os"
	"os/exec"
	"path/filepath"
	"testing"
)

var legerBinary string

func TestMain(m *testing.M) {
	// Build leger binary for integration tests
	tmpDir, err := os.MkdirTemp("", "leger-test-bin")
	if err != nil {
		panic(err)
	}
	defer os.RemoveAll(tmpDir)

	legerBinary = filepath.Join(tmpDir, "leger")

	// Build the leger binary
	cmd := exec.Command("go", "build", "-o", legerBinary, "../../cmd/leger")
	if output, err := cmd.CombinedOutput(); err != nil {
		panic("Failed to build leger binary: " + string(output))
	}

	// Add binary directory to PATH
	oldPath := os.Getenv("PATH")
	os.Setenv("PATH", tmpDir+string(os.PathListSeparator)+oldPath)
	defer os.Setenv("PATH", oldPath)

	// Run tests
	code := m.Run()
	os.Exit(code)
}
