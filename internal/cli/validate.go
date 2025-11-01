package cli

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/leger-labs/leger/internal/validation"
	"github.com/spf13/cobra"
)

// validateCmd returns the validate command
func validateCmd() *cobra.Command {
	var quadletDir string

	cmd := &cobra.Command{
		Use:   "validate [directory]",
		Short: "Validate quadlet deployments",
		Long: `Perform comprehensive validation of quadlet files including:
- Syntax validation
- Port conflict detection
- Volume conflict detection
- Dependency analysis
- Circular dependency detection
- Missing dependency validation`,
		Args: cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			// Determine quadlet directory
			if len(args) > 0 {
				quadletDir = args[0]
			} else if quadletDir == "" {
				// Default to user's systemd directory
				homeDir, err := os.UserHomeDir()
				if err != nil {
					return fmt.Errorf("failed to get home directory: %w", err)
				}
				quadletDir = filepath.Join(homeDir, ".config", "containers", "systemd")
			}

			fmt.Printf("Validating quadlets in %s...\n", quadletDir)
			fmt.Println()

			// Create validator
			validator := validation.NewValidator(quadletDir)

			// Run validation
			result, err := validator.ValidateAll()
			if err != nil {
				return fmt.Errorf("validation failed: %w", err)
			}

			// Display results
			fmt.Println(validation.FormatResult(result))

			// Show dependency graph if no errors
			if result.Valid && len(result.Dependencies) > 0 {
				fmt.Println("Dependency Graph:")
				for _, dep := range result.Dependencies {
					if len(dep.DependsOn) > 0 || len(dep.RequiredBy) > 0 {
						fmt.Printf("  %s:\n", dep.Service)
						if len(dep.DependsOn) > 0 {
							fmt.Printf("    Depends on: %v\n", dep.DependsOn)
						}
						if len(dep.RequiredBy) > 0 {
							fmt.Printf("    Required by: %v\n", dep.RequiredBy)
						}
					}
				}
			}

			if !result.Valid {
				return fmt.Errorf("validation found issues")
			}

			return nil
		},
	}

	cmd.Flags().StringVarP(&quadletDir, "dir", "d", "", "Quadlet directory to validate")

	return cmd
}

// checkConflictsCmd returns the check-conflicts command
func checkConflictsCmd() *cobra.Command {
	var quadletDir string

	cmd := &cobra.Command{
		Use:   "check-conflicts [directory]",
		Short: "Quick check for port and volume conflicts",
		Long: `Perform a quick check for conflicts without full validation.
Useful before staging or applying updates.`,
		Args: cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			// Determine quadlet directory
			if len(args) > 0 {
				quadletDir = args[0]
			} else if quadletDir == "" {
				// Default to user's systemd directory
				homeDir, err := os.UserHomeDir()
				if err != nil {
					return fmt.Errorf("failed to get home directory: %w", err)
				}
				quadletDir = filepath.Join(homeDir, ".config", "containers", "systemd")
			}

			fmt.Printf("Checking for conflicts in %s...\n", quadletDir)
			fmt.Println()

			// Create validator
			validator := validation.NewValidator(quadletDir)

			// Run quick conflict check
			result, err := validator.QuickConflictCheck()
			if err != nil {
				return fmt.Errorf("conflict check failed: %w", err)
			}

			// Display results
			if result.Valid {
				fmt.Println("✓ No conflicts found")
				return nil
			}

			// Show conflicts
			if len(result.PortConflicts) > 0 {
				fmt.Println("Port Conflicts:")
				for _, conflict := range result.PortConflicts {
					fmt.Printf("  ✗ Port %s/%s: %v\n",
						conflict.Port, conflict.Protocol, conflict.Quadlets)
				}
				fmt.Println()
			}

			if len(result.VolumeConflicts) > 0 {
				fmt.Println("Volume Conflicts:")
				for _, conflict := range result.VolumeConflicts {
					fmt.Printf("  ✗ Volume %s: %v\n",
						conflict.Path, conflict.Quadlets)
				}
				fmt.Println()
			}

			return fmt.Errorf("conflicts detected")
		},
	}

	cmd.Flags().StringVarP(&quadletDir, "dir", "d", "", "Quadlet directory to check")

	return cmd
}
