package auth

import (
	"os"
	"testing"
	"time"
)

func TestAuthSaveLoad(t *testing.T) {
	// Clean up before and after
	defer Clear()

	// Create test auth
	testAuth := &Auth{
		TailscaleUser:   "alice@example.ts.net",
		Tailnet:         "example.ts.net",
		DeviceName:      "test-device",
		DeviceIP:        "100.64.0.1",
		AuthenticatedAt: time.Now().Truncate(time.Second),
	}

	// Save
	if err := testAuth.Save(); err != nil {
		t.Fatalf("failed to save auth: %v", err)
	}

	// Load
	loaded, err := Load()
	if err != nil {
		t.Fatalf("failed to load auth: %v", err)
	}

	if loaded == nil {
		t.Fatal("expected non-nil auth")
	}

	if loaded.TailscaleUser != testAuth.TailscaleUser {
		t.Errorf("expected %s, got %s", testAuth.TailscaleUser, loaded.TailscaleUser)
	}

	if loaded.Tailnet != testAuth.Tailnet {
		t.Errorf("expected %s, got %s", testAuth.Tailnet, loaded.Tailnet)
	}

	if loaded.DeviceName != testAuth.DeviceName {
		t.Errorf("expected %s, got %s", testAuth.DeviceName, loaded.DeviceName)
	}

	if loaded.DeviceIP != testAuth.DeviceIP {
		t.Errorf("expected %s, got %s", testAuth.DeviceIP, loaded.DeviceIP)
	}
}

func TestClear(t *testing.T) {
	// Clean up after
	defer Clear()

	// Create test auth
	testAuth := &Auth{
		TailscaleUser: "alice@example.ts.net",
		Tailnet:       "example.ts.net",
		DeviceName:    "test-device",
		DeviceIP:      "100.64.0.1",
	}
	if err := testAuth.Save(); err != nil {
		t.Fatalf("failed to save auth: %v", err)
	}

	// Clear
	if err := Clear(); err != nil {
		t.Fatalf("failed to clear: %v", err)
	}

	// Verify cleared
	loaded, err := Load()
	if err != nil {
		t.Fatalf("failed to load after clear: %v", err)
	}
	if loaded != nil {
		t.Fatal("expected nil after clear")
	}
}

func TestIsAuthenticated(t *testing.T) {
	// Clean up before and after
	defer Clear()

	// Initially not authenticated
	if IsAuthenticated() {
		t.Fatal("expected not authenticated initially")
	}

	// Save auth
	testAuth := &Auth{
		TailscaleUser: "alice@example.ts.net",
		Tailnet:       "example.ts.net",
		DeviceName:    "test-device",
		DeviceIP:      "100.64.0.1",
	}
	if err := testAuth.Save(); err != nil {
		t.Fatalf("failed to save auth: %v", err)
	}

	// Now authenticated
	if !IsAuthenticated() {
		t.Fatal("expected authenticated after save")
	}

	// Clear
	if err := Clear(); err != nil {
		t.Fatalf("failed to clear: %v", err)
	}

	// Not authenticated again
	if IsAuthenticated() {
		t.Fatal("expected not authenticated after clear")
	}
}

func TestAuthFilePermissions(t *testing.T) {
	// Clean up after
	defer Clear()

	// Save auth
	testAuth := &Auth{
		TailscaleUser: "alice@example.ts.net",
		Tailnet:       "example.ts.net",
		DeviceName:    "test-device",
		DeviceIP:      "100.64.0.1",
	}
	if err := testAuth.Save(); err != nil {
		t.Fatalf("failed to save auth: %v", err)
	}

	// Get auth file path
	path, err := AuthFile()
	if err != nil {
		t.Fatalf("failed to get auth file path: %v", err)
	}

	// Check file permissions
	info, err := os.Stat(path)
	if err != nil {
		t.Fatalf("failed to stat auth file: %v", err)
	}

	mode := info.Mode()
	if mode.Perm() != 0600 {
		t.Errorf("expected permissions 0600, got %o", mode.Perm())
	}
}
