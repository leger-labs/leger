package types

import "time"

// Manifest represents a leger deployment manifest
type Manifest struct {
	Version     int                  `json:"version"`
	CreatedAt   time.Time            `json:"created_at"`
	Name        string               `json:"name"`
	Description string               `json:"description,omitempty"`
	Services    []ServiceDefinition  `json:"services"`
	Volumes     []VolumeDefinition   `json:"volumes,omitempty"`
	Networks    []NetworkDefinition  `json:"networks,omitempty"`
	Secrets     []SecretDefinition   `json:"secrets,omitempty"`
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
	Name        string `json:"name"`
	Type        string `json:"type"`        // env, mount
	Target      string `json:"target"`      // Environment variable name or mount path
	Description string `json:"description,omitempty"`
	Required    bool   `json:"required"`
}
