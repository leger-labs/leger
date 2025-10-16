package podman

import (
	"bytes"
	"fmt"
	"os/exec"
	"strings"
)

// VolumeManager handles Podman volume operations
type VolumeManager struct{}

// NewVolumeManager creates a new VolumeManager
func NewVolumeManager() *VolumeManager {
	return &VolumeManager{}
}

// Exists checks if a volume exists
func (vm *VolumeManager) Exists(volumeName string) (bool, error) {
	cmd := exec.Command("podman", "volume", "inspect", volumeName)

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	err := cmd.Run()
	if err != nil {
		// Check if error is because volume doesn't exist
		if strings.Contains(stderr.String(), "no such volume") {
			return false, nil
		}
		return false, fmt.Errorf("failed to check volume: %w\nStderr: %s", err, stderr.String())
	}

	return true, nil
}

// Remove removes a volume
func (vm *VolumeManager) Remove(volumeName string) error {
	cmd := exec.Command("podman", "volume", "rm", volumeName)

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf(`Failed to remove volume: %w

Stderr: %s

Check if volume is in use:
  podman ps -a --filter volume=%s

Force remove:
  podman volume rm -f %s`, err, stderr.String(), volumeName, volumeName)
	}

	return nil
}

// List lists all volumes
func (vm *VolumeManager) List() ([]string, error) {
	cmd := exec.Command("podman", "volume", "ls", "--format", "{{.Name}}")

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf("failed to list volumes: %w\nStderr: %s", err, stderr.String())
	}

	volumes := []string{}
	for _, line := range strings.Split(stdout.String(), "\n") {
		line = strings.TrimSpace(line)
		if line != "" {
			volumes = append(volumes, line)
		}
	}

	return volumes, nil
}

// Export exports a volume to a tar archive
func (vm *VolumeManager) Export(volumeName, outputPath string) error {
	cmd := exec.Command("podman", "volume", "export", volumeName, "--output", outputPath)

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("failed to export volume: %w\nStderr: %s", err, stderr.String())
	}

	return nil
}

// Import imports a volume from a tar archive
func (vm *VolumeManager) Import(volumeName, inputPath string) error {
	cmd := exec.Command("podman", "volume", "import", volumeName, inputPath)

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("failed to import volume: %w\nStderr: %s", err, stderr.String())
	}

	return nil
}
