package podman

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/leger-labs/leger/pkg/types"
)

// QuadletManager handles Podman quadlet operations
type QuadletManager struct {
	scope string // "user" or "system"
}

// NewQuadletManager creates a new QuadletManager
func NewQuadletManager(scope string) *QuadletManager {
	if scope == "" {
		scope = "user" // default to user scope
	}
	return &QuadletManager{scope: scope}
}

// Install installs quadlet files using native podman quadlet install command
func (qm *QuadletManager) Install(quadletPath string) error {
	// Verify path exists
	if _, err := os.Stat(quadletPath); err != nil {
		return fmt.Errorf("quadlet path does not exist: %s", quadletPath)
	}

	args := []string{"quadlet", "install"}

	if qm.scope == "user" {
		args = append(args, "--user")
	}

	args = append(args, quadletPath)

	cmd := exec.Command("podman", args...)

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf(`Podman quadlet install failed: %w

Stdout: %s
Stderr: %s

Verify Podman is installed:
  podman version

Check quadlet files are valid:
  ls -la %s

Try manual install:
  podman quadlet install --user %s`, err, stdout.String(), stderr.String(), quadletPath, quadletPath)
	}

	return nil
}

// List lists installed quadlets using native podman quadlet list command
func (qm *QuadletManager) List() ([]types.QuadletInfo, error) {
	args := []string{"quadlet", "list", "--format", "json"}

	if qm.scope == "user" {
		args = append(args, "--user")
	}

	cmd := exec.Command("podman", args...)

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf(`Podman quadlet list failed: %w

Stderr: %s

Verify Podman is installed:
  podman version

Try manual list:
  podman quadlet list --user`, err, stderr.String())
	}

	// Parse JSON output
	var quadlets []types.QuadletInfo
	if err := json.Unmarshal(stdout.Bytes(), &quadlets); err != nil {
		return nil, fmt.Errorf("failed to parse quadlet list output: %w\nOutput: %s", err, stdout.String())
	}

	return quadlets, nil
}

// Remove removes a quadlet using native podman quadlet rm command
func (qm *QuadletManager) Remove(name string) error {
	// Ensure proper extension if not provided
	if !hasQuadletExtension(name) {
		name += ".container"
	}

	args := []string{"quadlet", "rm"}

	if qm.scope == "user" {
		args = append(args, "--user")
	}

	args = append(args, name)

	cmd := exec.Command("podman", args...)

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf(`Podman quadlet remove failed: %w

Stdout: %s
Stderr: %s

Verify quadlet exists:
  podman quadlet list --user

Try manual remove:
  podman quadlet rm --user %s`, err, stdout.String(), stderr.String(), name)
	}

	return nil
}

// Print prints a quadlet definition using podman quadlet print
func (qm *QuadletManager) Print(name string) (string, error) {
	// Ensure proper extension if not provided
	if !hasQuadletExtension(name) {
		name += ".container"
	}

	args := []string{"quadlet", "print"}

	if qm.scope == "user" {
		args = append(args, "--user")
	}

	args = append(args, name)

	cmd := exec.Command("podman", args...)

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return "", fmt.Errorf("podman quadlet print failed: %w\nStderr: %s", err, stderr.String())
	}

	return stdout.String(), nil
}

// DiscoverQuadletFiles discovers all quadlet files in a directory
func (qm *QuadletManager) DiscoverQuadletFiles(dir string) ([]string, error) {
	var quadletFiles []string

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() {
			return nil
		}

		// Check if file has quadlet extension
		if hasQuadletExtension(path) {
			quadletFiles = append(quadletFiles, path)
		}

		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to discover quadlet files: %w", err)
	}

	if len(quadletFiles) == 0 {
		return nil, fmt.Errorf("no quadlet files found in %s", dir)
	}

	return quadletFiles, nil
}

// hasQuadletExtension checks if a file has a valid quadlet extension
func hasQuadletExtension(path string) bool {
	ext := filepath.Ext(path)
	validExtensions := []string{".container", ".volume", ".network", ".pod", ".kube", ".image"}

	for _, valid := range validExtensions {
		if ext == valid {
			return true
		}
	}

	return false
}

// GetQuadletType returns the type of quadlet based on file extension
func GetQuadletType(path string) types.QuadletType {
	ext := strings.TrimPrefix(filepath.Ext(path), ".")
	return types.QuadletType(ext)
}
