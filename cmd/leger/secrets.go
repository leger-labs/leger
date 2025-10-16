package main

import (
	"fmt"

	"github.com/spf13/cobra"
)

// secretsCmd returns the secrets command group
func secretsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "secrets",
		Short: "Secrets management",
		Long:  "Manage secrets via legerd daemon",
	}

	cmd.AddCommand(secretsSyncCmd())
	cmd.AddCommand(secretsListCmd())

	return cmd
}

// secretsSyncCmd returns the secrets sync command
func secretsSyncCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "sync",
		Short: "Sync secrets from backend",
		Long: `Synchronize secrets from legerd daemon.

Fetches the latest secrets from legerd and updates the local
secret store for use by Podman Quadlets.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			return fmt.Errorf("not yet implemented")
		},
	}
}

// secretsListCmd returns the secrets list command
func secretsListCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "list",
		Short: "List available secrets",
		Long: `Display all available secrets.

Shows secrets that are available from legerd for use in
your Podman Quadlet deployments.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			return fmt.Errorf("not yet implemented")
		},
	}
}
