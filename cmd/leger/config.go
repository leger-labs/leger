package main

import (
	"fmt"

	"github.com/spf13/cobra"
)

// configCmd returns the config command group
func configCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "config",
		Short: "Configuration management",
		Long:  "Manage Leger configuration and deployment settings",
	}

	cmd.AddCommand(configPullCmd())
	cmd.AddCommand(configShowCmd())

	return cmd
}

// configPullCmd returns the config pull command
func configPullCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "pull",
		Short: "Pull configuration from backend",
		Long: `Fetch configuration from Leger backend.

Downloads the latest configuration from the Leger Labs backend
and updates the local configuration file.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			return fmt.Errorf("not yet implemented")
		},
	}
}

// configShowCmd returns the config show command
func configShowCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "show",
		Short: "Display current configuration",
		Long: `Show the current Leger configuration.

Displays the active configuration including deployment settings,
repository locations, and legerd connection details.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			return fmt.Errorf("not yet implemented")
		},
	}
}
