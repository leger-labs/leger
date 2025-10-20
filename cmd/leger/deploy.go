package main

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/spf13/cobra"
	"github.com/leger-labs/leger/internal/auth"
	"github.com/leger-labs/leger/internal/daemon"
	"github.com/leger-labs/leger/internal/git"
	"github.com/leger-labs/leger/internal/legerrun"
	"github.com/leger-labs/leger/internal/podman"
	"github.com/leger-labs/leger/internal/quadlet"
	"github.com/leger-labs/leger/internal/staging"
	"github.com/leger-labs/leger/internal/ui"
	"github.com/leger-labs/leger/internal/validation"
)

// deployCmd returns the deploy command group
func deployCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "deploy",
		Short: "Deployment commands",
		Long:  "Manage Podman Quadlet deployments from Git repositories",
	}

	cmd.AddCommand(deployInstallCmd())
	cmd.AddCommand(deployUpdateCmd())
	cmd.AddCommand(deployListCmd())
	cmd.AddCommand(deployRemoveCmd())

	return cmd
}

var installFlags struct {
	source    string
	noStart   bool
	dryRun    bool
	force     bool
	noSecrets bool
}

// deployInstallCmd returns the deploy install command
func deployInstallCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "install [name]",
		Short: "Install quadlet deployment",
		Long: `Install a new Leger deployment from Git repository.

This command:
1. Validates authentication and legerd connectivity
2. Downloads quadlet files from source repository
3. Parses quadlet files for Secret= directives
4. Creates setec.Store with AllowLookup enabled
5. Fetches required secrets from legerd
6. Creates Podman secrets for each required secret
7. Installs quadlets using: podman quadlet install --user
8. Starts services (unless --no-start)

Source can be:
- Empty (uses your leger.run repository)
- Git URL (e.g., https://github.com/org/repo)
- Local path (e.g., ~/quadlets)
`,
		Args: cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()

			name := "default"
			if len(args) > 0 {
				name = args[0]
			}

			return runDeployInstall(ctx, name)
		},
	}

	cmd.Flags().StringVar(&installFlags.source, "source", "", "Source repository URL or path")
	cmd.Flags().BoolVar(&installFlags.noStart, "no-start", false, "Install but do not start services")
	cmd.Flags().BoolVar(&installFlags.dryRun, "dry-run", false, "Validate and show what would be installed")
	cmd.Flags().BoolVar(&installFlags.force, "force", false, "Skip conflict checks")
	cmd.Flags().BoolVar(&installFlags.noSecrets, "no-secrets", false, "Skip secret injection (for testing)")

	return cmd
}

