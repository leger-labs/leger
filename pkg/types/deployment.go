package types

import "time"

// DeploymentState represents the state of a deployment
type DeploymentState struct {
	Name        string              `json:"name"`
	Source      string              `json:"source"`      // Git URL or leger.run URL
	Version     string              `json:"version"`     // Version or commit hash
	Scope       string              `json:"scope"`       // "user" or "system"
	InstalledAt time.Time           `json:"installed_at"`
	UpdatedAt   time.Time           `json:"updated_at,omitempty"`
	Services    []DeployedService   `json:"services"`
	Volumes     []DeployedVolume    `json:"volumes,omitempty"`
	Secrets     []string            `json:"secrets,omitempty"`
	Metadata    map[string]string   `json:"metadata,omitempty"`
}

// DeployedService represents a deployed service
type DeployedService struct {
	Name        string    `json:"name"`
	Type        string    `json:"type"` // container, pod, kube
	QuadletPath string    `json:"quadlet_path"`
	ServiceName string    `json:"service_name"` // systemd unit name
	Status      string    `json:"status"`
	Ports       []string  `json:"ports,omitempty"`
	Enabled     bool      `json:"enabled"`
	StartedAt   time.Time `json:"started_at,omitempty"`
}

// DeployedVolume represents a deployed volume
type DeployedVolume struct {
	Name      string    `json:"name"`
	MountPath string    `json:"mount_path,omitempty"`
	Driver    string    `json:"driver,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	Size      int64     `json:"size,omitempty"` // Size in bytes
}

// DeploymentHistory represents historical deployment information
type DeploymentHistory struct {
	Timestamp   time.Time         `json:"timestamp"`
	Action      string            `json:"action"` // install, update, remove, rollback
	Version     string            `json:"version"`
	Source      string            `json:"source"`
	Success     bool              `json:"success"`
	Message     string            `json:"message,omitempty"`
	Changes     []string          `json:"changes,omitempty"`
	Metadata    map[string]string `json:"metadata,omitempty"`
}
