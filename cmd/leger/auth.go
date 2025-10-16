package main

import (
	"fmt"

	"github.com/spf13/cobra"
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
			return fmt.Errorf("not yet implemented")
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
			return fmt.Errorf("not yet implemented")
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
