package cli

import (
	"github.com/leger-labs/leger/internal/version"
	"github.com/spf13/cobra"
)

// RootCmd is the root command for the leger CLI.
// It is exported for use by the documentation generator and main CLI.
var RootCmd = &cobra.Command{
	Use:   "leger",
	Short: "Podman Quadlet Manager with Secrets",
	Long: `Leger manages Podman Quadlets from Git repositories with integrated
secrets management via legerd.`,
	Version: version.String(),
	CompletionOptions: cobra.CompletionOptions{
		HiddenDefaultCmd: true, // Hide completion command from help
	},
}

func init() {
	RootCmd.SetVersionTemplate(version.Long() + "\n")

	// Global flags
	RootCmd.PersistentFlags().StringP("config", "c", "", "config file (default: /etc/leger/config.yaml)")
	RootCmd.PersistentFlags().BoolP("verbose", "v", false, "verbose output")

	// Command groups
	RootCmd.AddCommand(authCmd())
	RootCmd.AddCommand(backupCmd())
	RootCmd.AddCommand(configCmd())
	RootCmd.AddCommand(deployCmd())
	RootCmd.AddCommand(secretsCmd())
	RootCmd.AddCommand(serviceCmd())
	RootCmd.AddCommand(stagedCmd())
	RootCmd.AddCommand(statusCmd())
	RootCmd.AddCommand(validateCmd())
	RootCmd.AddCommand(checkConflictsCmd())
}
