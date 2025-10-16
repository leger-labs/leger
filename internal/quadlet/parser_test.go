package quadlet

import (
	"os"
	"path/filepath"
	"testing"
)

func TestParseSecretDirective(t *testing.T) {
	tests := []struct {
		name       string
		line       string
		wantName   string
		wantType   string
		wantTarget string
		wantErr    bool
	}{
		{
			name:       "simple secret",
			line:       "Secret=api_key",
			wantName:   "api_key",
			wantType:   "env",
			wantTarget: "API_KEY",
		},
		{
			name:       "secret with env target",
			line:       "Secret=api_key,type=env,target=OPENAI_KEY",
			wantName:   "api_key",
			wantType:   "env",
			wantTarget: "OPENAI_KEY",
		},
		{
			name:       "secret with mount",
			line:       "Secret=tls_cert,type=mount,target=/etc/ssl/cert.pem",
			wantName:   "tls_cert",
			wantType:   "mount",
			wantTarget: "/etc/ssl/cert.pem",
		},
		{
			name:    "empty secret",
			line:    "Secret=",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := parseSecretDirective(tt.line, "test.container")
			if tt.wantErr {
				if err == nil {
					t.Error("expected error, got nil")
				}
				return
			}
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			if got.Name != tt.wantName {
				t.Errorf("Name = %q, want %q", got.Name, tt.wantName)
			}
			if got.Type != tt.wantType {
				t.Errorf("Type = %q, want %q", got.Type, tt.wantType)
			}
			if got.Target != tt.wantTarget {
				t.Errorf("Target = %q, want %q", got.Target, tt.wantTarget)
			}
		})
	}
}

func TestParseFile(t *testing.T) {
	// Create temporary test file
	tmpDir := t.TempDir()
	testFile := filepath.Join(tmpDir, "test.container")

	content := `[Unit]
Description=Test Container

[Container]
Image=nginx:latest
Secret=api_key
Secret=db_password,type=env,target=DATABASE_PASSWORD
Secret=tls_cert,type=mount,target=/etc/ssl/cert.pem

[Service]
Restart=always

[Install]
WantedBy=default.target
`

	if err := os.WriteFile(testFile, []byte(content), 0644); err != nil {
		t.Fatalf("failed to write test file: %v", err)
	}

	secrets, err := ParseFile(testFile)
	if err != nil {
		t.Fatalf("ParseFile failed: %v", err)
	}

	if len(secrets) != 3 {
		t.Fatalf("expected 3 secrets, got %d", len(secrets))
	}

	// Check api_key
	if s, ok := secrets["api_key"]; !ok {
		t.Error("api_key not found")
	} else {
		if s.Type != "env" || s.Target != "API_KEY" {
			t.Errorf("api_key: got Type=%q Target=%q, want Type=env Target=API_KEY", s.Type, s.Target)
		}
	}

	// Check db_password
	if s, ok := secrets["db_password"]; !ok {
		t.Error("db_password not found")
	} else {
		if s.Type != "env" || s.Target != "DATABASE_PASSWORD" {
			t.Errorf("db_password: got Type=%q Target=%q, want Type=env Target=DATABASE_PASSWORD", s.Type, s.Target)
		}
	}

	// Check tls_cert
	if s, ok := secrets["tls_cert"]; !ok {
		t.Error("tls_cert not found")
	} else {
		if s.Type != "mount" || s.Target != "/etc/ssl/cert.pem" {
			t.Errorf("tls_cert: got Type=%q Target=%q, want Type=mount Target=/etc/ssl/cert.pem", s.Type, s.Target)
		}
	}
}

func TestParseDirectory(t *testing.T) {
	// Create temporary directory structure
	tmpDir := t.TempDir()

	// Create test files
	file1 := filepath.Join(tmpDir, "app.container")
	file2 := filepath.Join(tmpDir, "db.container")
	file3 := filepath.Join(tmpDir, "ignored.txt")

	content1 := `[Container]
Image=app:latest
Secret=app_secret
Secret=shared_key
`

	content2 := `[Container]
Image=postgres:15
Secret=db_password
Secret=shared_key
`

	if err := os.WriteFile(file1, []byte(content1), 0644); err != nil {
		t.Fatalf("failed to write file1: %v", err)
	}
	if err := os.WriteFile(file2, []byte(content2), 0644); err != nil {
		t.Fatalf("failed to write file2: %v", err)
	}
	if err := os.WriteFile(file3, []byte("ignored"), 0644); err != nil {
		t.Fatalf("failed to write file3: %v", err)
	}

	result, err := ParseDirectory(tmpDir)
	if err != nil {
		t.Fatalf("ParseDirectory failed: %v", err)
	}

	// Should find 2 quadlet files
	if len(result.QuadletFiles) != 2 {
		t.Errorf("expected 2 quadlet files, got %d", len(result.QuadletFiles))
	}

	// Should find 3 unique secrets (app_secret, db_password, shared_key)
	if len(result.Secrets) != 3 {
		t.Errorf("expected 3 unique secrets, got %d", len(result.Secrets))
	}

	// Check that secrets exist
	expectedSecrets := []string{"app_secret", "db_password", "shared_key"}
	for _, name := range expectedSecrets {
		if _, ok := result.Secrets[name]; !ok {
			t.Errorf("expected secret %q not found", name)
		}
	}
}
