package validation

import (
	"os"
	"path/filepath"
	"testing"
)

func TestValidateQuadletSyntax(t *testing.T) {
	tests := []struct {
		name     string
		content  string
		filename string
		wantErr  bool
	}{
		{
			name: "Valid container quadlet",
			content: `[Unit]
Description=Test Container

[Container]
Image=nginx:latest
PublishPort=8080:80

[Service]
Restart=always

[Install]
WantedBy=default.target`,
			filename: "test.container",
			wantErr:  false,
		},
		{
			name: "Container missing Image directive",
			content: `[Unit]
Description=Test Container

[Container]
PublishPort=8080:80

[Service]
Restart=always`,
			filename: "test.container",
			wantErr:  true,
		},
		{
			name: "Container missing Container section",
			content: `[Unit]
Description=Test Container

[Service]
Restart=always`,
			filename: "test.container",
			wantErr:  true,
		},
		{
			name: "Valid volume quadlet",
			content: `[Volume]
Driver=local

[Install]
WantedBy=default.target`,
			filename: "test.volume",
			wantErr:  false,
		},
		{
			name: "Volume missing Volume section",
			content: `[Install]
WantedBy=default.target`,
			filename: "test.volume",
			wantErr:  true,
		},
		{
			name: "Valid network quadlet",
			content: `[Network]
Subnet=10.0.0.0/24
Gateway=10.0.0.1`,
			filename: "test.network",
			wantErr:  false,
		},
		{
			name: "Unsupported file type",
			content: `[Unit]
Description=Test`,
			filename: "test.txt",
			wantErr:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Create temp file
			tmpDir := t.TempDir()
			tmpFile := filepath.Join(tmpDir, tt.filename)
			if err := os.WriteFile(tmpFile, []byte(tt.content), 0644); err != nil {
				t.Fatalf("Failed to create temp file: %v", err)
			}

			// Validate
			err := ValidateQuadletSyntax(tmpFile)
			if (err != nil) != tt.wantErr {
				t.Errorf("ValidateQuadletSyntax() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestValidateQuadletDirectory(t *testing.T) {
	t.Run("Valid directory", func(t *testing.T) {
		tmpDir := t.TempDir()

		// Create valid quadlet files
		files := map[string]string{
			"nginx.container": `[Unit]
Description=Nginx

[Container]
Image=nginx:latest
PublishPort=8080:80

[Service]
Restart=always`,
			"data.volume": `[Volume]
Driver=local`,
		}

		for name, content := range files {
			if err := os.WriteFile(filepath.Join(tmpDir, name), []byte(content), 0644); err != nil {
				t.Fatalf("Failed to create temp file: %v", err)
			}
		}

		err := ValidateQuadletDirectory(tmpDir)
		if err != nil {
			t.Errorf("ValidateQuadletDirectory() error = %v, want nil", err)
		}
	})

	t.Run("Invalid directory", func(t *testing.T) {
		tmpDir := t.TempDir()

		// Create invalid quadlet file
		invalidFile := filepath.Join(tmpDir, "bad.container")
		if err := os.WriteFile(invalidFile, []byte("[Unit]\nDescription=Bad"), 0644); err != nil {
			t.Fatalf("Failed to create temp file: %v", err)
		}

		err := ValidateQuadletDirectory(tmpDir)
		if err == nil {
			t.Error("ValidateQuadletDirectory() should have returned error for invalid file")
		}
	})
}
