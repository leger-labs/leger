package staging

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// DiffResult contains the results of comparing staged vs active deployments
type DiffResult struct {
	Modified []FileDiff
	Added    []string
	Removed  []string
	Summary  DiffSummary
}

// FileDiff represents a diff for a single file
type FileDiff struct {
	Path      string
	OldPath   string
	NewPath   string
	DiffLines []string
}

// DiffSummary provides high-level statistics about the diff
type DiffSummary struct {
	FilesModified    int
	FilesAdded       int
	FilesRemoved     int
	ServicesAffected []string
	PortConflicts    []PortConflict
	VolumeConflicts  []VolumeConflict
}

// PortConflict represents a port conflict between quadlets
type PortConflict struct {
	Port   string
	UsedBy []string
}

// VolumeConflict represents a volume conflict between quadlets
type VolumeConflict struct {
	Volume string
	UsedBy []string
}

// GenerateDiff compares active vs staged directories and generates a diff
func (m *Manager) GenerateDiff(deploymentName string) (*DiffResult, error) {
	activePath := m.GetActivePath(deploymentName)
	stagingPath := m.GetStagingPath(deploymentName)

	// Check that staging exists
	if _, err := os.Stat(stagingPath); os.IsNotExist(err) {
		return nil, fmt.Errorf("no staged updates for deployment %q", deploymentName)
	}

	result := &DiffResult{
		Modified: []FileDiff{},
		Added:    []string{},
		Removed:  []string{},
		Summary:  DiffSummary{},
	}

	// Check if active deployment exists
	activeExists := true
	if _, err := os.Stat(activePath); os.IsNotExist(err) {
		activeExists = false
	}

	if !activeExists {
		// All files are new
		files, err := listFiles(stagingPath)
		if err != nil {
			return nil, err
		}
		result.Added = files
		result.Summary.FilesAdded = len(files)
		return result, nil
	}

	// Get file lists
	activeFiles, err := listFiles(activePath)
	if err != nil {
		return nil, fmt.Errorf("failed to list active files: %w", err)
	}

	stagedFiles, err := listFiles(stagingPath)
	if err != nil {
		return nil, fmt.Errorf("failed to list staged files: %w", err)
	}

	// Create maps for easy lookup
	activeMap := make(map[string]bool)
	for _, f := range activeFiles {
		activeMap[f] = true
	}

	stagedMap := make(map[string]bool)
	for _, f := range stagedFiles {
		stagedMap[f] = true
	}

	// Find added files (in staged but not in active)
	for _, f := range stagedFiles {
		if !activeMap[f] {
			result.Added = append(result.Added, f)
		}
	}

	// Find removed files (in active but not in staged)
	for _, f := range activeFiles {
		if !stagedMap[f] {
			result.Removed = append(result.Removed, f)
		}
	}

	// Find modified files (in both, compare content)
	for _, f := range activeFiles {
		if stagedMap[f] {
			activeFull := filepath.Join(activePath, f)
			stagedFull := filepath.Join(stagingPath, f)

			diff, err := generateFileDiff(activeFull, stagedFull, f)
			if err != nil {
				return nil, fmt.Errorf("failed to diff %s: %w", f, err)
			}

			if diff != nil {
				result.Modified = append(result.Modified, *diff)
			}
		}
	}

	// Build summary
	result.Summary.FilesModified = len(result.Modified)
	result.Summary.FilesAdded = len(result.Added)
	result.Summary.FilesRemoved = len(result.Removed)
	result.Summary.ServicesAffected = extractServiceNames(result)

	return result, nil
}

