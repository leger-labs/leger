package staging

import (
	"os"
	"path/filepath"
	"testing"
)

func TestGenerateDiff_NoStagedUpdates(t *testing.T) {
	tmpDir := t.TempDir()

	m := &Manager{
		StagingDir: filepath.Join(tmpDir, "staged"),
		ActiveDir:  filepath.Join(tmpDir, "active"),
		BackupDir:  filepath.Join(tmpDir, "backups"),
	}

	_, err := m.GenerateDiff("test-deployment")
	if err == nil {
		t.Error("Expected error when no staged updates exist")
	}
}

func TestGenerateDiff_NewDeployment(t *testing.T) {
	tmpDir := t.TempDir()

	m := &Manager{
		StagingDir: filepath.Join(tmpDir, "staged"),
		ActiveDir:  filepath.Join(tmpDir, "active"),
		BackupDir:  filepath.Join(tmpDir, "backups"),
	}

	// Create staged deployment (no active deployment)
	stagingPath := filepath.Join(m.StagingDir, "test-deployment")
	if err := os.MkdirAll(stagingPath, 0755); err != nil {
		t.Fatalf("Failed to create staging dir: %v", err)
	}

	testFile := filepath.Join(stagingPath, "app.container")
	if err := os.WriteFile(testFile, []byte("[Container]\nImage=nginx:latest\n"), 0644); err != nil {
		t.Fatalf("Failed to write test file: %v", err)
	}

	// Generate diff
	diff, err := m.GenerateDiff("test-deployment")
	if err != nil {
		t.Fatalf("GenerateDiff() failed: %v", err)
	}

	// Should show all files as added
	if len(diff.Added) != 1 {
		t.Errorf("Expected 1 added file, got %d", len(diff.Added))
	}

	if diff.Summary.FilesAdded != 1 {
		t.Errorf("Expected FilesAdded=1, got %d", diff.Summary.FilesAdded)
	}

	if len(diff.Modified) != 0 {
		t.Errorf("Expected 0 modified files, got %d", len(diff.Modified))
	}
}

func TestGenerateDiff_ModifiedFiles(t *testing.T) {
	tmpDir := t.TempDir()

	m := &Manager{
		StagingDir: filepath.Join(tmpDir, "staged"),
		ActiveDir:  filepath.Join(tmpDir, "active"),
		BackupDir:  filepath.Join(tmpDir, "backups"),
	}

	// Create active deployment
	activePath := filepath.Join(m.ActiveDir, "test-deployment")
	if err := os.MkdirAll(activePath, 0755); err != nil {
		t.Fatalf("Failed to create active dir: %v", err)
	}

	activeFile := filepath.Join(activePath, "app.container")
	if err := os.WriteFile(activeFile, []byte("[Container]\nImage=nginx:1.25\n"), 0644); err != nil {
		t.Fatalf("Failed to write active file: %v", err)
	}

	// Create staged deployment with modified file
	stagingPath := filepath.Join(m.StagingDir, "test-deployment")
	if err := os.MkdirAll(stagingPath, 0755); err != nil {
		t.Fatalf("Failed to create staging dir: %v", err)
	}

	stagedFile := filepath.Join(stagingPath, "app.container")
	if err := os.WriteFile(stagedFile, []byte("[Container]\nImage=nginx:1.26\n"), 0644); err != nil {
		t.Fatalf("Failed to write staged file: %v", err)
	}

	// Generate diff
	diff, err := m.GenerateDiff("test-deployment")
	if err != nil {
		t.Fatalf("GenerateDiff() failed: %v", err)
	}

	// Should show file as modified
	if len(diff.Modified) != 1 {
		t.Errorf("Expected 1 modified file, got %d", len(diff.Modified))
	}

	if diff.Summary.FilesModified != 1 {
		t.Errorf("Expected FilesModified=1, got %d", diff.Summary.FilesModified)
	}

	if len(diff.Added) != 0 {
		t.Errorf("Expected 0 added files, got %d", len(diff.Added))
	}

	if len(diff.Removed) != 0 {
		t.Errorf("Expected 0 removed files, got %d", len(diff.Removed))
	}
}

