package main

import (
	"fmt"

	"github.com/spf13/cobra"
	"github.com/tailscale/setec/internal/podman"
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
		Short: "Show service status",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			serviceName := args[0]

			sm := podman.NewSystemdManager("user")
			status, err := sm.GetServiceStatus(serviceName)
			if err != nil {
				return err
			}

			// Display status
			fmt.Printf("Service: %s\n", status.Name)
			fmt.Printf("Description: %s\n", status.Description)
			fmt.Printf("Load State: %s\n", status.LoadState)
			fmt.Printf("Active State: %s\n", status.ActiveState)
			fmt.Printf("Sub State: %s\n", status.SubState)
			if status.MainPID > 0 {
				fmt.Printf("Main PID: %d\n", status.MainPID)
			}

			return nil
		},
	}
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
