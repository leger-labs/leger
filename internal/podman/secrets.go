package podman

import (
	"bytes"
	"fmt"
	"os/exec"
	"strings"
)

// SecretsManager handles Podman secret operations
type SecretsManager struct{}

// NewSecretsManager creates a new SecretsManager
func NewSecretsManager() *SecretsManager {
	return &SecretsManager{}
}

// Exists checks if a secret exists
func (sm *SecretsManager) Exists(secretName string) (bool, error) {
	cmd := exec.Command("podman", "secret", "inspect", secretName)

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	err := cmd.Run()
	if err != nil {
		// Check if error is because secret doesn't exist
		if strings.Contains(stderr.String(), "no such secret") {
			return false, nil
		}
		return false, fmt.Errorf("failed to check secret: %w\nStderr: %s", err, stderr.String())
	}

	return true, nil
}

// Create creates a new secret
func (sm *SecretsManager) Create(secretName string, value []byte) error {
	cmd := exec.Command("podman", "secret", "create", secretName, "-")
	cmd.Stdin = bytes.NewReader(value)

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("failed to create secret: %w\nStderr: %s", err, stderr.String())
	}

	return nil
}

// Remove removes a secret
func (sm *SecretsManager) Remove(secretName string) error {
	cmd := exec.Command("podman", "secret", "rm", secretName)

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("failed to remove secret: %w\nStderr: %s", err, stderr.String())
	}

	return nil
}

// List lists all secrets
func (sm *SecretsManager) List() ([]string, error) {
	cmd := exec.Command("podman", "secret", "ls", "--format", "{{.Name}}")

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf("failed to list secrets: %w\nStderr: %s", err, stderr.String())
	}

	secrets := []string{}
	for _, line := range strings.Split(stdout.String(), "\n") {
		line = strings.TrimSpace(line)
		if line != "" {
			secrets = append(secrets, line)
		}
	}

	return secrets, nil
}

// CreateOrUpdate creates a secret if it doesn't exist, or updates it if it does
func (sm *SecretsManager) CreateOrUpdate(secretName string, value []byte) error {
	exists, err := sm.Exists(secretName)
	if err != nil {
		return err
	}

	if exists {
		// Remove existing secret
		if err := sm.Remove(secretName); err != nil {
			return fmt.Errorf("failed to remove existing secret: %w", err)
		}
	}

	// Create new secret
	return sm.Create(secretName, value)
}
