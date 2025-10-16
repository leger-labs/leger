package main

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/spf13/cobra"
	"github.com/tailscale/setec/internal/auth"
	"github.com/tailscale/setec/internal/daemon"
	"github.com/tailscale/setec/internal/legerrun"
	"github.com/tailscale/setec/internal/podman"
	"github.com/tailscale/setec/internal/quadlet"
	"github.com/tailscale/setec/internal/tailscale"
)

// secretsCmd returns the secrets command group
func secretsCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "secrets",
		Short: "Secrets management",
		Long:  "Manage secrets via legerd daemon",
	}

	cmd.AddCommand(secretsSyncCmd())
	cmd.AddCommand(secretsListCmd())
	cmd.AddCommand(secretsInfoCmd())
	cmd.AddCommand(secretsRotateCmd())

	return cmd
}

var syncFlags struct {
	force  bool
	dryRun bool
}

// secretsSyncCmd returns the secrets sync command
func secretsSyncCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "sync [service]",
		Short: "Sync secrets from leger.run backend",
		Long: `Synchronize secrets from Leger backend and store in legerd.

This command:
1. Authenticates to leger.run using Tailscale
2. Fetches the latest secrets from Cloudflare KV
3. Updates legerd using setec.Client.Put()
4. Reports sync status

The sync operation is manual. legerd performs automatic background 
synchronization at regular intervals. Use this command when you need
to immediately sync after adding or updating secrets in the web interface.

If [service] is specified, only secrets for that service are synced.
Otherwise, all secrets are synced.
`,
		Args: cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()

			serviceName := ""
			if len(args) > 0 {
				serviceName = args[0]
			}

			return runSecretsSync(ctx, serviceName)
		},
	}

	cmd.Flags().BoolVar(&syncFlags.force, "force", false, "Re-sync even if secrets haven't changed")
	cmd.Flags().BoolVar(&syncFlags.dryRun, "dry-run", false, "Show what would be synced without doing it")

	return cmd
}

func runSecretsSync(ctx context.Context, serviceName string) error {
	fmt.Println("Syncing secrets from leger.run...")
	fmt.Println()

	// Step 1: Verify authentication
	fmt.Println("Step 1/4: Verifying authentication...")
	
	if !auth.IsAuthenticated() {
		return fmt.Errorf("not authenticated\n\nRun: leger auth login")
	}

	authState, err := auth.Load()
	if err != nil {
		return fmt.Errorf("failed to load auth: %w", err)
	}

	tsClient := tailscale.NewClient()
	identity, err := tsClient.VerifyIdentity(ctx)
	if err != nil {
		return fmt.Errorf("Tailscale verification failed: %w", err)
	}

	// Verify identity matches
	if authState.TailscaleUser != identity.LoginName {
		return fmt.Errorf("Tailscale identity has changed\n\nRun: leger auth login")
	}

	userUUID := deriveUserUUID(identity)
	fmt.Println("✓ Authenticated")
	fmt.Printf("  User:   %s\n", identity.LoginName)
	fmt.Printf("  UUID:   %s\n", userUUID)
	fmt.Println()

	// Step 2: Check legerd health
	fmt.Println("Step 2/4: Checking legerd daemon...")
	
	daemonClient := daemon.NewClient("")
	if err := daemonClient.Health(ctx); err != nil {
		return fmt.Errorf("legerd not running: %w\n\nStart with: systemctl --user start legerd.service", err)
	}

	fmt.Println("✓ legerd is running")
	fmt.Println()

	// Step 3: Fetch secrets from leger.run
	fmt.Println("Step 3/4: Fetching secrets from leger.run...")
	
	lrClient := legerrun.NewClient()
	
	fetchCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	secrets, err := lrClient.FetchSecrets(fetchCtx, userUUID)
	if err != nil {
		return fmt.Errorf("failed to fetch secrets: %w", err)
	}

	fmt.Printf("✓ Fetched %d secrets from leger.run\n", len(secrets))

	// Filter by service if specified
	if serviceName != "" {
		filtered := make(map[string][]byte)
		prefix := serviceName + "_"
		
		for name, value := range secrets {
			if name == serviceName || len(name) > len(prefix) && name[:len(prefix)] == prefix {
				filtered[name] = value
			}
		}
		
		secrets = filtered
		fmt.Printf("  Filtered to %d secrets for service %q\n", len(secrets), serviceName)
	}
	fmt.Println()

	if syncFlags.dryRun {
		fmt.Println("Dry run mode - would sync the following secrets:")
		for name := range secrets {
			fmt.Printf("  - %s\n", name)
		}
		return nil
	}

	// Step 4: Update legerd with secrets
	fmt.Println("Step 4/4: Updating legerd...")
	
	prefix := fmt.Sprintf("leger/%s/", userUUID)
	
	updated := 0
	failed := 0
	skipped := 0

	for name, value := range secrets {
		fullName := prefix + name
		
		// Check if secret exists and has same version (if not force)
		if !syncFlags.force {
			existing, err := daemonClient.InfoSecret(ctx, fullName)
			if err == nil && existing != nil {
				// Secret exists - for now, always update
				// In production, we'd check if value changed
			}
		}

		// Pattern 6: Use context timeout
		putCtx, putCancel := context.WithTimeout(ctx, 10*time.Second)
		version, err := daemonClient.PutSecret(putCtx, fullName, value)
		putCancel()

		if err != nil {
			fmt.Printf("  ✗ Failed to update %q: %v\n", name, err)
			failed++
			continue
		}

		fmt.Printf("  ✓ Updated %q (version %d)\n", name, version)
		updated++
	}

	fmt.Println()
	fmt.Printf("✓ Sync complete: %d updated, %d failed, %d skipped\n", updated, failed, skipped)

	if failed > 0 {
		return fmt.Errorf("%d secrets failed to sync", failed)
	}

	fmt.Println()
	fmt.Println("Secrets have been synced to legerd.")
	fmt.Println("Podman quadlets will automatically use the updated secrets.")

	return nil
}

