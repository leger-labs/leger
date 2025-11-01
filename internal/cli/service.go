package cli

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/leger-labs/leger/internal/health"
	"github.com/leger-labs/leger/internal/podman"
	"github.com/leger-labs/leger/internal/quadlet"
	"github.com/spf13/cobra"
)

// serviceCmd returns the service command group
func serviceCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "service",
		Short: "Service management commands",
		Long:  "Manage Podman Quadlet services (start, stop, restart, logs, status)",
	}

	cmd.AddCommand(serviceStatusCmd())
	cmd.AddCommand(serviceLogsCmd())
	cmd.AddCommand(serviceStartCmd())
	cmd.AddCommand(serviceStopCmd())
	cmd.AddCommand(serviceRestartCmd())

	return cmd
}

// serviceStatusCmd returns the service status command
func serviceStatusCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "status <service>",
		Short: "Show service status with health checks",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()
			serviceName := args[0]

			sm := podman.NewSystemdManager("user")
			status, err := sm.GetServiceStatus(serviceName)
			if err != nil {
				return err
			}

			// Display basic status
			fmt.Printf("Service: %s\n", status.Name)
			fmt.Printf("Description: %s\n", status.Description)
			fmt.Printf("Load State: %s\n", status.LoadState)
			fmt.Printf("Active State: %s\n", status.ActiveState)
			fmt.Printf("Sub State: %s\n", status.SubState)
			if status.MainPID > 0 {
				fmt.Printf("Main PID: %d\n", status.MainPID)
			}

			// Try to find health check configuration
			healthCheck := findHealthCheckForService(serviceName)
			if healthCheck != nil {
				fmt.Println()
				fmt.Println("Health Check:")
				fmt.Printf("  URL: %s\n", healthCheck.URL)

				// Perform health check
				result := healthCheck.Check(ctx)

				statusIcon := ""
				switch result.Status {
				case health.StatusHealthy:
					statusIcon = "✓"
				case health.StatusUnhealthy:
					statusIcon = "✗"
				case health.StatusUnknown:
					statusIcon = "?"
				}

				fmt.Printf("  Status: %s %s\n", statusIcon, result.Status)

				if result.StatusCode > 0 {
					fmt.Printf("  Status Code: %d\n", result.StatusCode)
				}

				if result.ResponseTime > 0 {
					fmt.Printf("  Response Time: %v\n", result.ResponseTime)
				}

				if result.Error != nil {
					fmt.Printf("  Error: %v\n", result.Error)
				}

				// Overall status summary
				if status.ActiveState == "active" && result.Status == health.StatusHealthy {
					fmt.Println()
					fmt.Println("Overall: active (healthy)")
				} else if status.ActiveState == "active" && result.Status == health.StatusUnhealthy {
					fmt.Println()
					fmt.Println("⚠️  Overall: active (unhealthy)")
					fmt.Println()
					fmt.Println("Check logs:")
					fmt.Printf("  leger service logs %s\n", serviceName)
				}
			}

			return nil
		},
	}
}

// findHealthCheckForService finds health check configuration for a service
func findHealthCheckForService(serviceName string) *health.HealthCheck {
	// Convert service name to quadlet name
	quadletName := strings.TrimSuffix(serviceName, ".service") + ".container"

	// Look in standard quadlet directories
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return nil
	}

	quadletDirs := []string{
		filepath.Join(homeDir, ".config", "containers", "systemd"),
		filepath.Join(homeDir, ".local", "share", "bluebuild-quadlets", "active"),
	}

	for _, baseDir := range quadletDirs {
		if _, err := os.Stat(baseDir); os.IsNotExist(err) {
			continue
		}

		// Search for the quadlet file
		var foundPath string
		_ = filepath.Walk(baseDir, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return nil
			}

			if info.IsDir() {
				return nil
			}

			if filepath.Base(path) == quadletName {
				foundPath = path
				return filepath.SkipDir
			}

			return nil
		})

		if foundPath != "" {
			// Parse labels from the quadlet file
			labels, err := quadlet.ParseLabels(foundPath)
			if err != nil {
				continue
			}

			// Parse health check configuration
			return health.ParseHealthCheckLabels(labels)
		}
	}

	return nil
}

var logsFlags struct {
	follow bool
	lines  int
}

// serviceLogsCmd returns the service logs command
func serviceLogsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "logs <service>",
		Short: "View service logs",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			serviceName := args[0]

			sm := podman.NewSystemdManager("user")
			return sm.GetLogs(serviceName, logsFlags.follow, logsFlags.lines)
		},
	}

	cmd.Flags().BoolVarP(&logsFlags.follow, "follow", "f", false, "Follow logs in real-time")
	cmd.Flags().IntVarP(&logsFlags.lines, "lines", "n", 100, "Number of lines to show")

	return cmd
}

// serviceStartCmd returns the service start command
func serviceStartCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "start <service>",
		Short: "Start a service",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			serviceName := args[0]

			sm := podman.NewSystemdManager("user")
			if err := sm.StartService(serviceName); err != nil {
				return err
			}

			fmt.Printf("✓ Started %s\n", serviceName)
			return nil
		},
	}
}

// serviceStopCmd returns the service stop command
func serviceStopCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "stop <service>",
		Short: "Stop a service",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			serviceName := args[0]

			sm := podman.NewSystemdManager("user")
			if err := sm.StopService(serviceName); err != nil {
				return err
			}

			fmt.Printf("✓ Stopped %s\n", serviceName)
			return nil
		},
	}
}

// serviceRestartCmd returns the service restart command
func serviceRestartCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "restart <service>",
		Short: "Restart a service",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			serviceName := args[0]

			sm := podman.NewSystemdManager("user")
			if err := sm.RestartService(serviceName); err != nil {
				return err
			}

			fmt.Printf("✓ Restarted %s\n", serviceName)

			// Show status after restart
			status, err := sm.GetServiceStatus(serviceName)
			if err == nil {
				fmt.Printf("Status: %s (%s)\n", status.ActiveState, status.SubState)
			}

			return nil
		},
	}
}
