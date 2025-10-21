package podman

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/leger-labs/leger/pkg/types"
)

// QuadletManager handles Podman quadlet operations
type QuadletManager struct {
	scope string // "user" or "system"
}

// NewQuadletManager creates a new QuadletManager
func NewQuadletManager(scope string) *QuadletManager {
	if scope == "" {
		scope = "user" // default to user scope
	}
	return &QuadletManager{scope: scope}
}

// Install installs quadlet files by copying them to the systemd directory
func (qm *QuadletManager) Install(quadletPath string) error {
	// Verify path exists
	fileInfo, err := os.Stat(quadletPath)
	if err != nil {
		return fmt.Errorf("quadlet path does not exist: %s", quadletPath)
	}

	// Determine destination path based on scope
	var destPath string
	if qm.scope == "user" {
		homeDir, err := os.UserHomeDir()
		if err != nil {
			return fmt.Errorf("failed to get user home directory: %w", err)
		}
		destPath = filepath.Join(homeDir, ".config", "containers", "systemd")
	} else {
		destPath = "/etc/containers/systemd"
	}

	// Ensure destination directory exists
	if err := os.MkdirAll(destPath, 0755); err != nil {
		return fmt.Errorf("failed to create destination directory %s: %w", destPath, err)
	}

	// Copy quadlet files
	if fileInfo.IsDir() {
		// Copy all quadlet files from directory
		err = filepath.Walk(quadletPath, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}

			// Skip directories
			if info.IsDir() {
				return nil
			}

			// Only copy files with quadlet extensions
			if !hasQuadletExtension(path) {
				return nil
			}

			// Determine destination file path
			relPath, err := filepath.Rel(quadletPath, path)
			if err != nil {
				return fmt.Errorf("failed to determine relative path: %w", err)
			}
			destFile := filepath.Join(destPath, relPath)

			// Ensure parent directory exists
			destDir := filepath.Dir(destFile)
			if err := os.MkdirAll(destDir, 0755); err != nil {
				return fmt.Errorf("failed to create directory %s: %w", destDir, err)
			}

			// Copy file
			if err := copyFile(path, destFile); err != nil {
				return fmt.Errorf("failed to copy %s to %s: %w", path, destFile, err)
			}

			return nil
		})

		if err != nil {
			return fmt.Errorf("failed to install quadlet files: %w", err)
		}
	} else {
		// Copy single file
		destFile := filepath.Join(destPath, filepath.Base(quadletPath))
		if err := copyFile(quadletPath, destFile); err != nil {
			return fmt.Errorf("failed to copy %s to %s: %w", quadletPath, destFile, err)
		}
	}

	return nil
}

// copyFile copies a file from src to dst
func copyFile(src, dst string) error {
	sourceFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer sourceFile.Close()

	destFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer destFile.Close()

	if _, err := destFile.ReadFrom(sourceFile); err != nil {
		return err
	}

	// Copy permissions
	sourceInfo, err := os.Stat(src)
	if err != nil {
		return err
	}

	return os.Chmod(dst, sourceInfo.Mode())
}

// List lists installed quadlets by reading the systemd directory
func (qm *QuadletManager) List() ([]types.QuadletInfo, error) {
	// Determine systemd path based on scope
	var quadletDir string
	if qm.scope == "user" {
		homeDir, err := os.UserHomeDir()
		if err != nil {
			return nil, fmt.Errorf("failed to get user home directory: %w", err)
		}
		quadletDir = filepath.Join(homeDir, ".config", "containers", "systemd")
	} else {
		quadletDir = "/etc/containers/systemd"
	}

	// Check if directory exists
	if _, err := os.Stat(quadletDir); os.IsNotExist(err) {
		return []types.QuadletInfo{}, nil // Return empty list if directory doesn't exist
	}

	var quadlets []types.QuadletInfo

	// Walk the directory to find quadlet files
	err := filepath.Walk(quadletDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Skip directories
		if info.IsDir() {
			return nil
		}

		// Only include files with quadlet extensions
		if !hasQuadletExtension(path) {
			return nil
		}

		// Create QuadletInfo
		relPath, err := filepath.Rel(quadletDir, path)
		if err != nil {
			relPath = filepath.Base(path)
		}

		quadlets = append(quadlets, types.QuadletInfo{
			Name: relPath,
			Path: path,
			Type: GetQuadletType(path),
		})

		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to list quadlets: %w", err)
	}

	return quadlets, nil
}

// Remove removes a quadlet by deleting it from the systemd directory
func (qm *QuadletManager) Remove(name string) error {
	// Ensure proper extension if not provided
	if !hasQuadletExtension(name) {
		name += ".container"
	}

	// Determine systemd path based on scope
	var quadletDir string
	if qm.scope == "user" {
		homeDir, err := os.UserHomeDir()
		if err != nil {
			return fmt.Errorf("failed to get user home directory: %w", err)
		}
		quadletDir = filepath.Join(homeDir, ".config", "containers", "systemd")
	} else {
		quadletDir = "/etc/containers/systemd"
	}

	// Construct full path
	quadletPath := filepath.Join(quadletDir, name)

	// Check if file exists
	if _, err := os.Stat(quadletPath); os.IsNotExist(err) {
		return fmt.Errorf("quadlet %s does not exist", name)
	}

	// Remove the file
	if err := os.Remove(quadletPath); err != nil {
		return fmt.Errorf("failed to remove quadlet %s: %w", name, err)
	}

	return nil
}

// Print prints a quadlet definition by reading the file
func (qm *QuadletManager) Print(name string) (string, error) {
	// Ensure proper extension if not provided
	if !hasQuadletExtension(name) {
		name += ".container"
	}

	// Determine systemd path based on scope
	var quadletDir string
	if qm.scope == "user" {
		homeDir, err := os.UserHomeDir()
		if err != nil {
			return "", fmt.Errorf("failed to get user home directory: %w", err)
		}
		quadletDir = filepath.Join(homeDir, ".config", "containers", "systemd")
	} else {
		quadletDir = "/etc/containers/systemd"
	}

	// Construct full path
	quadletPath := filepath.Join(quadletDir, name)

	// Read file contents
	content, err := os.ReadFile(quadletPath)
	if err != nil {
		return "", fmt.Errorf("failed to read quadlet %s: %w", name, err)
	}

	return string(content), nil
}

// DiscoverQuadletFiles discovers all quadlet files in a directory
func (qm *QuadletManager) DiscoverQuadletFiles(dir string) ([]string, error) {
	var quadletFiles []string

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() {
			return nil
		}

		// Check if file has quadlet extension
		if hasQuadletExtension(path) {
			quadletFiles = append(quadletFiles, path)
		}

		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to discover quadlet files: %w", err)
	}

	if len(quadletFiles) == 0 {
		return nil, fmt.Errorf("no quadlet files found in %s", dir)
	}

	return quadletFiles, nil
}

// hasQuadletExtension checks if a file has a valid quadlet extension
func hasQuadletExtension(path string) bool {
	ext := filepath.Ext(path)
	validExtensions := []string{".container", ".volume", ".network", ".pod", ".kube", ".image"}

	for _, valid := range validExtensions {
		if ext == valid {
			return true
		}
	}

	return false
}

// GetQuadletType returns the type of quadlet based on file extension
func GetQuadletType(path string) types.QuadletType {
	ext := strings.TrimPrefix(filepath.Ext(path), ".")
	return types.QuadletType(ext)
}