// secretsListCmd returns the secrets list command
func secretsListCmd() *cobra.Command {
	var showPodman bool

	cmd := &cobra.Command{
		Use:   "list",
		Short: "List available secrets",
		Long: `Display all available secrets from legerd.

Shows secrets that are available from legerd for use in
your Podman Quadlet deployments.
`,
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()

			// Pattern 4: Health check before operations
			daemonClient := daemon.NewClient("")
			if err := daemonClient.Health(ctx); err != nil {
				return fmt.Errorf("legerd not running: %w\n\nStart legerd with:\n  systemctl --user start legerd.service\n\nOr check logs:\n  journalctl --user -u legerd.service -f", err)
			}

			// Pattern 6: Use context with timeout
			listCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
			defer cancel()

			secrets, err := daemonClient.ListSecrets(listCtx)
			if err != nil {
				return fmt.Errorf("failed to list secrets: %w", err)
			}

			if len(secrets) == 0 {
				fmt.Println("No secrets found in legerd")
				fmt.Println()
				fmt.Println("To add secrets:")
				fmt.Println("  1. Configure secrets in the leger.run web interface")
				fmt.Println("  2. Run: leger auth login")
				return nil
			}

			fmt.Printf("Available secrets in legerd (%d total):\n", len(secrets))
			fmt.Println()

			for _, secret := range secrets {
				fmt.Printf("  • %s\n", secret.Name)
				fmt.Printf("    Active version: %d\n", secret.ActiveVersion)
				if len(secret.Versions) > 1 {
					fmt.Printf("    Total versions: %d\n", len(secret.Versions))
				}
			}

			if showPodman {
				fmt.Println()
				fmt.Println("Podman secrets:")
				// TODO: List Podman secrets and show which quadlets use them
			}

			return nil
		},
	}

	cmd.Flags().BoolVar(&showPodman, "podman", false, "Also list Podman secrets")

	return cmd
}

// secretsInfoCmd returns detailed information about a secret
func secretsInfoCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "info <secret-name>",
		Short: "Show detailed information about a secret",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()
			secretName := args[0]

			daemonClient := daemon.NewClient("")
			if err := daemonClient.Health(ctx); err != nil {
				return fmt.Errorf("legerd not running: %w", err)
			}

			infoCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
			defer cancel()

			info, err := daemonClient.InfoSecret(infoCtx, secretName)
			if err != nil {
				return fmt.Errorf("failed to get secret info: %w", err)
			}

			fmt.Printf("Secret: %s\n", info.Name)
			fmt.Printf("Active version: %d\n", info.ActiveVersion)
			fmt.Printf("Total versions: %d\n", len(info.Versions))
			fmt.Println()
			fmt.Println("Versions:")
			for _, v := range info.Versions {
				active := ""
				if v == info.ActiveVersion {
					active = " (active)"
				}
				fmt.Printf("  • Version %d%s\n", v, active)
			}

			return nil
		},
	}
}

var rotateFlags struct {
	noRestart bool
}

// secretsRotateCmd returns the secrets rotate command
func secretsRotateCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "rotate <secret-name>",
		Short: "Rotate a secret (generates new value)",
		Long: `Rotate a secret by generating a new value.

This command:
1. Verifies legerd is running
2. Generates a new random value
3. Creates a new version of the secret in legerd
4. Identifies services using the secret
5. Restarts affected services (unless --no-restart)

The new value is a cryptographically secure random string.`,
		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()
			secretName := args[0]

			return runSecretsRotate(ctx, secretName)
		},
	}

	cmd.Flags().BoolVar(&rotateFlags.noRestart, "no-restart", false, "Don't restart services after rotation")

	return cmd
}

