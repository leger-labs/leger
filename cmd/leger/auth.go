package main

import (
	"context"
	"fmt"
	"time"

	"github.com/spf13/cobra"
	"github.com/tailscale/setec/internal/auth"
	"github.com/tailscale/setec/internal/daemon"
	"github.com/tailscale/setec/internal/legerrun"
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

This command:
1. Verifies your Tailscale authentication
2. Derives your user UUID from Tailscale identity
3. Fetches all secrets from leger.run (Cloudflare KV)
4. Populates legerd daemon with your secrets
5. Stores authentication state locally

Requirements:
- Tailscale must be installed and running
- Device must be authenticated to a Tailnet
- legerd daemon must be running

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

			// Step 1: Verify Tailscale identity
			fmt.Println("Step 1/4: Verifying Tailscale identity...")
			tsClient := tailscale.NewClient()
			identity, err := tsClient.VerifyIdentity(ctx)
			if err != nil {
				return fmt.Errorf("Tailscale verification failed: %w\n\nPlease ensure:\n  - Tailscale is installed\n  - Tailscale daemon is running (sudo tailscale up)\n  - Device is authenticated to your tailnet", err)
			}

			fmt.Println("✓ Tailscale identity verified")
			fmt.Printf("  User:      %s\n", identity.LoginName)
			fmt.Printf("  Tailnet:   %s\n", identity.Tailnet)
			fmt.Printf("  Device:    %s\n", identity.DeviceName)
			fmt.Printf("  IP:        %s\n", identity.DeviceIP)
			fmt.Println()

			// Derive user UUID from Tailscale identity
			userUUID := deriveUserUUID(identity)
			fmt.Printf("  User UUID: %s\n", userUUID)
			fmt.Println()

			// Step 2: Check legerd health
			fmt.Println("Step 2/4: Checking legerd daemon...")
			daemonClient := daemon.NewClient("")
			if err := daemonClient.Health(ctx); err != nil {
				return fmt.Errorf("legerd not running: %w\n\nStart legerd with:\n  systemctl --user start legerd.service\n\nOr check logs:\n  journalctl --user -u legerd.service -f", err)
			}
			fmt.Println("✓ legerd is running")
			fmt.Println()

			// Step 3: Fetch secrets from leger.run
			fmt.Println("Step 3/4: Fetching secrets from leger.run...")
			lrClient := legerrun.NewClient()

			// Add timeout for leger.run fetch
			fetchCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
			defer cancel()

			secrets, err := lrClient.FetchSecrets(fetchCtx, userUUID)
			if err != nil {
				return fmt.Errorf("failed to fetch secrets from leger.run: %w\n\nPlease ensure:\n  - You are connected to your Tailscale network\n  - You have configured secrets in the leger.run web interface\n  - The leger.run API is accessible", err)
			}

			fmt.Printf("✓ Fetched %d secrets from leger.run\n", len(secrets))
			fmt.Println()

			// Step 4: Populate legerd with secrets using setec.Client.Put()
			fmt.Println("Step 4/4: Populating legerd with secrets...")
			
			// Use leger/{user-uuid}/ prefix for secret names
			prefix := fmt.Sprintf("leger/%s/", userUUID)
			
			successCount := 0
			failCount := 0
			for name, value := range secrets {
				// Construct full secret name with prefix
				fullName := prefix + name
				
				// Use setec.Client.Put() to store in legerd
				version, err := daemonClient.PutSecret(ctx, fullName, value)
				if err != nil {
					fmt.Printf("  ✗ Failed to store secret %q: %v\n", name, err)
					failCount++
					continue
				}
				
				fmt.Printf("  ✓ Stored secret %q (version %d)\n", name, version)
				successCount++
			}

			fmt.Println()
			fmt.Printf("✓ Stored %d/%d secrets in legerd\n", successCount, len(secrets))
			
			if failCount > 0 {
				fmt.Printf("  ⚠ %d secrets failed to store\n", failCount)
			}
			fmt.Println()

			// Step 5: Save authentication state
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
			fmt.Println()
			fmt.Println("Next steps:")
			fmt.Println("  - Deploy quadlets: leger deploy install <source>")
			fmt.Println("  - List secrets: leger secrets list")
			fmt.Println("  - Check status: leger status")

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
			userUUID := deriveUserUUID(identity)
			fmt.Printf("  UUID:      %s\n", userUUID)
			fmt.Println()

			// Check legerd daemon
			fmt.Println("=== legerd Daemon ===")
			fmt.Println()

			daemonClient := daemon.NewClient("")
			if err := daemonClient.Health(ctx); err != nil {
				fmt.Println("Status: NOT RUNNING")
				fmt.Printf("  Error: %v\n", err)
				fmt.Println()
				fmt.Println("Start legerd:")
				fmt.Println("  systemctl --user start legerd.service")
			} else {
				fmt.Println("Status: RUNNING")
				fmt.Println("  URL: http://localhost:8080")
				
				// Get secret count
				secrets, err := daemonClient.ListSecrets(ctx)
				if err == nil {
					fmt.Printf("  Secrets: %d stored\n", len(secrets))
				}
			}
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
			fmt.Println("Note: Secrets remain in legerd daemon.")
			fmt.Println("Tailscale authentication is still active.")
			fmt.Println("Run 'leger auth login' to authenticate again.")

			return nil
		},
	}
}

// deriveUserUUID derives a user UUID from Tailscale identity
// In production, this would be a proper mapping from the leger.run API
// For now, we use a simplified version based on the UserID
func deriveUserUUID(identity *tailscale.Identity) string {
	// TODO: In production, fetch the proper UUID mapping from leger.run API
	// For now, use a deterministic UUID based on Tailscale UserID
	return fmt.Sprintf("%d", identity.UserID)
}
