package git

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

// Clone clones a Git repository and returns the path to the quadlet files
// If repo.SubPath is set, extracts only that subdirectory
func Clone(repo *Repository) (string, error) {
	if repo.IsLegerRun() {
		return "", fmt.Errorf("leger.run URLs should be handled by legerrun package, not git clone")
	}

	// Create temp directory for cloning
	tmpDir, err := os.MkdirTemp("", "leger-git-*")
	if err != nil {
		return "", fmt.Errorf("failed to create temp directory: %w", err)
	}

	// Clone repository (shallow clone for speed)
	cloneURL := repo.GetCloneURL()

	args := []string{"clone", "--depth", "1"}

	// Add branch if specified
	if repo.Branch != "" {
		args = append(args, "--branch", repo.Branch)
	}

	args = append(args, cloneURL, tmpDir)

	cmd := exec.Command("git", args...)
	output, err := cmd.CombinedOutput()
	if err != nil {
		// Clean up temp directory on failure
		os.RemoveAll(tmpDir)
		return "", fmt.Errorf(`failed to clone repository: %w

Repository: %s
Branch: %s

Output: %s

Verify the repository URL is correct and accessible.
If this is a private repository, ensure your SSH keys are configured:
  git clone %s`, err, cloneURL, repo.Branch, string(output), cloneURL)
	}

	// If there's a subpath, return path to that subdirectory
	if repo.SubPath != "" {
		subDir := filepath.Join(tmpDir, repo.SubPath)

		// Verify subdirectory exists
		if _, err := os.Stat(subDir); err != nil {
			os.RemoveAll(tmpDir)
			return "", fmt.Errorf(`subdirectory not found in repository: %s

Repository: %s
Branch: %s
Subpath: %s

Verify the path exists in the repository.`, repo.SubPath, cloneURL, repo.Branch, repo.SubPath)
		}

		return subDir, nil
	}

	return tmpDir, nil
}

// CleanupClone removes a cloned repository directory
func CleanupClone(path string) error {
	return os.RemoveAll(path)
}
