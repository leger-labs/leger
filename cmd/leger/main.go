package main

import (
	"fmt"
	"os"

	"github.com/tailscale/setec/internal/version"
	"github.com/spf13/cobra"
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
	rootCmd.AddCommand(configCmd())
	rootCmd.AddCommand(deployCmd())
	rootCmd.AddCommand(secretsCmd())
	rootCmd.AddCommand(serviceCmd())
	rootCmd.AddCommand(statusCmd())
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
