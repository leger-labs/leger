package git

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/leger-labs/leger/pkg/types"
)

// DiscoverManifest discovers and loads a manifest from a quadlet directory
// Priority: manifest.json > .leger.yaml > auto-generate
func DiscoverManifest(quadletDir string) (*types.Manifest, error) {
	// Check if directory exists
	if _, err := os.Stat(quadletDir); os.IsNotExist(err) {
		return nil, fmt.Errorf("directory does not exist: %s", quadletDir)
	}

	// Try manifest.json (leger.run format)
	manifestJSON := filepath.Join(quadletDir, "manifest.json")
	if _, err := os.Stat(manifestJSON); err == nil {
		manifest, err := types.LoadManifestFromFile(manifestJSON)
		if err != nil {
			return nil, fmt.Errorf("loading manifest.json: %w", err)
		}
		return manifest, nil
	}

	// Try .leger.yaml (generic format)
	legerYAML := filepath.Join(quadletDir, ".leger.yaml")
	if _, err := os.Stat(legerYAML); err == nil {
		manifest, err := types.LoadManifestFromFile(legerYAML)
		if err != nil {
			return nil, fmt.Errorf("loading .leger.yaml: %w", err)
		}
		return manifest, nil
	}

	// Try .leger.yml as well
	legerYML := filepath.Join(quadletDir, ".leger.yml")
	if _, err := os.Stat(legerYML); err == nil {
		manifest, err := types.LoadManifestFromFile(legerYML)
		if err != nil {
			return nil, fmt.Errorf("loading .leger.yml: %w", err)
		}
		return manifest, nil
	}

	// No manifest found - auto-generate from quadlet files
	manifest, err := types.GenerateManifestFromQuadlets(quadletDir)
	if err != nil {
		return nil, fmt.Errorf(`failed to load or generate manifest: %w

Checking for manifest in:
  - manifest.json (leger.run format)
  - .leger.yaml (generic format)

If no manifest exists, one will be auto-generated from quadlet files.
Ensure the directory contains .container, .volume, or .network files`, err)
	}

	return manifest, nil
}
