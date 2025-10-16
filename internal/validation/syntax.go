package validation

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// ValidateQuadletSyntax validates the basic syntax of a quadlet file
func ValidateQuadletSyntax(path string) error {
	// Check file exists and is readable
	content, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("cannot read file: %w", err)
	}

	text := string(content)
	ext := filepath.Ext(path)

	// Validate based on file type
	switch ext {
	case ".container":
		return validateContainerQuadlet(text, path)
	case ".volume":
		return validateVolumeQuadlet(text, path)
	case ".network":
		return validateNetworkQuadlet(text, path)
	case ".pod":
		return validatePodQuadlet(text, path)
	case ".kube":
		return validateKubeQuadlet(text, path)
	case ".image":
		return validateImageQuadlet(text, path)
	default:
		return fmt.Errorf("unsupported quadlet file type: %s", ext)
	}
}

// validateContainerQuadlet validates a .container quadlet
func validateContainerQuadlet(text, path string) error {
	// Check for required [Container] section
	if !strings.Contains(text, "[Container]") {
		return fmt.Errorf("%s: missing required [Container] section", path)
	}

	// Check for Image= directive (required for containers)
	if !strings.Contains(text, "Image=") {
		return fmt.Errorf("%s: missing required Image= directive in [Container] section", path)
	}

	// Optional but common: check for [Unit] section
	if !strings.Contains(text, "[Unit]") {
		// Warning, not error
		fmt.Printf("Warning: %s: missing [Unit] section (recommended)\n", path)
	}

	return nil
}

// validateVolumeQuadlet validates a .volume quadlet
func validateVolumeQuadlet(text, path string) error {
	// Check for required [Volume] section
	if !strings.Contains(text, "[Volume]") {
		return fmt.Errorf("%s: missing required [Volume] section", path)
	}

	return nil
}

// validateNetworkQuadlet validates a .network quadlet
func validateNetworkQuadlet(text, path string) error {
	// Check for required [Network] section
	if !strings.Contains(text, "[Network]") {
		return fmt.Errorf("%s: missing required [Network] section", path)
	}

	return nil
}

// validatePodQuadlet validates a .pod quadlet
func validatePodQuadlet(text, path string) error {
	// Check for required [Pod] section
	if !strings.Contains(text, "[Pod]") {
		return fmt.Errorf("%s: missing required [Pod] section", path)
	}

	return nil
}

// validateKubeQuadlet validates a .kube quadlet
func validateKubeQuadlet(text, path string) error {
	// Check for required [Kube] section
	if !strings.Contains(text, "[Kube]") {
		return fmt.Errorf("%s: missing required [Kube] section", path)
	}

	// Check for Yaml= or ConfigMap= directive
	if !strings.Contains(text, "Yaml=") && !strings.Contains(text, "ConfigMap=") {
		return fmt.Errorf("%s: missing required Yaml= or ConfigMap= directive in [Kube] section", path)
	}

	return nil
}

// validateImageQuadlet validates a .image quadlet
func validateImageQuadlet(text, path string) error {
	// Check for required [Image] section
	if !strings.Contains(text, "[Image]") {
		return fmt.Errorf("%s: missing required [Image] section", path)
	}

	// Check for Image= directive
	if !strings.Contains(text, "Image=") {
		return fmt.Errorf("%s: missing required Image= directive in [Image] section", path)
	}

	return nil
}

// ValidateQuadletDirectory validates all quadlet files in a directory
func ValidateQuadletDirectory(dir string) error {
	var errors []string

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() {
			return nil
		}

		// Check if it's a quadlet file
		ext := filepath.Ext(path)
		validExtensions := []string{".container", ".volume", ".network", ".pod", ".kube", ".image"}
		isQuadlet := false
		for _, validExt := range validExtensions {
			if ext == validExt {
				isQuadlet = true
				break
			}
		}

		if !isQuadlet {
			return nil
		}

		// Validate the file
		if err := ValidateQuadletSyntax(path); err != nil {
			errors = append(errors, err.Error())
		}

		return nil
	})

	if err != nil {
		return fmt.Errorf("failed to walk directory: %w", err)
	}

	if len(errors) > 0 {
		return fmt.Errorf("validation errors:\n  - %s", strings.Join(errors, "\n  - "))
	}

	return nil
}
