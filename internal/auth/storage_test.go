package auth

import (
	"testing"
	"time"
)

// Tests for JWT token storage

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