func TestGenerateDiff_AddedAndRemovedFiles(t *testing.T) {
	tmpDir := t.TempDir()

	m := &Manager{
		StagingDir: filepath.Join(tmpDir, "staged"),
		ActiveDir:  filepath.Join(tmpDir, "active"),
		BackupDir:  filepath.Join(tmpDir, "backups"),
	}

	// Create active deployment
	activePath := filepath.Join(m.ActiveDir, "test-deployment")
	if err := os.MkdirAll(activePath, 0755); err != nil {
		t.Fatalf("Failed to create active dir: %v", err)
	}

	oldFile := filepath.Join(activePath, "old.container")
	if err := os.WriteFile(oldFile, []byte("[Container]\nImage=old:latest\n"), 0644); err != nil {
		t.Fatalf("Failed to write old file: %v", err)
	}

	// Create staged deployment with new file (no old file)
	stagingPath := filepath.Join(m.StagingDir, "test-deployment")
	if err := os.MkdirAll(stagingPath, 0755); err != nil {
		t.Fatalf("Failed to create staging dir: %v", err)
	}

	newFile := filepath.Join(stagingPath, "new.container")
	if err := os.WriteFile(newFile, []byte("[Container]\nImage=new:latest\n"), 0644); err != nil {
		t.Fatalf("Failed to write new file: %v", err)
	}

	// Generate diff
	diff, err := m.GenerateDiff("test-deployment")
	if err != nil {
		t.Fatalf("GenerateDiff() failed: %v", err)
	}

	// Should show one added and one removed
	if len(diff.Added) != 1 {
		t.Errorf("Expected 1 added file, got %d", len(diff.Added))
	}

	if len(diff.Removed) != 1 {
		t.Errorf("Expected 1 removed file, got %d", len(diff.Removed))
	}

	if diff.Summary.FilesAdded != 1 {
		t.Errorf("Expected FilesAdded=1, got %d", diff.Summary.FilesAdded)
	}

	if diff.Summary.FilesRemoved != 1 {
		t.Errorf("Expected FilesRemoved=1, got %d", diff.Summary.FilesRemoved)
	}
}

func TestExtractServiceNames(t *testing.T) {
	result := &DiffResult{
		Modified: []FileDiff{
			{Path: "app.container"},
			{Path: "db.container"},
		},
		Added: []string{
			"cache.container",
			"config.yaml",
		},
		Removed: []string{
			"old.container",
		},
	}

	services := extractServiceNames(result)

	expectedServices := map[string]bool{
		"app":   true,
		"db":    true,
		"cache": true,
	}

	if len(services) != len(expectedServices) {
		t.Errorf("Expected %d services, got %d", len(expectedServices), len(services))
	}

	for _, service := range services {
		if !expectedServices[service] {
			t.Errorf("Unexpected service: %s", service)
		}
	}
}

func TestListFiles(t *testing.T) {
	tmpDir := t.TempDir()

	// Create test directory structure
	if err := os.MkdirAll(filepath.Join(tmpDir, "subdir"), 0755); err != nil {
		t.Fatalf("Failed to create subdir: %v", err)
	}

	files := []string{
		"app.container",
		"app.volume",
		"subdir/db.container",
		".staging-metadata.json", // Should be skipped
	}

	for _, file := range files {
		path := filepath.Join(tmpDir, file)
		if err := os.WriteFile(path, []byte("test"), 0644); err != nil {
			t.Fatalf("Failed to write file %s: %v", file, err)
		}
	}

	// List files
	result, err := listFiles(tmpDir)
	if err != nil {
		t.Fatalf("listFiles() failed: %v", err)
	}

	// Should not include metadata file
	if len(result) != 3 {
		t.Errorf("Expected 3 files, got %d", len(result))
	}

	// Verify metadata file was skipped
	for _, file := range result {
		if file == ".staging-metadata.json" {
			t.Error("Metadata file should have been skipped")
		}
	}
}
