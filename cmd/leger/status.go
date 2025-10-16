package main

import (
	"fmt"

	"github.com/tailscale/setec/internal/daemon"
	"github.com/spf13/cobra"
)

// statusCmd returns the status command
func statusCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "status",
		Short: "Show overall system status",
		Long: `Display comprehensive Leger system status.

Shows the status of:
- Authentication with Leger Labs
- legerd daemon connection
- Deployed Podman Quadlets
- Git repository sync status`,
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()

			fmt.Println("=== Leger System Status ===")
			fmt.Println()

			// Check legerd daemon
			fmt.Println("=== legerd Daemon ===")
			fmt.Println()

			daemonClient := daemon.NewClient("")
			if err := daemonClient.Health(ctx); err != nil {
				fmt.Println("Status: NOT RUNNING")
				fmt.Printf("  Error: %v\n", err)
				fmt.Println()
				fmt.Println("Start legerd:")
				fmt.Println("  systemctl --user start legerd.service")
			} else {
				fmt.Println("Status: RUNNING")
				fmt.Println("  URL: http://localhost:8080")
				fmt.Println()
			}

			// TODO: Add Tailscale status (Issue #6)
			// TODO: Add authentication status (Issue #8)
			// TODO: Add deployed services status

			return nil
		},
	}
}
