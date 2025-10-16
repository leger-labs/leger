package main

import (
	"fmt"

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
			return fmt.Errorf("not yet implemented")
		},
	}
}
