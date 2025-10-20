package podman

import (
	"bytes"
	"fmt"
	"os/exec"
	"strconv"
	"strings"

	"github.com/leger-labs/leger/pkg/types"
)

// SystemdManager handles systemd service operations
type SystemdManager struct {
	scope string // "user" or "system"
}

// NewSystemdManager creates a new SystemdManager
func NewSystemdManager(scope string) *SystemdManager {
	if scope == "" {
		scope = "user"
	}
	return &SystemdManager{scope: scope}
}

// GetServiceStatus gets the status of a systemd service
func (sm *SystemdManager) GetServiceStatus(serviceName string) (*types.ServiceStatus, error) {
	// Ensure .service extension
	if !strings.HasSuffix(serviceName, ".service") {
		serviceName += ".service"
	}

	args := []string{"show", serviceName}

	if sm.scope == "user" {
		args = append([]string{"--user"}, args...)
	}

	// Properties to fetch
	properties := []string{
		"LoadState",
		"ActiveState",
		"SubState",
		"Description",
		"MainPID",
	}

	for _, prop := range properties {
		args = append(args, "--property="+prop)
	}

	cmd := exec.Command("systemctl", args...)

	var stdout bytes.Buffer
	cmd.Stdout = &stdout

	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf("failed to get service status: %w", err)
	}

	// Parse output
	status := &types.ServiceStatus{
		Name: serviceName,
	}

	for _, line := range strings.Split(stdout.String(), "\n") {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}

		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}

		key := parts[0]
		value := parts[1]

		switch key {
		case "LoadState":
			status.LoadState = value
		case "ActiveState":
			status.ActiveState = value
		case "SubState":
			status.SubState = value
		case "Description":
			status.Description = value
		case "MainPID":
			if pid, err := strconv.Atoi(value); err == nil {
				status.MainPID = pid
			}
		}
	}

	return status, nil
}

// StartService starts a systemd service
func (sm *SystemdManager) StartService(serviceName string) error {
	return sm.serviceAction("start", serviceName)
}

// StopService stops a systemd service
func (sm *SystemdManager) StopService(serviceName string) error {
	return sm.serviceAction("stop", serviceName)
}

// RestartService restarts a systemd service
func (sm *SystemdManager) RestartService(serviceName string) error {
	return sm.serviceAction("restart", serviceName)
}

// EnableService enables a systemd service
func (sm *SystemdManager) EnableService(serviceName string) error {
	return sm.serviceAction("enable", serviceName)
}

// DisableService disables a systemd service
func (sm *SystemdManager) DisableService(serviceName string) error {
	return sm.serviceAction("disable", serviceName)
}

// serviceAction performs a systemd service action
func (sm *SystemdManager) serviceAction(action, serviceName string) error {
	// Ensure .service extension
	if !strings.HasSuffix(serviceName, ".service") {
		serviceName += ".service"
	}

	args := []string{action, serviceName}

	if sm.scope == "user" {
		args = append([]string{"--user"}, args...)
	}

	cmd := exec.Command("systemctl", args...)

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf(`systemctl %s failed: %w

Stderr: %s

Check service status:
  systemctl --user status %s

View logs:
  journalctl --user -u %s -n 50`, action, err, stderr.String(), serviceName, serviceName)
	}

	return nil
}

// GetLogs retrieves logs for a systemd service
func (sm *SystemdManager) GetLogs(serviceName string, follow bool, lines int) error {
	// Ensure .service extension
	if !strings.HasSuffix(serviceName, ".service") {
		serviceName += ".service"
	}

	args := []string{"-u", serviceName}

	if sm.scope == "user" {
		args = append([]string{"--user"}, args...)
	}

	if follow {
		args = append(args, "-f")
	}

	if lines > 0 {
		args = append(args, "-n", strconv.Itoa(lines))
	}

	cmd := exec.Command("journalctl", args...)
	cmd.Stdout = nil // Will use parent's stdout
	cmd.Stderr = nil // Will use parent's stderr

	return cmd.Run()
}

// DaemonReload reloads systemd daemon
func (sm *SystemdManager) DaemonReload() error {
	args := []string{"daemon-reload"}

	if sm.scope == "user" {
		args = append([]string{"--user"}, args...)
	}

	cmd := exec.Command("systemctl", args...)

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("systemctl daemon-reload failed: %w", err)
	}

	return nil
}

// ListServices lists all systemd services
func (sm *SystemdManager) ListServices() ([]string, error) {
	args := []string{"list-units", "--type=service", "--all", "--no-pager", "--plain", "--no-legend"}

	if sm.scope == "user" {
		args = append([]string{"--user"}, args...)
	}

	cmd := exec.Command("systemctl", args...)

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf("systemctl list-units failed: %w\nStderr: %s", err, stderr.String())
	}

	var services []string
	for _, line := range strings.Split(stdout.String(), "\n") {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}

		// Parse first field (service name)
		fields := strings.Fields(line)
		if len(fields) > 0 {
			services = append(services, fields[0])
		}
	}

	return services, nil
}

// Start is an alias for StartService for consistency with other methods
func (sm *SystemdManager) Start(serviceName string) error {
	return sm.StartService(serviceName)
}

// Stop is an alias for StopService for consistency with other methods
func (sm *SystemdManager) Stop(serviceName string) error {
	return sm.StopService(serviceName)
}

// QuadletNameToServiceName converts a quadlet name to systemd service name
func QuadletNameToServiceName(quadletName string) string {
	// Remove extension if present
	name := quadletName
	exts := []string{".container", ".volume", ".network", ".pod", ".kube", ".image"}
	for _, ext := range exts {
		name = strings.TrimSuffix(name, ext)
	}

	// Add .service extension
	return name + ".service"
}