// generateFileDiff generates a unified diff for a single file
func generateFileDiff(oldPath, newPath, relativePath string) (*FileDiff, error) {
	// First check if files are identical
	oldContent, err := os.ReadFile(oldPath)
	if err != nil {
		return nil, err
	}

	newContent, err := os.ReadFile(newPath)
	if err != nil {
		return nil, err
	}

	if bytes.Equal(oldContent, newContent) {
		return nil, nil // No diff
	}

	// Use diff command to generate unified diff
	cmd := exec.Command("diff", "-u", oldPath, newPath)
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	// diff returns exit code 1 when files differ (not an error)
	err = cmd.Run()
	if err != nil && cmd.ProcessState.ExitCode() > 1 {
		return nil, fmt.Errorf("diff command failed: %w\nStderr: %s", err, stderr.String())
	}

	lines := strings.Split(stdout.String(), "\n")

	return &FileDiff{
		Path:      relativePath,
		OldPath:   oldPath,
		NewPath:   newPath,
		DiffLines: lines,
	}, nil
}

// listFiles returns a list of all files in a directory (relative paths)
func listFiles(dir string) ([]string, error) {
	var files []string

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() {
			return nil
		}

		// Skip metadata file
		if filepath.Base(path) == ".staging-metadata.json" {
			return nil
		}

		relPath, err := filepath.Rel(dir, path)
		if err != nil {
			return err
		}

		files = append(files, relPath)
		return nil
	})

	if err != nil {
		return nil, err
	}

	return files, nil
}

// extractServiceNames extracts service names from modified/added quadlet files
func extractServiceNames(result *DiffResult) []string {
	serviceMap := make(map[string]bool)

	// Extract from modified files
	for _, mod := range result.Modified {
		if strings.HasSuffix(mod.Path, ".container") {
			serviceName := strings.TrimSuffix(filepath.Base(mod.Path), ".container")
			serviceMap[serviceName] = true
		}
	}

	// Extract from added files
	for _, add := range result.Added {
		if strings.HasSuffix(add, ".container") {
			serviceName := strings.TrimSuffix(filepath.Base(add), ".container")
			serviceMap[serviceName] = true
		}
	}

	var services []string
	for service := range serviceMap {
		services = append(services, service)
	}

	return services
}

// Display formats and prints the diff result to stdout
func (d *DiffResult) Display() {
	fmt.Println()
	fmt.Printf("Files modified: %d\n", d.Summary.FilesModified)
	fmt.Printf("Files added: %d\n", d.Summary.FilesAdded)
	fmt.Printf("Files removed: %d\n", d.Summary.FilesRemoved)
	fmt.Println()

	// Show removed files
	if len(d.Removed) > 0 {
		fmt.Println("=== Removed Files ===")
		for _, file := range d.Removed {
			fmt.Printf("  - %s\n", file)
		}
		fmt.Println()
	}

	// Show added files
	if len(d.Added) > 0 {
		fmt.Println("=== Added Files ===")
		for _, file := range d.Added {
			fmt.Printf("  + %s\n", file)
		}
		fmt.Println()
	}

	// Show modified files with diffs
	if len(d.Modified) > 0 {
		fmt.Println("=== Modified Files ===")
		for _, mod := range d.Modified {
			fmt.Printf("\n--- %s\n", mod.Path)
			fmt.Printf("+++ %s\n", mod.Path)
			for _, line := range mod.DiffLines {
				// Skip the first two lines (file paths from diff output)
				if strings.HasPrefix(line, "---") || strings.HasPrefix(line, "+++") {
					continue
				}
				fmt.Println(line)
			}
		}
		fmt.Println()
	}

	// Show summary
	if len(d.Summary.ServicesAffected) > 0 {
		fmt.Println("=== Summary ===")
		fmt.Printf("Services affected: %s\n", strings.Join(d.Summary.ServicesAffected, ", "))
	}

	if len(d.Summary.PortConflicts) > 0 {
		fmt.Println("\n⚠️  Port conflicts detected:")
		for _, conflict := range d.Summary.PortConflicts {
			fmt.Printf("  Port %s used by: %s\n", conflict.Port, strings.Join(conflict.UsedBy, ", "))
		}
	}

	if len(d.Summary.VolumeConflicts) > 0 {
		fmt.Println("\n⚠️  Volume conflicts detected:")
		for _, conflict := range d.Summary.VolumeConflicts {
			fmt.Printf("  Volume %s used by: %s\n", conflict.Volume, strings.Join(conflict.UsedBy, ", "))
		}
	}
}
