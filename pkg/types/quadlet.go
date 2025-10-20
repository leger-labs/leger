package types

import "time"

// QuadletType represents the type of quadlet file
type QuadletType string

const (
	QuadletTypeContainer QuadletType = "container"
	QuadletTypeVolume    QuadletType = "volume"
	QuadletTypeNetwork   QuadletType = "network"
	QuadletTypePod       QuadletType = "pod"
	QuadletTypeKube      QuadletType = "kube"
	QuadletTypeImage     QuadletType = "image"
)

// QuadletInfo represents information about an installed quadlet
type QuadletInfo struct {
	Name        string      `json:"name"`
	Type        QuadletType `json:"type"`
	Path        string      `json:"path"`
	ServiceName string      `json:"service_name"` // Corresponding systemd service name
	Status      string      `json:"status"`       // Service status (running, stopped, failed, etc.)
	Enabled     bool        `json:"enabled"`      // Whether service is enabled
	Source      string      `json:"source"`       // Git URL or path where it was installed from
	Ports       []PortInfo  `json:"ports,omitempty"`
	Volumes     []string    `json:"volumes,omitempty"`
	Secrets     []string    `json:"secrets,omitempty"`
}

// PortInfo represents port mapping information
type PortInfo struct {
	Host      string `json:"host"`      // Host port
	Container string `json:"container"` // Container port
	Protocol  string `json:"protocol"`  // tcp, udp, sctp
}

// QuadletMetadata contains metadata about a quadlet deployment
type QuadletMetadata struct {
	Name        string    `json:"name"`
	Version     string    `json:"version"`
	Source      string    `json:"source"`
	InstallPath string    `json:"install_path"`
	InstalledAt time.Time `json:"installed_at"`
	UpdatedAt   time.Time `json:"updated_at,omitempty"`
	Description string    `json:"description,omitempty"`
}

// ServiceStatus represents the status of a systemd service
type ServiceStatus struct {
	Name        string `json:"name"`
	LoadState   string `json:"load_state"`   // loaded, not-found, etc.
	ActiveState string `json:"active_state"` // active, inactive, failed, etc.
	SubState    string `json:"sub_state"`    // running, dead, etc.
	Description string `json:"description"`
	MainPID     int    `json:"main_pid"`
}

// PortConflict represents a port conflict between quadlets
type PortConflict struct {
	Port          string   `json:"port"`
	Protocol      string   `json:"protocol"`
	Quadlets      []string `json:"quadlets"`       // Names of quadlets using this port
	ConflictsWith string   `json:"conflicts_with"` // Name of existing service using this port
}

// VolumeConflict represents a volume mount conflict
type VolumeConflict struct {
	Path          string   `json:"path"`
	Quadlets      []string `json:"quadlets"`       // Names of quadlets using this path
	ConflictsWith string   `json:"conflicts_with"` // Name of existing volume using this path
}

// CircularDependency represents a circular dependency in services
type CircularDependency struct {
	Services []string `json:"services"` // Services involved in the circular dependency
}

// MissingDependency represents a missing dependency
type MissingDependency struct {
	Service           string `json:"service"`            // Service that has the missing dependency
	MissingDependency string `json:"missing_dependency"` // The dependency that is missing
}
