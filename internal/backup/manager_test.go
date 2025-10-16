package backup

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestNewManager(t *testing.T) {
	mgr, err := NewManager()
	if err != nil {
		t.Fatalf("NewManager failed: %v", err)
	}

	if mgr.BackupDir == "" {
		t.Error("BackupDir is empty")
	}

	// Check that backup directory was created
	if _, err := os.Stat(mgr.BackupDir); os.IsNotExist(err) {
		t.Errorf("Backup directory was not created: %s", mgr.BackupDir)
	}
}

func TestSaveAndLoadMetadata(t *testing.T) {
	// Create temporary directory for testing
	tmpDir := t.TempDir()

	mgr := &Manager{
		BackupDir: tmpDir,
	}

	// Create test backup metadata
	backup := &Backup{
		ID:             "test-backup-2025-10-16-120000",
		DeploymentName: "nginx",
		CreatedAt:      time.Now(),
		Type:           BackupTypeManual,
		Reason:         "test",
		Size:           1024,
		QuadletFiles:   []string{"nginx.container", "nginx.volume"},
		Volumes: []VolumeBackup{
			{
				Name:        "nginx-data",
				ArchivePath: "volumes/nginx-data.tar",
				Size:        512,
			},
		},
	}

	// Create backup directory
	backupDir := filepath.Join(tmpDir, backup.ID)
	if err := os.MkdirAll(backupDir, 0755); err != nil {
		t.Fatalf("Failed to create backup directory: %v", err)
	}

	// Save metadata
	if err := mgr.saveMetadata(backup); err != nil {
		t.Fatalf("saveMetadata failed: %v", err)
	}

	// Verify metadata file exists
	metadataPath := filepath.Join(backupDir, metadataFileName)
	if _, err := os.Stat(metadataPath); os.IsNotExist(err) {
		t.Errorf("Metadata file was not created: %s", metadataPath)
	}

	// Load metadata
	loaded, err := mgr.loadMetadata(metadataPath)
	if err != nil {
		t.Fatalf("loadMetadata failed: %v", err)
	}

	// Verify loaded data matches
	if loaded.ID != backup.ID {
		t.Errorf("ID mismatch: got %s, want %s", loaded.ID, backup.ID)
	}

	if loaded.DeploymentName != backup.DeploymentName {
		t.Errorf("DeploymentName mismatch: got %s, want %s", loaded.DeploymentName, backup.DeploymentName)
	}

	if loaded.Type != backup.Type {
		t.Errorf("Type mismatch: got %s, want %s", loaded.Type, backup.Type)
	}

	if len(loaded.QuadletFiles) != len(backup.QuadletFiles) {
		t.Errorf("QuadletFiles length mismatch: got %d, want %d", len(loaded.QuadletFiles), len(backup.QuadletFiles))
	}

	if len(loaded.Volumes) != len(backup.Volumes) {
		t.Errorf("Volumes length mismatch: got %d, want %d", len(loaded.Volumes), len(backup.Volumes))
	}
}

func TestList(t *testing.T) {
	// Create temporary directory for testing
	tmpDir := t.TempDir()

	mgr := &Manager{
		BackupDir: tmpDir,
	}

	// Test with empty directory
	backups, err := mgr.List()
	if err != nil {
		t.Fatalf("List failed: %v", err)
	}

	if len(backups) != 0 {
		t.Errorf("Expected 0 backups, got %d", len(backups))
	}

	// Create test backups
	backup1 := &Backup{
		ID:             "nginx-2025-10-16-120000",
		DeploymentName: "nginx",
		CreatedAt:      time.Now().Add(-2 * time.Hour),
		Type:           BackupTypeManual,
		Reason:         "test1",
		Size:           1024,
		QuadletFiles:   []string{"nginx.container"},
		Volumes:        []VolumeBackup{},
	}

	backup2 := &Backup{
		ID:             "nginx-2025-10-16-140000",
		DeploymentName: "nginx",
		CreatedAt:      time.Now().Add(-1 * time.Hour),
		Type:           BackupTypeAutomatic,
		Reason:         "before-update",
		Size:           2048,
		QuadletFiles:   []string{"nginx.container"},
		Volumes:        []VolumeBackup{},
	}

	// Save backup1
	backupDir1 := filepath.Join(tmpDir, backup1.ID)
	if err := os.MkdirAll(backupDir1, 0755); err != nil {
		t.Fatalf("Failed to create backup directory: %v", err)
	}
	if err := mgr.saveMetadata(backup1); err != nil {
		t.Fatalf("Failed to save backup1 metadata: %v", err)
	}

	// Save backup2
	backupDir2 := filepath.Join(tmpDir, backup2.ID)
	if err := os.MkdirAll(backupDir2, 0755); err != nil {
		t.Fatalf("Failed to create backup directory: %v", err)
	}
	if err := mgr.saveMetadata(backup2); err != nil {
		t.Fatalf("Failed to save backup2 metadata: %v", err)
	}

	// List backups
	backups, err = mgr.List()
	if err != nil {
		t.Fatalf("List failed: %v", err)
	}

	if len(backups) != 2 {
		t.Fatalf("Expected 2 backups, got %d", len(backups))
	}

	// Verify backups are sorted by creation time (newest first)
	if backups[0].CreatedAt.Before(backups[1].CreatedAt) {
		t.Error("Backups are not sorted correctly (should be newest first)")
	}
}

