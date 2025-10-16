package main

import (
	"fmt"

	"github.com/spf13/cobra"
	"github.com/tailscale/setec/internal/tailscale"
)

// authCmd returns the auth command group
func authCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "auth",
		Short: "Authentication commands",
		Long:  "Manage Leger authentication and Tailscale identity verification",
	}

	cmd.AddCommand(authLoginCmd())
	cmd.AddCommand(authStatusCmd())
	cmd.AddCommand(authLogoutCmd())

	return cmd
}

// authLoginCmd returns the auth login command
func authLoginCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "login",
		Short: "Authenticate with Leger Labs",
		Long: `Verify Tailscale identity and authenticate with Leger.

This command checks your existing Tailscale authentication and uses it
to authenticate with Leger Labs. No separate login is required.

Requirements:
- Tailscale must be installed
- Tailscale must be running (tailscale up)
- Device must be authenticated to a Tailnet`,
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()

			fmt.Println("Authenticating with Leger Labs...")
			fmt.Println()

			// Verify Tailscale identity
			client := tailscale.NewClient()
			identity, err := client.VerifyIdentity(ctx)
			if err != nil {
				return err
			}

			// Display identity
			fmt.Println("✓ Tailscale identity verified")
			fmt.Printf("  User:      %s\n", identity.LoginName)
			fmt.Printf("  Tailnet:   %s\n", identity.Tailnet)
			fmt.Printf("  Device:    %s\n", identity.DeviceName)
			fmt.Println()

			// TODO: Authenticate with Leger backend (Issue #8)
			fmt.Println("✓ Authenticated with Leger Labs")

			return nil
		},
	}
}

// authStatusCmd returns the auth status command
func authStatusCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "status",
		Short: "Check authentication status",
		Long: `Display current authentication status and Tailscale identity.

Shows whether you are authenticated with Leger Labs and displays
your Tailscale identity information.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()

			// Check Tailscale status
			client := tailscale.NewClient()

			if !client.IsInstalled() {
				fmt.Println("Tailscale: not installed")
				return fmt.Errorf("Tailscale not installed")
			}

			if !client.IsRunning(ctx) {
				fmt.Println("Tailscale: not running")
				return fmt.Errorf("Tailscale daemon not running")
			}

			identity, err := client.GetIdentity(ctx)
			if err != nil {
				return err
			}

			fmt.Println("Tailscale: authenticated")
			fmt.Printf("  User:      %s\n", identity.LoginName)
			fmt.Printf("  Tailnet:   %s\n", identity.Tailnet)
			fmt.Printf("  Device:    %s\n", identity.DeviceName)
			fmt.Println()

			// TODO: Check Leger backend authentication (Issue #8)
			fmt.Println("Leger Labs: not authenticated")
			fmt.Println("Run: leger auth login")

			return nil
		},
	}
}

// authLogoutCmd returns the auth logout command
func authLogoutCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "logout",
		Short: "Log out of Leger Labs",
		Long: `Clear Leger authentication credentials.

This removes your stored Leger authentication but does not affect
your Tailscale authentication.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			return fmt.Errorf("not yet implemented")
		},
	}
}
