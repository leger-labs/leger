package main

import (
	"fmt"

	"github.com/tailscale/setec/internal/daemon"
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
		Long: `Synchronize secrets from Leger backend and store in legerd.

Fetches the latest secrets from Leger Labs and updates legerd
for use by Podman Quadlets.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			// TODO: Implement in v0.2.0
			return fmt.Errorf("not yet implemented - coming in v0.2.0")
		},
	}
}

// secretsListCmd returns the secrets list command
func secretsListCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "list",
		Short: "List available secrets",
		Long: `Display all available secrets from legerd.

Shows secrets that are available from legerd for use in
your Podman Quadlet deployments.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()

			client := daemon.NewClient("")

			// Check if legerd is running
			if err := client.Health(ctx); err != nil {
				return fmt.Errorf("legerd not running: %w\n\nStart legerd with:\n  systemctl --user start legerd.service\n\nOr check logs:\n  journalctl --user -u legerd.service -f", err)
			}

			secrets, err := client.ListSecrets(ctx)
			if err != nil {
				return fmt.Errorf("failed to list secrets: %w", err)
			}

			if len(secrets) == 0 {
				fmt.Println("No secrets found")
				return nil
			}

			fmt.Println("Available secrets:")
			for _, secret := range secrets {
				fmt.Printf("  - %s\n", secret)
			}

			return nil
		},
	}
}
