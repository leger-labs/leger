package cli

import (
	"bufio"
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/leger-labs/leger/internal/auth"
	"github.com/leger-labs/leger/internal/daemon"
	"github.com/leger-labs/leger/internal/legerrun"
	"github.com/leger-labs/leger/internal/ui"
	"github.com/spf13/cobra"
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
		secretsSyncCmd(),
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

// secretsSyncCmd returns the secrets sync command
func secretsSyncCmd() *cobra.Command {
	var force bool
	var dryRun bool

	cmd := &cobra.Command{
		Use:   "sync [service]",
		Short: "Sync secrets from leger.run to legerd",
		Long: `Synchronize secrets from leger.run backend to local legerd daemon.

This command:
1. Fetches all secrets from leger.run (Cloudflare KV)
2. Connects to legerd daemon
3. Pushes each secret to legerd's local store
4. Verifies all secrets are available

The synced secrets are then available for deployment via 'leger deploy install'.

Examples:
  # Sync all secrets
  leger secrets sync

  # Sync secrets for a specific service (future)
  leger secrets sync openwebui

  # Dry run - show what would be synced
  leger secrets sync --dry-run

  # Force re-sync even if unchanged
  leger secrets sync --force`,
		Args: cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()

			serviceName := ""
			if len(args) > 0 {
				serviceName = args[0]
			}

			return runSecretsSync(ctx, serviceName, force, dryRun)
		},
	}

	cmd.Flags().BoolVar(&force, "force", false, "Re-sync even if secrets haven't changed")
	cmd.Flags().BoolVar(&dryRun, "dry-run", false, "Show what would be synced without syncing")

	return cmd
}

// runSecretsSync implements the secrets sync logic
func runSecretsSync(ctx context.Context, serviceName string, force, dryRun bool) error {
	// Step 1: Verify authentication
	fmt.Println(ui.Bold("Step 1/4: Authenticating..."))

	storedAuth, err := auth.RequireAuth()
	if err != nil {
		return err
	}

	fmt.Printf("✓ Authenticated as: %s\n", storedAuth.UserEmail)
	fmt.Println()

	// Step 2: Check legerd is running
	fmt.Println(ui.Bold("Step 2/4: Connecting to legerd daemon..."))

	daemonClient := daemon.NewClient("")
	if err := daemonClient.Health(ctx); err != nil {
		return fmt.Errorf(`legerd not running: %w

Start daemon with:
  systemctl --user start legerd.service

Check status with:
  systemctl --user status legerd.service`, err)
	}

	fmt.Println("✓ Connected to legerd")
	fmt.Println()

	// Step 3: Fetch secrets from leger.run backend
	fmt.Println(ui.Bold("Step 3/4: Fetching secrets from leger.run..."))

	apiClient := legerrun.NewClient().WithToken(storedAuth.Token)
	secrets, err := apiClient.ListSecrets(ctx)
	if err != nil {
		return fmt.Errorf("failed to fetch secrets from leger.run: %w", err)
	}

	if len(secrets) == 0 {
		fmt.Println("No secrets configured in leger.run")
		fmt.Println()
		fmt.Println("Add secrets with: leger secrets set <name> <value>")
		return nil
	}

	fmt.Printf("✓ Found %d secrets in leger.run\n", len(secrets))

	// List secrets that will be synced
	for _, s := range secrets {
		fmt.Printf("  - %s (version %d)\n", s.Name, s.Version)
	}
	fmt.Println()

	if dryRun {
		fmt.Println(ui.Info("Dry run mode - no secrets synced"))
		return nil
	}

	// Step 4: Sync each secret to legerd
	fmt.Println(ui.Bold("Step 4/4: Syncing secrets to legerd..."))

	syncCount := 0
	skipCount := 0
	errorCount := 0

	for _, secretMeta := range secrets {
		// Fetch full secret value from leger.run
		secretValue, err := apiClient.GetSecret(ctx, secretMeta.Name)
		if err != nil {
			fmt.Printf("  ✗ Failed to fetch %s: %v\n", secretMeta.Name, err)
			errorCount++
			continue
		}

		// Build full secret name with user UUID prefix for legerd
		fullSecretName := fmt.Sprintf("leger/%s/%s", storedAuth.UserUUID, secretMeta.Name)

		// Check if secret already exists in legerd (unless --force)
		if !force {
			existingInfo, err := daemonClient.InfoSecret(ctx, fullSecretName)
			if err == nil && existingInfo != nil {
				// Secret exists - skip unless version changed
				if int(existingInfo.ActiveVersion) == secretValue.Version {
					fmt.Printf("  ↻ Skipped %s (already at version %d)\n", secretMeta.Name, secretValue.Version)
					skipCount++
					continue
				}
			}
		}

		// Push secret to legerd
		version, err := daemonClient.PutSecret(ctx, fullSecretName, []byte(secretValue.Value))
		if err != nil {
			fmt.Printf("  ✗ Failed to sync %s: %v\n", secretMeta.Name, err)
			errorCount++
			continue
		}

		fmt.Printf("  ✓ Synced %s (version %d)\n", secretMeta.Name, version)
		syncCount++
	}

	fmt.Println()

	// Summary
	fmt.Println(ui.Bold("Sync Summary:"))
	fmt.Printf("  Synced:  %d\n", syncCount)
	if skipCount > 0 {
		fmt.Printf("  Skipped: %d (use --force to re-sync)\n", skipCount)
	}
	if errorCount > 0 {
		fmt.Printf("  Errors:  %d\n", errorCount)
	}
	fmt.Println()

	if errorCount > 0 {
		return fmt.Errorf("failed to sync %d secrets", errorCount)
	}

	if syncCount > 0 {
		fmt.Println(ui.Success("✓") + " Secrets synced successfully")
		fmt.Println()
		fmt.Println("Secrets are now available for deployment:")
		fmt.Println("  leger deploy install <name>")
	} else if skipCount > 0 {
		fmt.Println(ui.Info("All secrets already up to date"))
	}

	return nil
}
