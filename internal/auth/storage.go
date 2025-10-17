package auth

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

// StoredAuth represents JWT token-based authentication from leger.run backend
// v1.0 NOTE: Token expiry is not enforced. Tokens remain valid until logout.
type StoredAuth struct {
	Token     string    `json:"token"`
	TokenType string    `json:"token_type"`
	ExpiresAt time.Time `json:"expires_at"` // Stored but not validated in v1.0
	UserUUID  string    `json:"user_uuid"`
	UserEmail string    `json:"user_email"`
}

// TokenStore handles JWT token storage
type TokenStore struct {
	ConfigDir string
}

// NewTokenStore creates a new token store with the default config directory
func NewTokenStore() *TokenStore {
	home, err := os.UserHomeDir()
	if err != nil {
		// Fallback to current directory if home is unavailable
		return &TokenStore{ConfigDir: ".local/share/leger"}
	}
	return &TokenStore{
		ConfigDir: filepath.Join(home, ".local", "share", "leger"),
	}
}

// Save saves the JWT token to disk
func (ts *TokenStore) Save(auth *StoredAuth) error {
	if err := os.MkdirAll(ts.ConfigDir, 0700); err != nil {
		return fmt.Errorf("failed to create config directory: %w", err)
	}

	path := filepath.Join(ts.ConfigDir, "auth.json")
	data, err := json.MarshalIndent(auth, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal auth: %w", err)
	}

	if err := os.WriteFile(path, data, 0600); err != nil {
		return fmt.Errorf("failed to write auth file: %w", err)
	}

	return nil
}

// Load loads the JWT token from disk
func (ts *TokenStore) Load() (*StoredAuth, error) {
	path := filepath.Join(ts.ConfigDir, "auth.json")
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, fmt.Errorf("not authenticated")
		}
		return nil, fmt.Errorf("failed to read auth file: %w", err)
	}

	var auth StoredAuth
	if err := json.Unmarshal(data, &auth); err != nil {
		return nil, fmt.Errorf("failed to parse auth file: %w", err)
	}

	return &auth, nil
}

// Clear removes the stored JWT token
func (ts *TokenStore) Clear() error {
	path := filepath.Join(ts.ConfigDir, "auth.json")
	if err := os.Remove(path); err != nil {
		if os.IsNotExist(err) {
			return nil // Already cleared
		}
		return fmt.Errorf("failed to remove auth file: %w", err)
	}
	return nil
}

// IsValid checks if authentication is present
// v1.0 NOTE: Does NOT validate token expiry - tokens never expire
// Expiry validation will be added in v1.1+ with automatic token refresh
func (sa *StoredAuth) IsValid() bool {
	if sa == nil {
		return false
	}

	// v1.0: Token is valid if it exists
	// TODO(v1.1): Add expiry validation with auto-refresh support
	return sa.Token != ""
}

// RequireAuth is a helper function that loads and validates authentication
// v1.0 NOTE: Does not check expiry - tokens remain valid until manual logout
func RequireAuth() (*StoredAuth, error) {
	tokenStore := NewTokenStore()
	auth, err := tokenStore.Load()
	if err != nil {
		return nil, fmt.Errorf("not authenticated\n\nAuthenticate with: leger auth login")
	}

	if !auth.IsValid() {
		return nil, fmt.Errorf("invalid authentication\n\nRe-authenticate with: leger auth login")
	}

	return auth, nil
}
