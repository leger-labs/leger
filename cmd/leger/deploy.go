package main

import (
	"fmt"

	"github.com/spf13/cobra"
)

// deployCmd returns the deploy command group
func deployCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "deploy",
		Short: "Deployment commands",
		Long:  "Manage Podman Quadlet deployments from Git repositories",
	}

	cmd.AddCommand(deployInitCmd())
	cmd.AddCommand(deployUpdateCmd())

	return cmd
}

// deployInitCmd returns the deploy init command
func deployInitCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "init",
		Short: "Initialize deployment",
		Long: `Initialize a new Leger deployment.

Sets up the local deployment environment, clones the quadlet
repository, and prepares systemd units for activation.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			return fmt.Errorf("not yet implemented")
		},
	}
}

// deployUpdateCmd returns the deploy update command
func deployUpdateCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "update",
		Short: "Update deployed services",
		Long: `Update deployed Podman Quadlets.

Pulls the latest changes from the Git repository, updates
systemd units, and restarts affected services.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			return fmt.Errorf("not yet implemented")
		},
	}
}
