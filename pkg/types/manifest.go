package types

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"gopkg.in/yaml.v3"
)

// Manifest represents a leger deployment manifest
type Manifest struct {
	Version     int                  `json:"version" yaml:"version"`
	CreatedAt   time.Time            `json:"created_at" yaml:"created_at"`
	UserUUID    string               `json:"user_uuid,omitempty" yaml:"user_uuid,omitempty"`
	Name        string               `json:"name" yaml:"name"`
	Description string               `json:"description,omitempty" yaml:"description,omitempty"`
	Services    []ServiceDefinition  `json:"services" yaml:"services"`
	Volumes     []VolumeDefinition   `json:"volumes,omitempty" yaml:"volumes,omitempty"`
	Networks    []NetworkDefinition  `json:"networks,omitempty" yaml:"networks,omitempty"`
	Secrets     []SecretDefinition   `json:"secrets,omitempty" yaml:"secrets,omitempty"`
}

// ServiceDefinition defines a service in the manifest
type ServiceDefinition struct {
	Name        string            `json:"name"`
	Type        string            `json:"type"` // container, pod, kube
	Files       []string          `json:"files"` // Quadlet files associated with this service
	Description string            `json:"description,omitempty"`
	DependsOn   []string          `json:"depends_on,omitempty"`
	Ports       []string          `json:"ports,omitempty"`
	Environment map[string]string `json:"environment,omitempty"`
}

// VolumeDefinition defines a volume in the manifest
type VolumeDefinition struct {
	Name        string            `json:"name"`
	Driver      string            `json:"driver,omitempty"`
	Options     map[string]string `json:"options,omitempty"`
	Labels      map[string]string `json:"labels,omitempty"`
	Description string            `json:"description,omitempty"`
}

// NetworkDefinition defines a network in the manifest
type NetworkDefinition struct {
	Name        string            `json:"name"`
	Driver      string            `json:"driver,omitempty"`
	Subnet      string            `json:"subnet,omitempty"`
	Gateway     string            `json:"gateway,omitempty"`
	Options     map[string]string `json:"options,omitempty"`
	Labels      map[string]string `json:"labels,omitempty"`
	Description string            `json:"description,omitempty"`
}

// SecretDefinition defines a secret requirement in the manifest
type SecretDefinition struct {
	Name        string `json:"name" yaml:"name"`
	Type        string `json:"type" yaml:"type"`               // env, mount
	Target      string `json:"target" yaml:"target"`           // Environment variable name or mount path
	Description string `json:"description,omitempty" yaml:"description,omitempty"`
	Required    bool   `json:"required" yaml:"required"`
}

// LoadManifestFromFile loads a manifest from a file (JSON or YAML)
func LoadManifestFromFile(path string) (*Manifest, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("reading manifest file: %w", err)
	}

	ext := strings.ToLower(filepath.Ext(path))
	switch ext {
	case ".json":
		return LoadManifestFromJSON(data)
	case ".yaml", ".yml":
		return LoadManifestFromYAML(data)
	default:
		// Try JSON first, then YAML
		manifest, err := LoadManifestFromJSON(data)
		if err == nil {
			return manifest, nil
		}
		return LoadManifestFromYAML(data)
	}
}

// LoadManifestFromJSON parses a manifest from JSON data
func LoadManifestFromJSON(data []byte) (*Manifest, error) {
	var manifest Manifest
	if err := json.Unmarshal(data, &manifest); err != nil {
		return nil, fmt.Errorf("parsing JSON manifest: %w", err)
	}
	return &manifest, nil
}

// LoadManifestFromYAML parses a manifest from YAML data
func LoadManifestFromYAML(data []byte) (*Manifest, error) {
	var manifest Manifest
	if err := yaml.Unmarshal(data, &manifest); err != nil {
		return nil, fmt.Errorf("parsing YAML manifest: %w", err)
	}
	return &manifest, nil
}

// GenerateManifestFromQuadlets auto-generates a manifest from quadlet files in a directory
func GenerateManifestFromQuadlets(quadletDir string) (*Manifest, error) {
	// Find all quadlet files
	files, err := filepath.Glob(filepath.Join(quadletDir, "*.container"))
	if err != nil {
		return nil, fmt.Errorf("scanning for quadlet files: %w", err)
	}

	if len(files) == 0 {
		return nil, fmt.Errorf("no quadlet files found in %s", quadletDir)
	}

	manifest := &Manifest{
		Version:   1,
		CreatedAt: time.Now(),
		Name:      filepath.Base(quadletDir),
		Services:  make([]ServiceDefinition, 0, len(files)),
	}

	// Parse each quadlet file for basic metadata
	for _, file := range files {
		baseName := strings.TrimSuffix(filepath.Base(file), ".container")
		service := ServiceDefinition{
			Name:  baseName,
			Type:  "container",
			Files: []string{filepath.Base(file)},
		}

		// Try to extract additional metadata from the file
		data, err := os.ReadFile(file)
		if err == nil {
			content := string(data)
			// Extract image
			if idx := strings.Index(content, "Image="); idx != -1 {
				line := content[idx:]
				if endIdx := strings.Index(line, "\n"); endIdx != -1 {
					service.Environment = make(map[string]string)
					service.Environment["Image"] = strings.TrimSpace(strings.TrimPrefix(line[:endIdx], "Image="))
				}
			}
			// Extract ports
			lines := strings.Split(content, "\n")
			for _, line := range lines {
				line = strings.TrimSpace(line)
				if strings.HasPrefix(line, "PublishPort=") {
					port := strings.TrimPrefix(line, "PublishPort=")
					service.Ports = append(service.Ports, port)
				}
			}
		}

		manifest.Services = append(manifest.Services, service)
	}

	// Also scan for volume files
	volumeFiles, err := filepath.Glob(filepath.Join(quadletDir, "*.volume"))
	if err == nil && len(volumeFiles) > 0 {
		manifest.Volumes = make([]VolumeDefinition, 0, len(volumeFiles))
		for _, file := range volumeFiles {
			baseName := strings.TrimSuffix(filepath.Base(file), ".volume")
			volume := VolumeDefinition{
				Name: baseName,
			}
			manifest.Volumes = append(manifest.Volumes, volume)
		}
	}

	return manifest, nil
}
