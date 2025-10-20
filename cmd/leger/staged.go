package main

import (
	"context"
	"fmt"
	"time"

	"github.com/leger-labs/leger/internal/staging"
	"github.com/spf13/cobra"
)

// stagedCmd returns the staged command group
func stagedCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "staged",
		Short: "Manage staged updates",
		Long:  "Manage staged updates that have been downloaded but not yet applied",
	}

	cmd.AddCommand(stagedListCmd())
	cmd.AddCommand(stageCmd())
	cmd.AddCommand(diffCmd())
	cmd.AddCommand(applyCmd())
	cmd.AddCommand(discardCmd())

	return cmd
}

// stagedListCmd returns the staged list command
func stagedListCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "list",
		Short: "List staged updates not yet applied",
		Long: `List all staged updates that have been downloaded but not yet applied.

Shows deployment name, version information, source, and staging timestamp.`,
		RunE: func(cmd *cobra.Command, args []string) error {
			m, err := staging.NewManager()
			if err != nil {
				return err
			}

			hasUpdates, err := m.HasStagedUpdates()
			if err != nil {
				return err
			}

			if !hasUpdates {
				fmt.Println("No staged updates")
				return nil
			}

			deployments, err := m.ListStagedDeployments()
			if err != nil {
				return err
			}

			fmt.Println()
			fmt.Println("Staged Updates:")
			fmt.Println()

			for _, deployment := range deployments {
				meta, err := m.LoadMetadata(deployment)
				if err != nil {
					// If no metadata, just show the deployment name
					fmt.Printf("  %s\n", deployment)
					fmt.Println("    (no metadata available)")
					fmt.Println()
					continue
				}

				fmt.Printf("  Deployment: %s\n", meta.DeploymentName)
				if meta.CurrentVersion != "" {
					fmt.Printf("  Current version: %s\n", meta.CurrentVersion)
				}
				if meta.StagedVersion != "" {
					fmt.Printf("  Staged version: %s\n", meta.StagedVersion)
				}
				fmt.Printf("  Source: %s\n", meta.SourceURL)
				fmt.Printf("  Staged at: %s\n", meta.StagedAt.Format(time.RFC3339))
				fmt.Println()
			}

			fmt.Println("Next steps:")
			fmt.Println("  leger diff <deployment>  - Preview changes")
			fmt.Println("  leger apply <deployment> - Install updates")
			fmt.Println("  leger discard <deployment> - Discard updates")
			fmt.Println()

			return nil
		},
	}
}

// stageCmd returns the stage command
func stageCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "stage [source]",
		Short: "Stage updates for review",
		Long: `Download updates to staging area for preview.

If no source is provided, stages from leger.run default repository.

After staging, use:
  leger diff <deployment>      # Preview changes
  leger apply <deployment>     # Apply staged updates
  leger discard <deployment>   # Discard staged updates`,
		Args: cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := context.Background()

			source := ""
			if len(args) > 0 {
				source = args[0]
			}

			// For now, use "default" as deployment name
			// TODO: Integrate with actual deployment detection
			deploymentName := "default"

			m, err := staging.NewManager()
			if err != nil {
				return err
			}

			fmt.Printf("Staging updates for deployment: %s\n", deploymentName)

			if err := m.StageUpdate(ctx, source, deploymentName); err != nil {
				return err
			}

			fmt.Println()
			fmt.Println("✓ Updates staged successfully")
			fmt.Println()
			fmt.Println("Next steps:")
			fmt.Printf("  leger diff %s     - Preview changes\n", deploymentName)
			fmt.Printf("  leger apply %s    - Apply updates\n", deploymentName)
			fmt.Printf("  leger discard %s  - Discard updates\n", deploymentName)
			fmt.Println()

			return nil
		},
	}
}

