package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/leger-labs/leger/internal/auth"
	"github.com/leger-labs/leger/internal/git"
	"github.com/leger-labs/leger/internal/legerrun"
	"github.com/leger-labs/leger/pkg/types"
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
	var version string

	cmd := &cobra.Command{
		Use:   "pull",
		Short: "Pull configuration from backend",
		Long: `Fetch configuration from Leger backend.

Downloads the latest configuration from the Leger Labs backend
and updates the local configuration file.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := context.Background()

			// Get authentication
			storedAuth, err := auth.RequireAuth()
			if err != nil {
				return err
			}

			userUUID := storedAuth.UserUUID

			// Create leger.run client
			client := legerrun.NewClient()

			// Fetch manifest
			if version == "" {
				version = "latest"
			}

			fmt.Printf("Fetching manifest from leger.run (version: %s)...\n", version)
			manifestData, err := client.FetchManifest(ctx, userUUID, version)
			if err != nil {
				return err
			}

			// Parse manifest
			manifest, err := legerrun.ParseManifest(manifestData)
			if err != nil {
				return fmt.Errorf("parsing manifest: %w", err)
			}

			// Save to local config directory
			home, err := os.UserHomeDir()
			if err != nil {
				return fmt.Errorf("getting home directory: %w", err)
			}

			configDir := filepath.Join(home, ".local", "share", "leger")
			if err := os.MkdirAll(configDir, 0755); err != nil {
				return fmt.Errorf("creating config directory: %w", err)
			}

			manifestPath := filepath.Join(configDir, "manifest.json")
			if err := os.WriteFile(manifestPath, manifestData, 0644); err != nil {
				return fmt.Errorf("saving manifest: %w", err)
			}

			fmt.Printf("✓ Configuration pulled successfully\n")
			fmt.Printf("  Version: %d\n", manifest.Version)
			fmt.Printf("  Services: %d\n", len(manifest.Services))
			fmt.Printf("  Saved to: %s\n", manifestPath)

			return nil
		},
	}

	cmd.Flags().StringVarP(&version, "version", "v", "latest", "Configuration version to fetch")

	return cmd
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
			// Load deployment state
			home, err := os.UserHomeDir()
			if err != nil {
				return fmt.Errorf("getting home directory: %w", err)
			}

			stateDir := filepath.Join(home, ".local", "share", "leger")
			statePath := filepath.Join(stateDir, "deployments.json")

			var deployments []types.DeploymentState
			if data, err := os.ReadFile(statePath); err == nil {
				if err := json.Unmarshal(data, &deployments); err != nil {
					return fmt.Errorf("parsing deployment state: %w", err)
				}
			}

			// Load manifest
			manifestPath := filepath.Join(stateDir, "manifest.json")
			var manifest *types.Manifest
			if data, err := os.ReadFile(manifestPath); err == nil {
				manifest, _ = types.LoadManifestFromJSON(data)
			}

			// Display configuration
			fmt.Println("Leger Configuration")
			fmt.Println("===================")
			fmt.Println()

			// Auth info
			tokenStore := auth.NewTokenStore()
			storedAuth, err := tokenStore.Load()
			if err == nil && storedAuth != nil && storedAuth.IsValid() {
				fmt.Println("Authentication:")
				fmt.Printf("  User:     %s\n", storedAuth.UserEmail)
				fmt.Printf("  UUID:     %s\n", storedAuth.UserUUID)
				fmt.Printf("  Expires:  %s\n", storedAuth.ExpiresAt.Format("2006-01-02 15:04:05"))
				fmt.Printf("  Status:   ✓ Authenticated\n")
				fmt.Println()
			} else {
				fmt.Println("Authentication:")
				fmt.Printf("  Status:   ✗ Not authenticated\n")
				fmt.Println()
			}

			// Deployments
			if len(deployments) > 0 {
				fmt.Printf("Deployments: %d\n", len(deployments))
				for _, dep := range deployments {
					fmt.Println()
					fmt.Printf("  Name:     %s\n", dep.Name)
					fmt.Printf("  Source:   %s\n", dep.Source)
					fmt.Printf("  Version:  %s\n", dep.Version)
					fmt.Printf("  Scope:    %s\n", dep.Scope)
					fmt.Printf("  Services: %d\n", len(dep.Services))
					if len(dep.Volumes) > 0 {
						fmt.Printf("  Volumes:  %d\n", len(dep.Volumes))
					}
					if len(dep.Secrets) > 0 {
						fmt.Printf("  Secrets:  %d\n", len(dep.Secrets))
					}

					// Determine source type
					sourceType := git.DetectSourceType(dep.Source)
					fmt.Printf("  Type:     %s\n", sourceType.String())
				}
			} else {
				fmt.Println("Deployments: None")
			}

			// Manifest info
			if manifest != nil {
				fmt.Println()
				fmt.Println("Current Manifest:")
				fmt.Printf("  Version:  %d\n", manifest.Version)
				if manifest.Name != "" {
					fmt.Printf("  Name:     %s\n", manifest.Name)
				}
				fmt.Printf("  Services: %d\n", len(manifest.Services))
				if len(manifest.Volumes) > 0 {
					fmt.Printf("  Volumes:  %d\n", len(manifest.Volumes))
				}
				if len(manifest.Networks) > 0 {
					fmt.Printf("  Networks: %d\n", len(manifest.Networks))
				}
			}

			return nil
		},
	}
}
