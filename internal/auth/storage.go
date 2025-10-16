package auth

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

// Auth represents stored authentication state
type Auth struct {
	TailscaleUser   string    `json:"tailscale_user"`
	Tailnet         string    `json:"tailnet"`
	DeviceName      string    `json:"device_name"`
	DeviceIP        string    `json:"device_ip"`
	AuthenticatedAt time.Time `json:"authenticated_at"`
}

// AuthFile returns the path to the auth file
func AuthFile() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("failed to get home directory: %w", err)
	}

	configDir := filepath.Join(home, ".config", "leger")
	if err := os.MkdirAll(configDir, 0700); err != nil {
		return "", fmt.Errorf("failed to create config directory: %w", err)
	}

	return filepath.Join(configDir, "auth.json"), nil
}

// Save saves authentication state to disk
func (a *Auth) Save() error {
	path, err := AuthFile()
	if err != nil {
		return err
	}

	data, err := json.MarshalIndent(a, "", "  ")
	if err != nil {
		return fmt.Errorf("failed to marshal auth: %w", err)
	}

	if err := os.WriteFile(path, data, 0600); err != nil {
		return fmt.Errorf("failed to write auth file: %w", err)
	}

	return nil
}

// Load loads authentication state from disk
func Load() (*Auth, error) {
	path, err := AuthFile()
	if err != nil {
		return nil, err
	}

	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil // Not authenticated
		}
		return nil, fmt.Errorf("failed to read auth file: %w", err)
	}

	var auth Auth
	if err := json.Unmarshal(data, &auth); err != nil {
		return nil, fmt.Errorf("failed to parse auth file: %w", err)
	}

	return &auth, nil
}

// Clear removes authentication state
func Clear() error {
	path, err := AuthFile()
	if err != nil {
		return err
	}

	if err := os.Remove(path); err != nil {
		if os.IsNotExist(err) {
			return nil // Already cleared
		}
		return fmt.Errorf("failed to remove auth file: %w", err)
	}

	return nil
}

// IsAuthenticated checks if user is authenticated
func IsAuthenticated() bool {
	auth, err := Load()
	return err == nil && auth != nil
}

// DeriveUUID derives a user UUID from the Tailscale user
// For now, this returns the Tailscale user directly
// In the future, this should query leger.run API for the mapped UUID
func (a *Auth) DeriveUUID() string {
	if a == nil {
		return ""
	}
	// TODO: Query leger.run API to get the proper UUID mapping
	// For now, use tailscale user as identifier
	return a.TailscaleUser
}
