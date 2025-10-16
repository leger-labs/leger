package main

import (
	"fmt"
	"time"

	"github.com/spf13/cobra"
	"github.com/tailscale/setec/internal/auth"
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

This command checks your existing Tailscale authentication and uses it to
authenticate with Leger. No separate login is required.

Requirements:
- Tailscale must be installed
- Tailscale must be running (tailscale up)
- Device must be authenticated to a Tailnet

Your Tailscale identity will be stored locally in:
  ~/.config/leger/auth.json
`,
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()

			fmt.Println("Authenticating with Leger...")
			fmt.Println()

			// Check if already authenticated
			if auth.IsAuthenticated() {
				currentAuth, _ := auth.Load()
				fmt.Println("✓ Already authenticated")
				fmt.Printf("  User:      %s\n", currentAuth.TailscaleUser)
				fmt.Printf("  Tailnet:   %s\n", currentAuth.Tailnet)
				fmt.Printf("  Device:    %s\n", currentAuth.DeviceName)
				fmt.Println()
				fmt.Println("Run 'leger auth logout' to clear authentication")
				return nil
			}

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
			fmt.Printf("  IP:        %s\n", identity.DeviceIP)
			fmt.Println()

			// Save authentication
			authState := &auth.Auth{
				TailscaleUser:   identity.LoginName,
				Tailnet:         identity.Tailnet,
				DeviceName:      identity.DeviceName,
				DeviceIP:        identity.DeviceIP,
				AuthenticatedAt: time.Now(),
			}

			if err := authState.Save(); err != nil {
				return fmt.Errorf("failed to save authentication: %w", err)
			}

			authFile, _ := auth.AuthFile()
			fmt.Println("✓ Authentication saved")
			fmt.Printf("  Location:  %s\n", authFile)
			fmt.Println()
			fmt.Println("You're now authenticated with Leger!")

			return nil
		},
	}
}

// authStatusCmd returns the auth status command
func authStatusCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "status",
		Short: "Check authentication status",
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()

			// Check Tailscale status
			client := tailscale.NewClient()

			fmt.Println("=== Tailscale Status ===")
			fmt.Println()

			if !client.IsInstalled() {
				fmt.Println("Status: NOT INSTALLED")
				fmt.Println()
				fmt.Println("Install Tailscale from: https://tailscale.com/download")
				return fmt.Errorf("Tailscale not installed")
			}

			if !client.IsRunning(ctx) {
				fmt.Println("Status: NOT RUNNING")
				fmt.Println()
				fmt.Println("Start Tailscale: sudo tailscale up")
				return fmt.Errorf("Tailscale daemon not running")
			}

			identity, err := client.GetIdentity(ctx)
			if err != nil {
				fmt.Println("Status: ERROR")
				return err
			}

			fmt.Println("Status: AUTHENTICATED")
			fmt.Printf("  User:      %s\n", identity.LoginName)
			fmt.Printf("  Tailnet:   %s\n", identity.Tailnet)
			fmt.Printf("  Device:    %s\n", identity.DeviceName)
			fmt.Printf("  IP:        %s\n", identity.DeviceIP)
			fmt.Println()

			// Check Leger authentication
			fmt.Println("=== Leger Authentication ===")
			fmt.Println()

			authState, err := auth.Load()
			if err != nil {
				fmt.Println("Status: ERROR")
				return fmt.Errorf("failed to load auth: %w", err)
			}

			if authState == nil {
				fmt.Println("Status: NOT AUTHENTICATED")
				fmt.Println()
				fmt.Println("Run: leger auth login")
				return nil
			}

			fmt.Println("Status: AUTHENTICATED")
			fmt.Printf("  User:      %s\n", authState.TailscaleUser)
			fmt.Printf("  Tailnet:   %s\n", authState.Tailnet)
			fmt.Printf("  Device:    %s\n", authState.DeviceName)
			fmt.Printf("  Authenticated: %s\n", authState.AuthenticatedAt.Format("2006-01-02 15:04:05"))
			fmt.Println()

			// Verify identity matches
			if authState.TailscaleUser != identity.LoginName {
				fmt.Println("⚠ Warning: Tailscale identity has changed")
				fmt.Println("  Run 'leger auth login' to re-authenticate")
			}

			return nil
		},
	}
}

// authLogoutCmd returns the auth logout command
func authLogoutCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "logout",
		Short: "Log out of Leger",
		Long:  "Clear local authentication state. Tailscale authentication is not affected.",
		RunE: func(cmd *cobra.Command, args []string) error {
			if !auth.IsAuthenticated() {
				fmt.Println("Not authenticated")
				return nil
			}

			currentAuth, _ := auth.Load()

			if err := auth.Clear(); err != nil {
				return fmt.Errorf("failed to clear authentication: %w", err)
			}

			fmt.Println("✓ Logged out successfully")
			fmt.Printf("  User:      %s\n", currentAuth.TailscaleUser)
			fmt.Println()
			fmt.Println("Tailscale authentication is still active.")
			fmt.Println("Run 'leger auth login' to authenticate again.")

			return nil
		},
	}
}
