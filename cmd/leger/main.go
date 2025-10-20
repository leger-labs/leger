package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/tailscale/setec/internal/version"
)

var rootCmd = &cobra.Command{
	Use:   "leger",
	Short: "Podman Quadlet Manager with Secrets",
	Long: `Leger manages Podman Quadlets from Git repositories with integrated
secrets management via legerd.`,
	Version: version.String(),
}

func init() {
	rootCmd.SetVersionTemplate(version.Long() + "\n")

	// Global flags
	rootCmd.PersistentFlags().StringP("config", "c", "", "config file (default: /etc/leger/config.yaml)")
	rootCmd.PersistentFlags().BoolP("verbose", "v", false, "verbose output")

	// Command groups
	rootCmd.AddCommand(authCmd())
	rootCmd.AddCommand(backupCmd())
	rootCmd.AddCommand(configCmd())
	rootCmd.AddCommand(deployCmd())
	rootCmd.AddCommand(secretsCmd())
	rootCmd.AddCommand(serviceCmd())
	rootCmd.AddCommand(stagedCmd())
	rootCmd.AddCommand(statusCmd())
	rootCmd.AddCommand(validateCmd())
	rootCmd.AddCommand(checkConflictsCmd())
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