func runDeployInstall(ctx context.Context, name string) error {
	ui.InfoPrintf("Installing deployment: %s\n\n", name)

	// Step 1: Verify prerequisites
	fmt.Println(ui.Bold("Step 1/7: Verifying prerequisites..."))

	var userUUID string
	var daemonClient *daemon.Client

	// Skip auth check if --no-secrets is used (for testing)
	if !installFlags.noSecrets {
		storedAuth, err := auth.RequireAuth()
		if err != nil {
			return err
		}
		userUUID = storedAuth.UserUUID

		daemonClient = daemon.NewClient("")
		if err := daemonClient.Health(ctx); err != nil {
			return fmt.Errorf("legerd not running: %w\n\nStart with: systemctl --user start legerd.service", err)
		}
	} else {
		// In test mode, use a placeholder UUID
		userUUID = "test-user-uuid"
		fmt.Println("⚠ Running in test mode (--no-secrets)")
	}

	ui.SuccessPrintf("✓ Prerequisites verified\n\n")

	// Step 2: Download/locate quadlet files
	fmt.Println("Step 2/7: Locating quadlet files...")

	var quadletDir string
	var err error
	if installFlags.source == "" {
		// Use leger.run repository
		quadletDir, err = downloadFromLegerRun(ctx, userUUID, name)
	} else if isURL(installFlags.source) {
		// Clone from Git
		quadletDir, err = cloneGitRepo(ctx, installFlags.source, name)
	} else {
		// Use local path
		quadletDir = installFlags.source
		if !filepath.IsAbs(quadletDir) {
			quadletDir, err = filepath.Abs(quadletDir)
		}
	}

	if err != nil {
		return fmt.Errorf("failed to locate quadlets: %w", err)
	}

	fmt.Printf("✓ Quadlet directory: %s\n", quadletDir)
	fmt.Println()

	// Step 3: Parse quadlet files for secrets
	fmt.Println("Step 3/7: Parsing quadlet files...")

	parseResult, err := quadlet.ParseDirectory(quadletDir)
	if err != nil {
		return fmt.Errorf("failed to parse quadlets: %w", err)
	}

	fmt.Printf("✓ Found %d quadlet files\n", len(parseResult.QuadletFiles))
	if len(parseResult.Secrets) > 0 {
		fmt.Printf("  Requires %d secrets\n", len(parseResult.Secrets))
		for _, secret := range parseResult.Secrets {
			fmt.Printf("    - %s (type=%s, target=%s)\n", secret.Name, secret.Type, secret.Target)
		}
	} else {
		fmt.Println("  No secrets required")
	}
	fmt.Println()

	// Step 4: Create setec.Store and fetch secrets
	if len(parseResult.Secrets) > 0 && !installFlags.noSecrets {
		fmt.Println("Step 4/7: Fetching secrets from legerd...")

		if err := fetchAndCreateSecrets(ctx, daemonClient, userUUID, parseResult); err != nil {
			return fmt.Errorf("failed to handle secrets: %w", err)
		}

		fmt.Printf("✓ All %d secrets available\n", len(parseResult.Secrets))
		fmt.Println()
	} else {
		fmt.Println("Step 4/7: No secrets to fetch")
		fmt.Println()
	}

	// Step 5: Validate quadlets
	fmt.Println("Step 5/7: Validating quadlets...")

	if err := validateQuadlets(quadletDir); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	fmt.Println("✓ Quadlet validation passed")
	fmt.Println()

	if installFlags.dryRun {
		fmt.Println("Dry run mode - stopping here")
		return nil
	}

	// Step 6: Install quadlets using podman
	fmt.Println("Step 6/7: Installing quadlets...")

	if err := installQuadlets(ctx, quadletDir); err != nil {
		return fmt.Errorf("failed to install quadlets: %w", err)
	}

	fmt.Println("✓ Quadlets installed")
	fmt.Println()

	// Step 7: Start services
	if !installFlags.noStart {
		fmt.Println("Step 7/7: Starting services...")

		if err := startServices(ctx, parseResult); err != nil {
			return fmt.Errorf("failed to start services: %w", err)
		}

		fmt.Println("✓ Services started")
	} else {
		fmt.Println("Step 7/7: Skipping service start (--no-start)")
	}
	fmt.Println()

	fmt.Println("✓ Deployment complete!")
	fmt.Println()
	fmt.Println("Next steps:")
	fmt.Println("  - Check status: leger status")
	fmt.Println("  - View logs: leger service logs <service>")
	fmt.Println("  - List deployments: leger deploy list")

	return nil
}

