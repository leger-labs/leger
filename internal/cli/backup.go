package cli

import (
	"fmt"
	"os"
	"strings"
	"text/tabwriter"
	"time"

	"github.com/leger-labs/leger/internal/backup"
	"github.com/spf13/cobra"
)

// backupCmd returns the backup command group
func backupCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "backup",
		Short: "Manage backups",
		Long: `Backup and restore deployment configurations and volumes.

Backups include:
  - All quadlet files
  - Volume data (exported and compressed)
  - Metadata (services, versions, etc.)

Examples:
  leger backup create nginx
  leger backup list
  leger backup info nginx-2025-10-16-120000
  leger backup restore nginx-2025-10-16-120000`,
	}

	cmd.AddCommand(backupCreateCmd())
	cmd.AddCommand(backupListCmd())
	cmd.AddCommand(backupInfoCmd())
	cmd.AddCommand(backupRestoreCmd())

	return cmd
}

// backupCreateCmd returns the backup create command
func backupCreateCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "create [NAME]",
		Short: "Create a backup",
		Long: `Create a timestamped backup of deployment.

Includes:
  - All quadlet files
  - Volume data (exported and compressed)
  - Metadata (services, versions, etc.)

Flags:
  --reason string   Reason for backup (default: "manual")

Examples:
  leger backup create nginx
  leger backup create nginx --reason "before-update"`,
		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			deploymentName := args[0]
			reason, _ := cmd.Flags().GetString("reason")

			// Create backup manager
			backupMgr, err := backup.NewManager()
			if err != nil {
				return fmt.Errorf(`failed to initialize backup manager: %w

Check directory permissions:
  ls -la ~/.local/share/bluebuild-quadlets/`, err)
			}

			fmt.Printf("Creating backup of %s...\n", deploymentName)

			// Create backup
			backupID, err := backupMgr.CreateBackup(deploymentName, reason)
			if err != nil {
				return err
			}

			// Load metadata to display
			backupInfo, err := backupMgr.Get(backupID)
			if err != nil {
				// Backup was created but we can't read metadata - still report success
				fmt.Printf("✓ Backup created: %s\n", backupID)
				return nil
			}

			fmt.Printf("✓ Backup created: %s\n", backupID)
			fmt.Printf("  Size: %s\n", formatSize(backupInfo.Size))
			fmt.Printf("  Files: %d\n", len(backupInfo.QuadletFiles))
			fmt.Printf("  Volumes: %d\n", len(backupInfo.Volumes))

			return nil
		},
	}

	cmd.Flags().String("reason", "manual", "Reason for backup")

	return cmd
}

