package validation

import (
	"fmt"
	"os"

	"github.com/tailscale/setec/pkg/types"
)

// Validator validates quadlet deployments
type Validator struct {
	QuadletDir string
}

// ValidationResult contains the results of validation
type ValidationResult struct {
	Valid                bool
	SyntaxErrors         []string
	PortConflicts        []types.PortConflict
	VolumeConflicts      []types.VolumeConflict
	CircularDependencies []types.CircularDependency
	MissingDependencies  []types.MissingDependency
	Dependencies         []Dependency
}

// NewValidator creates a new Validator
func NewValidator(quadletDir string) *Validator {
	return &Validator{
		QuadletDir: quadletDir,
	}
}

// ValidateAll performs comprehensive validation
func (v *Validator) ValidateAll() (*ValidationResult, error) {
	result := &ValidationResult{
		Valid: true,
	}

	// Check if directory exists
	if _, err := os.Stat(v.QuadletDir); os.IsNotExist(err) {
		return nil, fmt.Errorf("quadlet directory does not exist: %s", v.QuadletDir)
	}

	// 1. Syntax validation
	if err := ValidateQuadletDirectory(v.QuadletDir); err != nil {
		result.Valid = false
		result.SyntaxErrors = []string{err.Error()}
	}

	// 2. Port conflict detection
	portConflicts, err := CheckPortConflicts(v.QuadletDir)
	if err != nil {
		return nil, fmt.Errorf("failed to check port conflicts: %w", err)
	}
	if len(portConflicts) > 0 {
		result.Valid = false
		result.PortConflicts = portConflicts
	}

	// 3. Volume conflict detection
	volumeConflicts, err := CheckVolumeConflicts(v.QuadletDir)
	if err != nil {
		return nil, fmt.Errorf("failed to check volume conflicts: %w", err)
	}
	if len(volumeConflicts) > 0 {
		result.Valid = false
		result.VolumeConflicts = volumeConflicts
	}

	// 4. Dependency analysis
	dependencies, err := AnalyzeDependencies(v.QuadletDir)
	if err != nil {
		return nil, fmt.Errorf("failed to analyze dependencies: %w", err)
	}
	result.Dependencies = dependencies

	// 5. Circular dependency detection
	circularDeps := DetectCircularDependencies(dependencies)
	if len(circularDeps) > 0 {
		result.Valid = false
		result.CircularDependencies = circularDeps
	}

	// 6. Missing dependency validation
	missingDeps := ValidateDependencies(dependencies)
	if len(missingDeps) > 0 {
		result.Valid = false
		result.MissingDependencies = missingDeps
	}

	return result, nil
}

// QuickConflictCheck performs a quick check for conflicts (no dependency analysis)
func (v *Validator) QuickConflictCheck() (*ValidationResult, error) {
	result := &ValidationResult{
		Valid: true,
	}

	// Check if directory exists
	if _, err := os.Stat(v.QuadletDir); os.IsNotExist(err) {
		return nil, fmt.Errorf("quadlet directory does not exist: %s", v.QuadletDir)
	}

	// Port conflict detection
	portConflicts, err := CheckPortConflicts(v.QuadletDir)
	if err != nil {
		return nil, fmt.Errorf("failed to check port conflicts: %w", err)
	}
	if len(portConflicts) > 0 {
		result.Valid = false
		result.PortConflicts = portConflicts
	}

	// Volume conflict detection
	volumeConflicts, err := CheckVolumeConflicts(v.QuadletDir)
	if err != nil {
		return nil, fmt.Errorf("failed to check volume conflicts: %w", err)
	}
	if len(volumeConflicts) > 0 {
		result.Valid = false
		result.VolumeConflicts = volumeConflicts
	}

	return result, nil
}

// FormatResult formats the validation result for display
func FormatResult(result *ValidationResult) string {
	if result.Valid {
		return "✓ Validation passed - no issues found"
	}

	output := "❌ Validation failed:\n\n"

	// Syntax errors
	if len(result.SyntaxErrors) > 0 {
		output += "Syntax Errors:\n"
		for _, err := range result.SyntaxErrors {
			output += fmt.Sprintf("  • %s\n", err)
		}
		output += "\n"
	}

	// Port conflicts
	if len(result.PortConflicts) > 0 {
		output += "Port Conflicts:\n"
		for _, conflict := range result.PortConflicts {
			output += fmt.Sprintf("  • Port %s/%s used by: %v\n",
				conflict.Port, conflict.Protocol, conflict.Quadlets)
		}
		output += "\n"
	}

	// Volume conflicts
	if len(result.VolumeConflicts) > 0 {
		output += "Volume Conflicts:\n"
		for _, conflict := range result.VolumeConflicts {
			output += fmt.Sprintf("  • Volume %s used by: %v\n",
				conflict.Path, conflict.Quadlets)
		}
		output += "\n"
	}

	// Circular dependencies
	if len(result.CircularDependencies) > 0 {
		output += "Circular Dependencies:\n"
		for _, circular := range result.CircularDependencies {
			output += fmt.Sprintf("  • Cycle: %v\n", circular.Services)
		}
		output += "\n"
	}

	// Missing dependencies
	if len(result.MissingDependencies) > 0 {
		output += "Missing Dependencies:\n"
		for _, missing := range result.MissingDependencies {
			output += fmt.Sprintf("  • Service %q requires %q (not found)\n",
				missing.Service, missing.MissingDependency)
		}
		output += "\n"
	}

	return output
}