// fetchAndCreateSecrets uses setec.Store to fetch secrets and create Podman secrets
func fetchAndCreateSecrets(ctx context.Context, client *daemon.Client, userUUID string, parseResult *quadlet.ParseResult) error {
	// Create context with timeout for store operations
	storeCtx, cancel := context.WithTimeout(ctx, 30*time.Second)
	defer cancel()

	// Get secret names (without prefix for Store initialization)
	secretNames := parseResult.GetSecretNames()

	// Add prefix for full secret paths
	prefix := fmt.Sprintf("leger/%s/", userUUID)
	prefixedNames := make([]string, len(secretNames))
	for i, name := range secretNames {
		prefixedNames[i] = prefix + name
	}

	// Pattern 1: Create Store with AllowLookup enabled
	// Pattern 3: Block until secrets are available
	store, err := client.NewStore(storeCtx, prefixedNames)
	if err != nil {
		return fmt.Errorf("failed to create store: %w", err)
	}
	defer store.Close()

	fmt.Printf("✓ Connected to legerd store\n")

	// Pattern 2: Use LookupSecret for each discovered secret
	for _, secretName := range secretNames {
		fullName := prefix + secretName

		// Pattern 6: Use context timeout for each lookup
		lookupCtx, lookupCancel := context.WithTimeout(ctx, 5*time.Second)

		secret, err := store.LookupSecret(lookupCtx, fullName)
		lookupCancel()

		if err != nil {
			return fmt.Errorf("secret %q not found in legerd: %w\n\nEnsure secrets are synced: leger auth login", secretName, err)
		}

		// Create Podman secret
		if err := createPodmanSecret(ctx, secretName, secret.Get()); err != nil {
			return fmt.Errorf("failed to create Podman secret %q: %w", secretName, err)
		}

		fmt.Printf("  ✓ Created Podman secret: %s\n", secretName)
	}

	return nil
}

// createPodmanSecret creates or updates a Podman secret
func createPodmanSecret(ctx context.Context, name string, value []byte) error {
	// Check if secret already exists
	checkCmd := exec.CommandContext(ctx, "podman", "secret", "inspect", name)
	if err := checkCmd.Run(); err == nil {
		// Secret exists, remove it first
		rmCmd := exec.CommandContext(ctx, "podman", "secret", "rm", name)
		if err := rmCmd.Run(); err != nil {
			return fmt.Errorf("failed to remove existing secret: %w", err)
		}
	}

	// Create new secret
	cmd := exec.CommandContext(ctx, "podman", "secret", "create", name, "-")
	cmd.Stdin = bytes.NewReader(value)

	var stderr bytes.Buffer
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return fmt.Errorf("podman secret create failed: %w\nStderr: %s", err, stderr.String())
	}

	return nil
}

// installQuadlets installs quadlet files using podman quadlet install
func installQuadlets(ctx context.Context, quadletDir string) error {
	qm := podman.NewQuadletManager("user")

	if err := qm.Install(quadletDir); err != nil {
		return err
	}

	fmt.Println("✓ Quadlets installed successfully")
	return nil
}

// validateQuadlets validates quadlet syntax
func validateQuadlets(quadletDir string) error {
	// Validate syntax
	if err := validation.ValidateQuadletDirectory(quadletDir); err != nil {
		return err
	}

	// Check for conflicts if not forced
	if !installFlags.force {
		conflicts, err := validation.CheckPortConflicts(quadletDir)
		if err != nil {
			return fmt.Errorf("failed to check port conflicts: %w", err)
		}

		if len(conflicts) > 0 {
			fmt.Println("\n⚠ Port conflicts detected:")
			for _, conflict := range conflicts {
				fmt.Printf("  Port %s/%s used by: %s\n", conflict.Port, conflict.Protocol, strings.Join(conflict.Quadlets, ", "))
			}
			return fmt.Errorf("port conflicts found - use --force to skip this check")
		}
	}

	return nil
}

// startServices starts the installed services
func startServices(ctx context.Context, parseResult *quadlet.ParseResult) error {
	// Extract service names from quadlet files
	for _, qfile := range parseResult.QuadletFiles {
		base := filepath.Base(qfile)
		serviceName := base[:len(base)-len(filepath.Ext(base))] + ".service"

		cmd := exec.CommandContext(ctx, "systemctl", "--user", "start", serviceName)
		if err := cmd.Run(); err != nil {
			fmt.Printf("  ⚠ Failed to start %s: %v\n", serviceName, err)
			continue
		}

		fmt.Printf("  ✓ Started: %s\n", serviceName)
	}

	return nil
}

// Helper functions

func isURL(s string) bool {
	return len(s) > 7 && (s[:7] == "http://" || s[:8] == "https://")
}