// backupListCmd returns the backup list command
func backupListCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "list",
		Short: "List all backups",
		Long:  `List all available backups with their metadata.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			// Create backup manager
			backupMgr, err := backup.NewManager()
			if err != nil {
				return fmt.Errorf("failed to initialize backup manager: %w", err)
			}

			// List backups
			backups, err := backupMgr.List()
			if err != nil {
				return fmt.Errorf("failed to list backups: %w", err)
			}

			if len(backups) == 0 {
				fmt.Println("No backups found")
				fmt.Println("\nCreate a backup:")
				fmt.Println("  leger backup create <deployment-name>")
				return nil
			}

			// Display as table
			w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)
			fmt.Fprintln(w, "ID\tCREATED\tTYPE\tSIZE\tREASON")
			fmt.Fprintln(w, strings.Repeat("-", 80))

			for _, b := range backups {
				createdStr := b.CreatedAt.Format("2006-01-02 15:04")
				typeStr := string(b.Type)
				sizeStr := formatSize(b.Size)

				fmt.Fprintf(w, "%s\t%s\t%s\t%s\t%s\n",
					b.ID, createdStr, typeStr, sizeStr, b.Reason)
			}

			w.Flush()

			return nil
		},
	}
}

// backupInfoCmd returns the backup info command
func backupInfoCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "info <backup-id>",
		Short: "Show backup details",
		Long:  `Display detailed information about a specific backup.`,
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			backupID := args[0]

			// Create backup manager
			backupMgr, err := backup.NewManager()
			if err != nil {
				return fmt.Errorf("failed to initialize backup manager: %w", err)
			}

			// Get backup
			b, err := backupMgr.Get(backupID)
			if err != nil {
				return err
			}

			// Display detailed info
			fmt.Printf("Backup ID: %s\n", b.ID)
			fmt.Printf("Deployment: %s\n", b.DeploymentName)
			fmt.Printf("Created: %s\n", b.CreatedAt.Format(time.RFC3339))
			fmt.Printf("Type: %s\n", b.Type)
			fmt.Printf("Reason: %s\n", b.Reason)
			fmt.Printf("Total Size: %s\n\n", formatSize(b.Size))

			fmt.Printf("Quadlet Files (%d):\n", len(b.QuadletFiles))
			for _, file := range b.QuadletFiles {
				fmt.Printf("  - %s\n", file)
			}

			if len(b.Volumes) > 0 {
				fmt.Printf("\nVolumes (%d):\n", len(b.Volumes))
				for _, vol := range b.Volumes {
					fmt.Printf("  - %s (%s)\n", vol.Name, formatSize(vol.Size))
				}
			}

			return nil
		},
	}
}

// backupRestoreCmd returns the backup restore command
func backupRestoreCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "restore <backup-id>",
		Short: "Restore from backup",
		Long: `Restore deployment from backup.

Creates temporary backup of current state before restoring.
Automatically rolls back if restore fails.

Warning: This stops all services and replaces current deployment.

Flags:
  --force         Skip confirmation prompt

Examples:
  leger backup restore nginx-2025-10-16-120000
  leger backup restore nginx-2025-10-16-120000 --force`,
		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			backupID := args[0]

			// Create backup manager
			backupMgr, err := backup.NewManager()
			if err != nil {
				return fmt.Errorf("failed to initialize backup manager: %w", err)
			}

			// Display backup info
			b, err := backupMgr.Get(backupID)
			if err != nil {
				return err
			}

			fmt.Printf("Restoring backup: %s\n", backupID)
			fmt.Printf("  Created: %s\n", b.CreatedAt.Format(time.RFC3339))
			fmt.Printf("  Deployment: %s\n", b.DeploymentName)
			fmt.Printf("  Volumes: %d\n", len(b.Volumes))
			fmt.Println()

			// Confirm (unless --force)
			force, _ := cmd.Flags().GetBool("force")
			if !force {
				if !confirmRestore() {
					fmt.Println("Restore cancelled")
					return nil
				}
			}

			// Perform restore
			fmt.Println("Creating safety backup...")
			fmt.Println("Stopping services...")
			fmt.Println("Restoring quadlet files...")
			fmt.Println("Restoring volumes...")
			fmt.Println("Installing quadlets...")
			fmt.Println("Starting services...")

			if err := backupMgr.Restore(backupID); err != nil {
				return err
			}

			fmt.Printf("\n✓ Restored successfully from %s\n", backupID)

			return nil
		},
	}

	cmd.Flags().Bool("force", false, "Skip confirmation prompt")

	return cmd
}

// confirmRestore prompts user for confirmation
func confirmRestore() bool {
	fmt.Print("This will stop all services and replace the current deployment. Continue? (y/N): ")

	var response string
	_, _ = fmt.Scanln(&response)

	response = strings.ToLower(strings.TrimSpace(response))
	return response == "y" || response == "yes"
}

// formatSize formats byte size to human-readable format
func formatSize(bytes int64) string {
	const unit = 1024
	if bytes < unit {
		return fmt.Sprintf("%d B", bytes)
	}

	div, exp := int64(unit), 0
	for n := bytes / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}

	return fmt.Sprintf("%.1f %cB", float64(bytes)/float64(div), "KMGTPE"[exp])
}