func runSecretsRotate(ctx context.Context, secretName string) error {
	fmt.Printf("Rotating secret %q...\n", secretName)
	fmt.Println()

	// Step 1: Verify legerd is running
	fmt.Println("Step 1/5: Checking legerd daemon...")
	daemonClient := daemon.NewClient("")
	if err := daemonClient.Health(ctx); err != nil {
		return fmt.Errorf(`legerd not running

Start daemon:
  systemctl --user start legerd.service`)
	}
	fmt.Println("✓ legerd is running")
	fmt.Println()

	// Step 2: Verify secret exists
	fmt.Println("Step 2/5: Verifying secret exists...")
	infoCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	info, err := daemonClient.InfoSecret(infoCtx, secretName)
	cancel()
	if err != nil {
		return fmt.Errorf("secret not found: %w\n\nList available secrets:\n  leger secrets list", err)
	}
	fmt.Printf("✓ Found secret (current version: %d)\n", info.ActiveVersion)
	fmt.Println()

	// Step 3: Generate new value and rotate
	fmt.Println("Step 3/5: Generating new value and rotating...")

	// Generate a cryptographically secure random value (32 bytes = 256 bits)
	newValue := make([]byte, 32)
	if _, err := rand.Read(newValue); err != nil {
		return fmt.Errorf("failed to generate random value: %w", err)
	}

	// Encode as base64 for better usability
	newValueEncoded := base64.StdEncoding.EncodeToString(newValue)

	rotateCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	newVersion, err := daemonClient.RotateSecret(rotateCtx, secretName, []byte(newValueEncoded))
	cancel()
	if err != nil {
		return fmt.Errorf("failed to rotate secret: %w", err)
	}

	fmt.Printf("✓ Created new version: %d\n", newVersion)
	fmt.Println()

	// Step 4: Identify services using this secret
	fmt.Println("Step 4/5: Identifying affected services...")

	affectedServices, err := findServicesUsingSecret(secretName)
	if err != nil {
		fmt.Printf("Warning: Could not identify affected services: %v\n", err)
		affectedServices = []string{}
	}

	if len(affectedServices) == 0 {
		fmt.Println("ℹ No services found using this secret")
		fmt.Println()
		fmt.Println("✓ Secret rotation complete")
		return nil
	}

	fmt.Printf("Found %d service(s) using this secret:\n", len(affectedServices))
	for _, svc := range affectedServices {
		fmt.Printf("  - %s\n", svc)
	}
	fmt.Println()

	// Step 5: Restart affected services
	if rotateFlags.noRestart {
		fmt.Println("Step 5/5: Skipping service restart (--no-restart)")
		fmt.Println()
		fmt.Println("✓ Secret rotation complete")
		fmt.Println()
		fmt.Println("Note: Services must be restarted manually to use the new secret:")
		for _, svc := range affectedServices {
			fmt.Printf("  leger service restart %s\n", svc)
		}
		return nil
	}

	fmt.Println("Step 5/5: Restarting affected services...")

	sm := podman.NewSystemdManager("user")
	failed := []string{}

	for _, svc := range affectedServices {
		fmt.Printf("  Restarting %s...", svc)
		if err := sm.RestartService(svc); err != nil {
			fmt.Printf(" ✗ Failed: %v\n", err)
			failed = append(failed, svc)
		} else {
			fmt.Println(" ✓")
		}
	}

	fmt.Println()

	if len(failed) > 0 {
		fmt.Printf("⚠️  %d service(s) failed to restart:\n", len(failed))
		for _, svc := range failed {
			fmt.Printf("  - %s\n", svc)
		}
		fmt.Println()
		fmt.Println("Check logs:")
		for _, svc := range failed {
			fmt.Printf("  leger service logs %s\n", svc)
		}
		return fmt.Errorf("%d service(s) failed to restart", len(failed))
	}

	fmt.Println("✓ Secret rotation complete")
	fmt.Println()
	fmt.Println("All services have been restarted and are now using the new secret.")

	return nil
}

// findServicesUsingSecret finds all services that use a given secret
func findServicesUsingSecret(secretName string) ([]string, error) {
	// Look in the standard quadlet directories
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return nil, err
	}

	quadletDirs := []string{
		filepath.Join(homeDir, ".config", "containers", "systemd"),
		filepath.Join(homeDir, ".local", "share", "bluebuild-quadlets", "active"),
	}

	services := []string{}
	seen := make(map[string]bool)

	for _, baseDir := range quadletDirs {
		if _, err := os.Stat(baseDir); os.IsNotExist(err) {
			continue
		}

		// Parse all quadlets in this directory tree
		err := filepath.Walk(baseDir, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return nil // Skip errors
			}

			if info.IsDir() {
				return nil
			}

			// Only check .container files for secrets
			if filepath.Ext(path) != ".container" {
				return nil
			}

			// Parse the file for Secret= directives
			secrets, err := quadlet.ParseFile(path)
			if err != nil {
				return nil // Skip files we can't parse
			}

			// Check if this file uses the secret we're rotating
			if _, found := secrets[secretName]; found {
				// Convert quadlet name to service name
				baseName := filepath.Base(path)
				serviceName := podman.QuadletNameToServiceName(baseName)

				if !seen[serviceName] {
					services = append(services, serviceName)
					seen[serviceName] = true
				}
			}

			return nil
		})

		if err != nil {
			return nil, err
		}
	}

	return services, nil
}
