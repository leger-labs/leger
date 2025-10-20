package legerrun

import (
	"encoding/json"
	"fmt"

	"github.com/leger-labs/leger/pkg/types"
)

// ParseManifest parses a leger.run manifest from JSON data
func ParseManifest(data []byte) (*types.Manifest, error) {
	var manifest types.Manifest
	if err := json.Unmarshal(data, &manifest); err != nil {
		return nil, fmt.Errorf("parsing manifest: %w", err)
	}

	if err := ValidateManifest(&manifest); err != nil {
		return nil, err
	}

	return &manifest, nil
}

// ValidateManifest validates a manifest structure
func ValidateManifest(m *types.Manifest) error {
	if m == nil {
		return fmt.Errorf("manifest is nil")
	}

	if m.Version == 0 {
		return fmt.Errorf("manifest version is required")
	}

	if len(m.Services) == 0 {
		return fmt.Errorf("manifest must contain at least one service")
	}

	// Validate each service
	for i, service := range m.Services {
		if service.Name == "" {
			return fmt.Errorf("service %d: name is required", i)
		}
		if service.Type == "" {
			return fmt.Errorf("service %s: type is required", service.Name)
		}
		if len(service.Files) == 0 {
			return fmt.Errorf("service %s: at least one quadlet file is required", service.Name)
		}
	}

	return nil
}
