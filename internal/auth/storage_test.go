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
	// v1.0: Token with valid data (should always be valid regardless of expiry)
	validAuth := &StoredAuth{
		Token:     "test-token",
		TokenType: "Bearer",
		ExpiresAt: time.Now().Add(24 * time.Hour),
		UserUUID:  "user-123",
		UserEmail: "alice@example.ts.net",
	}
	if !validAuth.IsValid() {
		t.Error("v1.0: token with valid data should be valid")
	}

	// v1.0: Token with past expiry date (should still be valid)
	pastExpiryAuth := &StoredAuth{
		Token:     "test-token",
		TokenType: "Bearer",
		ExpiresAt: time.Now().Add(-1 * time.Hour), // "Expired" 1 hour ago
		UserUUID:  "user-123",
		UserEmail: "alice@example.ts.net",
	}
	if !pastExpiryAuth.IsValid() {
		t.Error("v1.0: token with past ExpiresAt should still be valid (expiry not enforced)")
	}

	// Empty token (should be INVALID)
	emptyAuth := &StoredAuth{
		Token:     "", // Empty token
		TokenType: "Bearer",
		ExpiresAt: time.Now().Add(24 * time.Hour),
		UserUUID:  "user-123",
		UserEmail: "alice@example.ts.net",
	}
	if emptyAuth.IsValid() {
		t.Error("v1.0: empty token should be invalid")
	}

	// Nil auth (should be INVALID)
	var nilAuth *StoredAuth
	if nilAuth.IsValid() {
		t.Error("v1.0: nil auth should be invalid")
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
