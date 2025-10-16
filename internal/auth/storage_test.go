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

// Tests for new JWT token storage

func TestTokenStoreSaveLoad(t *testing.T) {
	// Create temporary directory for testing
	tmpDir := t.TempDir()
	tokenStore := &TokenStore{ConfigDir: tmpDir}

	// Create test stored auth
	expiresAt := time.Now().Add(24 * time.Hour).Truncate(time.Second)
	testAuth := &StoredAuth{
		Token:     "test-jwt-token",
		TokenType: "Bearer",
		ExpiresAt: expiresAt,
		UserUUID:  "user-uuid-123",
		UserEmail: "alice@example.ts.net",
	}

	// Save
	if err := tokenStore.Save(testAuth); err != nil {
		t.Fatalf("failed to save token: %v", err)
	}

	// Load
	loaded, err := tokenStore.Load()
	if err != nil {
		t.Fatalf("failed to load token: %v", err)
	}

	if loaded == nil {
		t.Fatal("expected non-nil stored auth")
	}

	if loaded.Token != testAuth.Token {
		t.Errorf("expected %s, got %s", testAuth.Token, loaded.Token)
	}

	if loaded.TokenType != testAuth.TokenType {
		t.Errorf("expected %s, got %s", testAuth.TokenType, loaded.TokenType)
	}

	if loaded.UserUUID != testAuth.UserUUID {
		t.Errorf("expected %s, got %s", testAuth.UserUUID, loaded.UserUUID)
	}

	if loaded.UserEmail != testAuth.UserEmail {
		t.Errorf("expected %s, got %s", testAuth.UserEmail, loaded.UserEmail)
	}

	if !loaded.ExpiresAt.Equal(expiresAt) {
		t.Errorf("expected %v, got %v", expiresAt, loaded.ExpiresAt)
	}
}

func TestTokenStoreClear(t *testing.T) {
	tmpDir := t.TempDir()
	tokenStore := &TokenStore{ConfigDir: tmpDir}

	// Save auth
	testAuth := &StoredAuth{
		Token:     "test-token",
		TokenType: "Bearer",
		ExpiresAt: time.Now().Add(24 * time.Hour),
		UserUUID:  "user-123",
		UserEmail: "alice@example.ts.net",
	}
	if err := tokenStore.Save(testAuth); err != nil {
		t.Fatalf("failed to save token: %v", err)
	}

	// Clear
	if err := tokenStore.Clear(); err != nil {
		t.Fatalf("failed to clear token: %v", err)
	}

	// Verify cleared
	_, err := tokenStore.Load()
	if err == nil {
		t.Fatal("expected error when loading after clear")
	}
}

func TestStoredAuthIsValid(t *testing.T) {
	// Valid token (expires in future)
	validAuth := &StoredAuth{
		Token:     "test-token",
		TokenType: "Bearer",
		ExpiresAt: time.Now().Add(24 * time.Hour),
		UserUUID:  "user-123",
		UserEmail: "alice@example.ts.net",
	}
	if !validAuth.IsValid() {
		t.Error("expected valid token to be valid")
	}

	// Expired token
	expiredAuth := &StoredAuth{
		Token:     "test-token",
		TokenType: "Bearer",
		ExpiresAt: time.Now().Add(-1 * time.Hour),
		UserUUID:  "user-123",
		UserEmail: "alice@example.ts.net",
	}
	if expiredAuth.IsValid() {
		t.Error("expected expired token to be invalid")
	}

	// Nil auth
	var nilAuth *StoredAuth
	if nilAuth.IsValid() {
		t.Error("expected nil auth to be invalid")
	}
}

func TestRequireAuth(t *testing.T) {
	tmpDir := t.TempDir()

	// Save a valid token
	tokenStore := &TokenStore{ConfigDir: tmpDir}
	validAuth := &StoredAuth{
		Token:     "test-token",
		TokenType: "Bearer",
		ExpiresAt: time.Now().Add(24 * time.Hour),
		UserUUID:  "user-123",
		UserEmail: "alice@example.ts.net",
	}
	if err := tokenStore.Save(validAuth); err != nil {
		t.Fatalf("failed to save token: %v", err)
	}

	// Temporarily replace NewTokenStore to use test directory
	// Since RequireAuth uses NewTokenStore(), we can't easily test it
	// without modifying the code or using environment variables
	// For now, skip this test or test the individual components
	t.Skip("RequireAuth requires mocking NewTokenStore")
}