func downloadFromLegerRun(ctx context.Context, userUUID, name string) (string, error) {
	// Create leger.run client
	client := legerrun.NewClient()

	// Determine version (default to "latest")
	version := "latest"
	if name != "default" {
		version = name
	}

	// Fetch manifest
	manifestData, err := client.FetchManifest(ctx, userUUID, version)
	if err != nil {
		return "", fmt.Errorf("failed to fetch manifest from leger.run: %w", err)
	}

	// Parse manifest
	manifest, err := legerrun.ParseManifest(manifestData)
	if err != nil {
		return "", fmt.Errorf("failed to parse manifest: %w", err)
	}

	// Create temporary directory for quadlet files
	tmpDir, err := os.MkdirTemp("", "leger-"+name+"-*")
	if err != nil {
		return "", fmt.Errorf("failed to create temp directory: %w", err)
	}

	// Save manifest to temp directory
	manifestPath := filepath.Join(tmpDir, "manifest.json")
	if err := os.WriteFile(manifestPath, manifestData, 0644); err != nil {
		return "", fmt.Errorf("failed to save manifest: %w", err)
	}

	// Download each quadlet file from leger.run
	baseURL := fmt.Sprintf("https://static.leger.run/%s/%s/", userUUID, version)

	for _, service := range manifest.Services {
		for _, file := range service.Files {
			fileURL := baseURL + file

			// Fetch file content using HTTP client
			resp, err := client.DownloadFile(ctx, fileURL)
			if err != nil {
				return "", fmt.Errorf("failed to download %s: %w", file, err)
			}
			defer resp.Body.Close()

			// Read file content
			content, err := io.ReadAll(resp.Body)
			if err != nil {
				return "", fmt.Errorf("failed to read %s: %w", file, err)
			}

			// Save file to temp directory
			filePath := filepath.Join(tmpDir, file)
			if err := os.WriteFile(filePath, content, 0644); err != nil {
				return "", fmt.Errorf("failed to save %s: %w", file, err)
			}

			fmt.Printf("  ✓ Downloaded: %s\n", file)
		}
	}

	fmt.Printf("✓ Downloaded %d quadlet files from leger.run\n", len(manifest.Services))

	return tmpDir, nil
}

func cloneGitRepo(ctx context.Context, url, name string) (string, error) {
	// Parse Git URL
	repo, err := git.ParseURL(url, "")
	if err != nil {
		return "", fmt.Errorf("invalid Git URL: %w", err)
	}

	// Clone repository
	path, err := git.Clone(repo)
	if err != nil {
		return "", err
	}

	return path, nil
}

// Stub commands for other deploy subcommands

func deployUpdateCmd() *cobra.Command {
	var dryRun bool
	var noBackup bool
	var force bool

	cmd := &cobra.Command{
		Use:   "update [deployment]",
		Short: "Update deployed services (uses staging)",
		Long: `Update deployment to latest version.

Workflow:
  1. Stages updates (leger stage)
  2. Shows diff (leger diff)
  3. Prompts for confirmation
  4. Applies updates (leger apply)

Flags allow skipping steps for automation.`,
		Args: cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()

			deploymentName := "default"
			if len(args) > 0 {
				deploymentName = args[0]
			}

			m, err := staging.NewManager()
			if err != nil {
				return err
			}

			// 1. Stage updates
			fmt.Println("Staging updates...")
			source := installFlags.source // Use source from install flags
			if err := m.StageUpdate(ctx, source, deploymentName); err != nil {
				return err
			}

			// 2. Show diff
			fmt.Println("\nChanges to be applied:")
			diff, err := m.GenerateDiff(deploymentName)
			if err != nil {
				return err
			}
			diff.Display()

			// 3. If --dry-run, stop here
			if dryRun {
				fmt.Println("\n--dry-run: Updates staged but not applied")
				fmt.Println("Run 'leger apply' to install")
				return nil
			}

			// 4. Confirm unless --force
			if !force {
				if !ui.Confirm("\nApply these updates?") {
					ui.InfoPrintf("Update cancelled\n")
					return nil
				}
			}

			// 5. Apply updates
			fmt.Println()
			if err := m.ApplyStaged(ctx, deploymentName); err != nil {
				return err
			}

			fmt.Println("\n✓ Update complete")
			return nil
		},
	}

	cmd.Flags().BoolVar(&dryRun, "dry-run", false, "Preview changes without applying")
	cmd.Flags().BoolVar(&noBackup, "no-backup", false, "Skip automatic backup (not recommended)")
	cmd.Flags().BoolVar(&force, "force", false, "Skip confirmation prompt")

	return cmd
}

func deployListCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "list",
		Short: "List deployed services",
		RunE: func(cmd *cobra.Command, args []string) error {
			qm := podman.NewQuadletManager("user")
			sm := podman.NewSystemdManager("user")

			// Get list of installed quadlets
			quadlets, err := qm.List()
			if err != nil {
				return err
			}

			if len(quadlets) == 0 {
				ui.InfoPrintf("No quadlets installed\n")
				return nil
			}

			// Prepare table data
			headers := []string{"NAME", "TYPE", "STATUS", "PORTS"}
			rows := make([][]string, 0, len(quadlets))

			// Build rows
			for _, q := range quadlets {
				status := "unknown"
				if q.ServiceName != "" {
					svcStatus, err := sm.GetServiceStatus(q.ServiceName)
					if err == nil {
						status = svcStatus.ActiveState
					}
				}

				// Convert PortInfo to strings
				portStrs := make([]string, len(q.Ports))
				for i, p := range q.Ports {
					portStrs[i] = p.Host + ":" + p.Container
				}
				ports := strings.Join(portStrs, ", ")
				if ports == "" {
					ports = "-"
				}

				rows = append(rows, []string{q.Name, string(q.Type), status, ports})
			}

			// Print table
			ui.PrintTable(headers, rows)

			return nil
		},
	}
}

var removeFlags struct {
	force         bool
	keepVolumes   bool
	removeVolumes bool
	backupVolumes bool
}

func deployRemoveCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "remove <name>",
		Short: "Remove deployed quadlets",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			quadletName := args[0]

			qm := podman.NewQuadletManager("user")
			sm := podman.NewSystemdManager("user")

			// Confirm unless --force
			if !removeFlags.force {
				if !ui.Confirm(fmt.Sprintf("Are you sure you want to remove %s?", quadletName)) {
					ui.InfoPrintf("Aborted\n")
					return nil
				}
			}

			// Stop service
			fmt.Printf("Stopping services for %s...\n", quadletName)
			serviceName := podman.QuadletNameToServiceName(quadletName)
			if err := sm.StopService(serviceName); err != nil {
				fmt.Printf("⚠ Warning: failed to stop service: %v\n", err)
			}

			// Handle volumes if requested
			if removeFlags.removeVolumes {
				fmt.Println("Removing volumes...")
				vm := podman.NewVolumeManager()
				// Note: Volume handling will be more sophisticated in Issue #17
				// For now, we just try to remove volumes with the quadlet name
				if err := vm.Remove(quadletName); err != nil {
					fmt.Printf("⚠ Warning: failed to remove volume: %v\n", err)
				}
			} else if removeFlags.backupVolumes {
				fmt.Println("⚠ Backup volumes not yet implemented (coming in Issue #17)")
			}

			// Remove quadlet
			fmt.Printf("Removing quadlet %s...\n", quadletName)
			if err := qm.Remove(quadletName); err != nil {
				return err
			}

			fmt.Printf("✓ Successfully removed %s\n", quadletName)
			return nil
		},
	}

	cmd.Flags().BoolVar(&removeFlags.force, "force", false, "Skip confirmation prompt")
	cmd.Flags().BoolVar(&removeFlags.keepVolumes, "keep-volumes", true, "Preserve all volumes (default)")
	cmd.Flags().BoolVar(&removeFlags.removeVolumes, "remove-volumes", false, "Remove volumes without backup")
	cmd.Flags().BoolVar(&removeFlags.backupVolumes, "backup-volumes", false, "Create backup before removal")

	return cmd
}
