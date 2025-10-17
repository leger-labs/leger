package main

import (
	"fmt"
	"time"

	"github.com/spf13/cobra"
	"github.com/tailscale/setec/internal/auth"
	"github.com/tailscale/setec/internal/legerrun"
	"github.com/tailscale/setec/internal/tailscale"
	"github.com/tailscale/setec/internal/ui"
	"github.com/tailscale/setec/internal/version"
)

// authCmd returns the auth command group
func authCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "auth",
		Short: "Authentication commands",
		Long:  "Manage authentication with leger.run backend using Tailscale identity",
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
		Short: "Authenticate with leger.run",
		Long: `Authenticate CLI with leger.run backend using Tailscale identity.

Workflow:
  1. Reads your Tailscale identity locally
  2. Sends to leger.run for verification
  3. Receives and stores authentication token

Requires:
  - Active Tailscale connection
  - Account linked at app.leger.run (v0.2.0)`,
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()

			fmt.Println("Authenticating with leger.run...")
			fmt.Println()

			// Step 1: Check Tailscale is running
			fmt.Println("Step 1/3: Verifying Tailscale identity...")
			tsClient := tailscale.NewClient()
			identity, err := tsClient.VerifyIdentity(ctx)
			if err != nil {
				return fmt.Errorf(`Tailscale not running: %w

Start Tailscale:
  sudo tailscale up

Verify status:
  tailscale status`, err)
			}

			fmt.Println(ui.Success("✓") + " Tailscale identity verified")
			fmt.Printf("  User:      %s\n", identity.LoginName)
			fmt.Printf("  Tailnet:   %s\n", identity.Tailnet)
			fmt.Printf("  Device:    %s\n", identity.DeviceName)
			fmt.Printf("  IP:        %s\n", identity.DeviceIP)
			fmt.Println()

			// Step 2: Call leger.run backend
			fmt.Println("Step 2/3: Authenticating with leger.run backend...")
			client := legerrun.NewClient()

			// Convert tailscale.Identity to legerrun.TailscaleIdentity
			tsIdentity := legerrun.TailscaleIdentity{
				UserID:    fmt.Sprintf("%d", identity.UserID),
				LoginName: identity.LoginName,
				DeviceID:  identity.DeviceIP, // Use IP as device identifier
				Hostname:  identity.DeviceName,
				Tailnet:   identity.Tailnet,
			}

			authResp, err := client.AuthenticateCLI(ctx, tsIdentity, version.String())
			if err != nil {
				// Check for specific error codes
				if err == legerrun.ErrAccountNotLinked {
					return fmt.Errorf(`Tailscale account not linked to leger.run

Visit https://app.leger.run to link your account
(Web UI will be available in v0.2.0 with device code authentication)

For now, leger.run backend will accept any authenticated Tailscale user.`)
				}
				return fmt.Errorf("authentication failed: %w", err)
			}

			// Convert to StoredAuth
			expiresAt := time.Now().Add(time.Duration(authResp.Data.ExpiresIn) * time.Second)
			storedAuth := &auth.StoredAuth{
				Token:     authResp.Data.Token,
				TokenType: authResp.Data.TokenType,
				ExpiresAt: expiresAt,
				UserUUID:  authResp.Data.UserUUID,
				UserEmail: authResp.Data.User.TailscaleEmail,
			}

			fmt.Println(ui.Success("✓") + " Authentication successful")
			fmt.Println()

			// Step 3: Store token
			fmt.Println("Step 3/3: Saving authentication...")
			tokenStore := auth.NewTokenStore()
			if err := tokenStore.Save(storedAuth); err != nil {
				return fmt.Errorf("failed to save token: %w", err)
			}

			fmt.Println(ui.Success("✓") + " Authentication saved")
			fmt.Println()
			fmt.Println("Authenticated as", ui.Success(storedAuth.UserEmail))
			fmt.Printf("  User UUID:     %s\n", storedAuth.UserUUID)
			fmt.Printf("  Token expires: %s\n", storedAuth.ExpiresAt.Format(time.RFC3339))
			fmt.Println()
			fmt.Println("Next steps:")
			fmt.Println("  - Manage secrets: leger secrets set <name> <value>")
			fmt.Println("  - List secrets:   leger secrets list")
			fmt.Println("  - Check status:   leger auth status")

			return nil
		},
	}
}

// authStatusCmd returns the auth status command
func authStatusCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "status",
		Short: "Show authentication status",
		RunE: func(cmd *cobra.Command, args []string) error {
			tokenStore := auth.NewTokenStore()
			storedAuth, err := tokenStore.Load()
			if err != nil {
				fmt.Println("Status:", ui.Warning("NOT AUTHENTICATED"))
				fmt.Println()
				fmt.Println("Authenticate with: leger auth login")
				return nil
			}

			if !storedAuth.IsValid() {
				fmt.Println("Status:", ui.Warning("INVALID TOKEN"))
				fmt.Println()
				fmt.Println("Re-authenticate with: leger auth login")
				return nil
			}

			fmt.Println("Status:", ui.Success("AUTHENTICATED"))
			fmt.Printf("  User:    %s\n", storedAuth.UserEmail)
			fmt.Printf("  UUID:    %s\n", storedAuth.UserUUID)
			fmt.Println()

			// v1.0: Tokens do not expire
			fmt.Println("Note: Tokens remain valid until you run 'leger auth logout'")
			fmt.Println("      (Token expiry will be enforced in v1.1 with auto-refresh)")

			return nil
		},
	}
}

// authLogoutCmd returns the auth logout command
func authLogoutCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "logout",
		Short: "Clear authentication credentials",
		RunE: func(cmd *cobra.Command, args []string) error {
			tokenStore := auth.NewTokenStore()
			if err := tokenStore.Clear(); err != nil {
				return fmt.Errorf("failed to clear authentication: %w", err)
			}
			fmt.Println(ui.Success("✓") + " Logged out")
			fmt.Println()
			fmt.Println("Run 'leger auth login' to authenticate again")
			return nil
		},
	}
}