// diffCmd returns the diff command
func diffCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "diff [deployment]",
		Short: "Show differences between current and staged",
		Long: `Display changes that will be applied.

Shows:
  - Modified quadlet files (unified diff)
  - Added files
  - Removed files
  - Affected services
  - Port/volume conflicts`,
		Args: cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			deploymentName := "default"
			if len(args) > 0 {
				deploymentName = args[0]
			}

			m, err := staging.NewManager()
			if err != nil {
				return err
			}

			// Check if staged updates exist
			hasUpdates, err := m.HasStagedUpdates()
			if err != nil {
				return err
			}

			if !hasUpdates {
				return fmt.Errorf(`No staged updates found

Stage updates first:
  leger stage [source]

Or update directly:
  leger deploy update`)
			}

			// Generate diff
			diff, err := m.GenerateDiff(deploymentName)
			if err != nil {
				return err
			}

			// Display diff
			diff.Display()

			return nil
		},
	}
}

// applyCmd returns the apply command
func applyCmd() *cobra.Command {
	var noBackup bool
	var force bool

	cmd := &cobra.Command{
		Use:   "apply [deployment]",
		Short: "Apply staged updates",
		Long: `Apply staged updates to production.

Creates automatic backup before applying.
Rolls back automatically if errors occur.`,
		Args: cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := context.Background()

			deploymentName := "default"
			if len(args) > 0 {
				deploymentName = args[0]
			}

			m, err := staging.NewManager()
			if err != nil {
				return err
			}

			// Check staged updates exist
			hasUpdates, err := m.HasStagedUpdates()
			if err != nil {
				return err
			}

			if !hasUpdates {
				return fmt.Errorf(`No staged updates found

Stage updates first:
  leger stage [source]`)
			}

			// Display diff summary
			fmt.Println("Changes to be applied:")
			diff, err := m.GenerateDiff(deploymentName)
			if err != nil {
				return err
			}

			fmt.Printf("  Files modified: %d\n", diff.Summary.FilesModified)
			fmt.Printf("  Files added: %d\n", diff.Summary.FilesAdded)
			fmt.Printf("  Files removed: %d\n", diff.Summary.FilesRemoved)
			fmt.Println()

			// Prompt for confirmation unless --force
			if !force {
				fmt.Print("Apply these updates? [y/N]: ")
				var response string
				_, _ = fmt.Scanln(&response)
				if response != "y" && response != "Y" && response != "yes" {
					fmt.Println("Update cancelled")
					return nil
				}
			}

			// Apply updates
			fmt.Println()
			if err := m.ApplyStaged(ctx, deploymentName); err != nil {
				return err
			}

			fmt.Println()
			fmt.Println("✓ Update complete!")

			return nil
		},
	}

	cmd.Flags().BoolVar(&noBackup, "no-backup", false, "Skip automatic backup (not recommended)")
	cmd.Flags().BoolVar(&force, "force", false, "Skip confirmation prompt")

	return cmd
}

// discardCmd returns the discard command
func discardCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "discard [deployment]",
		Short: "Discard staged updates",
		Long: `Remove staged updates without applying.

Current deployment remains unchanged.`,
		Args: cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			deploymentName := "default"
			if len(args) > 0 {
				deploymentName = args[0]
			}

			m, err := staging.NewManager()
			if err != nil {
				return err
			}

			// Check staged updates exist
			hasUpdates, err := m.HasStagedUpdates()
			if err != nil {
				return err
			}

			if !hasUpdates {
				fmt.Println("No staged updates to discard")
				return nil
			}

			// Prompt for confirmation
			fmt.Printf("Discard staged updates for %s? [y/N]: ", deploymentName)
			var response string
			_, _ = fmt.Scanln(&response)
			if response != "y" && response != "Y" && response != "yes" {
				fmt.Println("Cancelled")
				return nil
			}

			// Discard
			if err := m.DiscardStaged(deploymentName); err != nil {
				return err
			}

			fmt.Println("✓ Staged updates discarded")

			return nil
		},
	}
}
