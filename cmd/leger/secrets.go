package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"

	"github.com/spf13/cobra"
	"github.com/tailscale/setec/internal/auth"
	"github.com/tailscale/setec/internal/legerrun"
	"github.com/tailscale/setec/internal/ui"
)

// secretsCmd returns the secrets command group
func secretsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "secrets",
		Short: "Manage secrets on leger.run",
		Long: `Manage secrets stored in leger.run backend.

Secrets are encrypted at rest in Cloudflare KV and synced to
local deployments via legerd.`,
	}

	cmd.AddCommand(
		secretsSetCmd(),
		secretsListCmd(),
		secretsGetCmd(),
		secretsDeleteCmd(),
	)

	return cmd
}

// secretsSetCmd returns the secrets set command
func secretsSetCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "set <name> <value>",
		Short: "Create or update a secret",
		Long: `Set a secret value in leger.run backend.

Examples:
  # Set from argument
  leger secrets set openai_api_key sk-proj-abc123...

  # Set from stdin (for security)
  echo "sk-proj-abc123..." | leger secrets set openai_api_key -

  # Set from file
  leger secrets set ssh_key @~/.ssh/id_rsa`,
		Args: cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()
			name := args[0]
			value := args[1]

			// Handle special cases
			if value == "-" {
				// Read from stdin
				scanner := bufio.NewScanner(os.Stdin)
				if scanner.Scan() {
					value = scanner.Text()
				} else {
					return fmt.Errorf("failed to read from stdin")
				}
			} else if strings.HasPrefix(value, "@") {
				// Read from file
				filepath := strings.TrimPrefix(value, "@")
				// Expand ~ to home directory
				if strings.HasPrefix(filepath, "~") {
					home, err := os.UserHomeDir()
					if err != nil {
						return fmt.Errorf("failed to get home directory: %w", err)
					}
					filepath = strings.Replace(filepath, "~", home, 1)
				}
				data, err := os.ReadFile(filepath)
				if err != nil {
					return fmt.Errorf("failed to read file: %w", err)
				}
				value = string(data)
			}

			// Get auth token
			storedAuth, err := auth.RequireAuth()
			if err != nil {
				return err
			}

			// Call backend
			client := legerrun.NewClient().WithToken(storedAuth.Token)
			result, err := client.SetSecret(ctx, name, value)
			if err != nil {
				return fmt.Errorf("failed to set secret: %w", err)
			}

			fmt.Println(ui.Success("✓") + " Secret " + result.Message)
			fmt.Printf("  Name:    %s\n", name)
			fmt.Printf("  Version: %d\n", result.Version)
			fmt.Printf("  Updated: %s\n", result.UpdatedAt.Format("2006-01-02 15:04:05"))

			return nil
		},
	}
}

// secretsListCmd returns the secrets list command
func secretsListCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "list",
		Short: "List all secrets",
		Long: `List all secrets (metadata only, values not shown).

Shows secret names, creation dates, and version numbers.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()

			// Get auth
			storedAuth, err := auth.RequireAuth()
			if err != nil {
				return err
			}

			// Call backend
			client := legerrun.NewClient().WithToken(storedAuth.Token)
			secrets, err := client.ListSecrets(ctx)
			if err != nil {
				return fmt.Errorf("failed to list secrets: %w", err)
			}

			if len(secrets) == 0 {
				fmt.Println("No secrets configured")
				fmt.Println()
				fmt.Println("Add secrets with: leger secrets set <name> <value>")
				return nil
			}

			fmt.Printf("Secrets (%d total):\n", len(secrets))
			fmt.Println()

			// Format as table
			headers := []string{"Name", "Created", "Updated", "Version"}
			rows := make([][]string, len(secrets))

			for i, s := range secrets {
				rows[i] = []string{
					s.Name,
					s.CreatedAt.Format("2006-01-02"),
					s.UpdatedAt.Format("2006-01-02"),
					fmt.Sprintf("%d", s.Version),
				}
			}

			ui.PrintTable(headers, rows)

			return nil
		},
	}
}

// secretsGetCmd returns the secrets get command
func secretsGetCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "get <name>",
		Short: "Retrieve secret value",
		Long: `Get the value of a secret.

Prints to stdout for use in scripts.

Examples:
  # View secret
  leger secrets get openai_api_key

  # Export to environment
  export OPENAI_KEY=$(leger secrets get openai_api_key)

  # Use in script
  curl -H "Authorization: Bearer $(leger secrets get api_key)" api.example.com`,
		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()
			name := args[0]

			// Get auth
			storedAuth, err := auth.RequireAuth()
			if err != nil {
				return err
			}

			// Call backend
			client := legerrun.NewClient().WithToken(storedAuth.Token)
			secret, err := client.GetSecret(ctx, name)
			if err != nil {
				if err == legerrun.ErrSecretNotFound {
					return fmt.Errorf(`secret %q not found

List available secrets:
  leger secrets list

Create secret:
  leger secrets set %s <value>`, name, name)
				}
				return fmt.Errorf("failed to get secret: %w", err)
			}

			// Print to stdout (no newline for scripting)
			fmt.Print(secret.Value)

			return nil
		},
	}
}

// secretsDeleteCmd returns the secrets delete command
func secretsDeleteCmd() *cobra.Command {
	var force bool

	cmd := &cobra.Command{
		Use:   "delete <name>",
		Short: "Delete a secret",
		Long: `Delete a secret from leger.run backend.

Warning: This is permanent and cannot be undone.

Flags:
  --force   Skip confirmation prompt`,
		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()
			name := args[0]

			// Confirm unless --force
			if !force {
				if !ui.Confirm(fmt.Sprintf("Delete secret %q?", name)) {
					fmt.Println("Cancelled")
					return nil
				}
			}

			// Get auth
			storedAuth, err := auth.RequireAuth()
			if err != nil {
				return err
			}

			// Call backend
			client := legerrun.NewClient().WithToken(storedAuth.Token)
			result, err := client.DeleteSecret(ctx, name)
			if err != nil {
				if err == legerrun.ErrSecretNotFound {
					return fmt.Errorf(`secret %q not found

List available secrets:
  leger secrets list`, name)
				}
				return fmt.Errorf("failed to delete secret: %w", err)
			}

			fmt.Println(ui.Success("✓") + " Secret " + ui.Success(name) + " deleted")
			fmt.Printf("  Deleted at: %s\n", result.DeletedAt.Format("2006-01-02 15:04:05"))

			return nil
		},
	}

	cmd.Flags().BoolVar(&force, "force", false, "Skip confirmation prompt")

	return cmd
}
