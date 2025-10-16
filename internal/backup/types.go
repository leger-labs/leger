package backup

import (
	"time"
)

// BackupType indicates whether a backup was created manually or automatically
type BackupType string

const (
	BackupTypeManual    BackupType = "manual"
	BackupTypeAutomatic BackupType = "automatic"
)

// Backup represents a complete backup with metadata
type Backup struct {
	ID             string         `json:"id"`              // Timestamp-based: nginx-2025-10-16-120000
	DeploymentName string         `json:"deployment_name"` // Name of the deployment
	CreatedAt      time.Time      `json:"created_at"`      // When backup was created
	Type           BackupType     `json:"type"`            // Manual or Automatic
	Reason         string         `json:"reason"`          // "before-update", "manual", "before-remove"
	Size           int64          `json:"size"`            // Total size in bytes
	QuadletFiles   []string       `json:"quadlet_files"`   // List of quadlet files backed up
	Volumes        []VolumeBackup `json:"volumes"`         // Volume backups included
}

// VolumeBackup represents a single volume backup
type VolumeBackup struct {
	Name        string `json:"name"`         // Volume name
	ArchivePath string `json:"archive_path"` // Relative path to archive file
	Size        int64  `json:"size"`         // Size in bytes
}