func TestGet(t *testing.T) {
	// Create temporary directory for testing
	tmpDir := t.TempDir()

	mgr := &Manager{
		BackupDir: tmpDir,
	}

	// Test getting non-existent backup
	_, err := mgr.Get("non-existent")
	if err == nil {
		t.Error("Expected error for non-existent backup, got nil")
	}

	// Create test backup
	backup := &Backup{
		ID:             "test-backup-2025-10-16-120000",
		DeploymentName: "nginx",
		CreatedAt:      time.Now(),
		Type:           BackupTypeManual,
		Reason:         "test",
		Size:           1024,
		QuadletFiles:   []string{"nginx.container"},
		Volumes:        []VolumeBackup{},
	}

	backupDir := filepath.Join(tmpDir, backup.ID)
	if err := os.MkdirAll(backupDir, 0755); err != nil {
		t.Fatalf("Failed to create backup directory: %v", err)
	}
	if err := mgr.saveMetadata(backup); err != nil {
		t.Fatalf("Failed to save metadata: %v", err)
	}

	// Get backup
	retrieved, err := mgr.Get(backup.ID)
	if err != nil {
		t.Fatalf("Get failed: %v", err)
	}

	if retrieved.ID != backup.ID {
		t.Errorf("ID mismatch: got %s, want %s", retrieved.ID, backup.ID)
	}
}

func TestCalculateDirectorySize(t *testing.T) {
	// Create temporary directory for testing
	tmpDir := t.TempDir()

	mgr := &Manager{
		BackupDir: tmpDir,
	}

	// Create some test files
	file1 := filepath.Join(tmpDir, "file1.txt")
	file2 := filepath.Join(tmpDir, "file2.txt")

	content1 := []byte("hello world")              // 11 bytes
	content2 := []byte("testing directory size\n") // 23 bytes

	if err := os.WriteFile(file1, content1, 0644); err != nil {
		t.Fatalf("Failed to create test file: %v", err)
	}
	if err := os.WriteFile(file2, content2, 0644); err != nil {
		t.Fatalf("Failed to create test file: %v", err)
	}

	// Calculate size
	size, err := mgr.calculateDirectorySize(tmpDir)
	if err != nil {
		t.Fatalf("calculateDirectorySize failed: %v", err)
	}

	expectedSize := int64(len(content1) + len(content2))
	if size != expectedSize {
		t.Errorf("Size mismatch: got %d, want %d", size, expectedSize)
	}
}

func TestBackupTypeJSON(t *testing.T) {
	// Test BackupType marshaling/unmarshaling
	backup := &Backup{
		ID:             "test",
		DeploymentName: "nginx",
		CreatedAt:      time.Now(),
		Type:           BackupTypeManual,
		Reason:         "test",
		Size:           1024,
		QuadletFiles:   []string{},
		Volumes:        []VolumeBackup{},
	}

	// Marshal to JSON
	data, err := json.Marshal(backup)
	if err != nil {
		t.Fatalf("JSON marshal failed: %v", err)
	}

	// Unmarshal from JSON
	var decoded Backup
	if err := json.Unmarshal(data, &decoded); err != nil {
		t.Fatalf("JSON unmarshal failed: %v", err)
	}

	if decoded.Type != backup.Type {
		t.Errorf("BackupType mismatch after JSON roundtrip: got %s, want %s", decoded.Type, backup.Type)
	}
}
