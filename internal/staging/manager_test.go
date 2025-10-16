package staging

import (
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestNewManager(t *testing.T) {
	m, err := NewManager()
	if err != nil {
		t.Fatalf("NewManager() failed: %v", err)
	}

	if m.StagingDir == "" {
		t.Error("StagingDir should not be empty")
	}

	if m.ActiveDir == "" {
		t.Error("ActiveDir should not be empty")
	}

	if m.BackupDir == "" {
		t.Error("BackupDir should not be empty")
	}
}

func TestInitStaging(t *testing.T) {
	tmpDir := t.TempDir()

	m := &Manager{
		StagingDir: filepath.Join(tmpDir, "staged"),
		ActiveDir:  filepath.Join(tmpDir, "active"),
		BackupDir:  filepath.Join(tmpDir, "backups"),
	}

	err := m.InitStaging("test-deployment")
	if err != nil {
		t.Fatalf("InitStaging() failed: %v", err)
	}

	stagingPath := filepath.Join(m.StagingDir, "test-deployment")
	if _, err := os.Stat(stagingPath); os.IsNotExist(err) {
		t.Errorf("Staging directory was not created: %s", stagingPath)
	}
}

func TestHasStagedUpdates(t *testing.T) {
	tmpDir := t.TempDir()

	m := &Manager{
		StagingDir: filepath.Join(tmpDir, "staged"),
		ActiveDir:  filepath.Join(tmpDir, "active"),
		BackupDir:  filepath.Join(tmpDir, "backups"),
	}

	// Test when staging directory doesn't exist
	hasUpdates, err := m.HasStagedUpdates()
	if err != nil {
		t.Fatalf("HasStagedUpdates() failed: %v", err)
	}
	if hasUpdates {
		t.Error("Should not have staged updates when directory doesn't exist")
	}

	// Test when staging directory is empty
	if err := os.MkdirAll(m.StagingDir, 0755); err != nil {
		t.Fatalf("Failed to create staging dir: %v", err)
	}

	hasUpdates, err = m.HasStagedUpdates()
	if err != nil {
		t.Fatalf("HasStagedUpdates() failed: %v", err)
	}
	if hasUpdates {
		t.Error("Should not have staged updates when directory is empty")
	}

	// Test when staging has content
	deploymentPath := filepath.Join(m.StagingDir, "test")
	if err := os.MkdirAll(deploymentPath, 0755); err != nil {
		t.Fatalf("Failed to create deployment dir: %v", err)
	}

	testFile := filepath.Join(deploymentPath, "test.container")
	if err := os.WriteFile(testFile, []byte("test content"), 0644); err != nil {
		t.Fatalf("Failed to write test file: %v", err)
	}

	hasUpdates, err = m.HasStagedUpdates()
	if err != nil {
		t.Fatalf("HasStagedUpdates() failed: %v", err)
	}
	if !hasUpdates {
		t.Error("Should have staged updates when files exist")
	}
}

func TestSaveAndLoadMetadata(t *testing.T) {
	tmpDir := t.TempDir()

	m := &Manager{
		StagingDir: filepath.Join(tmpDir, "staged"),
		ActiveDir:  filepath.Join(tmpDir, "active"),
		BackupDir:  filepath.Join(tmpDir, "backups"),
	}

	meta := &StagingMetadata{
		DeploymentName: "test-deployment",
		SourceURL:      "https://github.com/test/repo",
		StagedVersion:  "v1.0.0",
		CurrentVersion: "v0.9.0",
		StagedAt:       time.Now(),
		Checksum:       "abc123",
	}

	// Save metadata
	if err := m.SaveMetadata(meta); err != nil {
		t.Fatalf("SaveMetadata() failed: %v", err)
	}

	// Load metadata
	loaded, err := m.LoadMetadata("test-deployment")
	if err != nil {
		t.Fatalf("LoadMetadata() failed: %v", err)
	}

	if loaded.DeploymentName != meta.DeploymentName {
		t.Errorf("DeploymentName mismatch: got %s, want %s", loaded.DeploymentName, meta.DeploymentName)
	}

	if loaded.SourceURL != meta.SourceURL {
		t.Errorf("SourceURL mismatch: got %s, want %s", loaded.SourceURL, meta.SourceURL)
	}

	if loaded.StagedVersion != meta.StagedVersion {
		t.Errorf("StagedVersion mismatch: got %s, want %s", loaded.StagedVersion, meta.StagedVersion)
	}
}

func TestListStagedDeployments(t *testing.T) {
	tmpDir := t.TempDir()

	m := &Manager{
		StagingDir: filepath.Join(tmpDir, "staged"),
		ActiveDir:  filepath.Join(tmpDir, "active"),
		BackupDir:  filepath.Join(tmpDir, "backups"),
	}

	// Test when no staged deployments
	deployments, err := m.ListStagedDeployments()
	if err != nil {
		t.Fatalf("ListStagedDeployments() failed: %v", err)
	}
	if len(deployments) != 0 {
		t.Errorf("Expected 0 deployments, got %d", len(deployments))
	}

	// Create staged deployments
	for _, name := range []string{"deploy1", "deploy2", "deploy3"} {
		deploymentPath := filepath.Join(m.StagingDir, name)
		if err := os.MkdirAll(deploymentPath, 0755); err != nil {
			t.Fatalf("Failed to create deployment dir: %v", err)
		}

		testFile := filepath.Join(deploymentPath, name+".container")
		if err := os.WriteFile(testFile, []byte("test"), 0644); err != nil {
			t.Fatalf("Failed to write test file: %v", err)
		}
	}

	// List deployments
	deployments, err = m.ListStagedDeployments()
	if err != nil {
		t.Fatalf("ListStagedDeployments() failed: %v", err)
	}

	if len(deployments) != 3 {
		t.Errorf("Expected 3 deployments, got %d", len(deployments))
	}
}

func TestDiscardStaged(t *testing.T) {
	tmpDir := t.TempDir()

	m := &Manager{
		StagingDir: filepath.Join(tmpDir, "staged"),
		ActiveDir:  filepath.Join(tmpDir, "active"),
		BackupDir:  filepath.Join(tmpDir, "backups"),
	}

	// Create a staged deployment
	deploymentPath := filepath.Join(m.StagingDir, "test-deployment")
	if err := os.MkdirAll(deploymentPath, 0755); err != nil {
		t.Fatalf("Failed to create deployment dir: %v", err)
	}

	testFile := filepath.Join(deploymentPath, "test.container")
	if err := os.WriteFile(testFile, []byte("test content"), 0644); err != nil {
		t.Fatalf("Failed to write test file: %v", err)
	}

	// Discard
	if err := m.DiscardStaged("test-deployment"); err != nil {
		t.Fatalf("DiscardStaged() failed: %v", err)
	}

	// Verify it's gone
	if _, err := os.Stat(deploymentPath); !os.IsNotExist(err) {
		t.Error("Deployment directory should have been removed")
	}
}

func TestCleanStaging(t *testing.T) {
	tmpDir := t.TempDir()

	m := &Manager{
		StagingDir: filepath.Join(tmpDir, "staged"),
		ActiveDir:  filepath.Join(tmpDir, "active"),
		BackupDir:  filepath.Join(tmpDir, "backups"),
	}

	// Create some staged content
	for i := 1; i <= 3; i++ {
		deploymentPath := filepath.Join(m.StagingDir, "deploy"+string(rune('0'+i)))
		if err := os.MkdirAll(deploymentPath, 0755); err != nil {
			t.Fatalf("Failed to create deployment dir: %v", err)
		}
	}

	// Clean staging
	if err := m.CleanStaging(); err != nil {
		t.Fatalf("CleanStaging() failed: %v", err)
	}

	// Verify everything is gone
	if _, err := os.Stat(m.StagingDir); !os.IsNotExist(err) {
		t.Error("Staging directory should have been removed")
	}
}
