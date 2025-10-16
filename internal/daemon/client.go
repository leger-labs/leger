package daemon

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/tailscale/setec/client/setec"
	"github.com/tailscale/setec/types/api"
)

// Client wraps setec.Client to communicate with legerd daemon
type Client struct {
	setecClient setec.Client
	baseURL     string
}

// NewClient creates a new legerd client wrapping setec.Client
func NewClient(baseURL string) *Client {
	if baseURL == "" {
		baseURL = "http://localhost:8080"
	}

	return &Client{
		setecClient: setec.Client{
			Server: baseURL,
		},
		baseURL: baseURL,
	}
}

// SetecClient returns the underlying setec.Client for advanced operations
func (c *Client) SetecClient() setec.Client {
	return c.setecClient
}

// Health checks if legerd is running by attempting to list secrets
func (c *Client) Health(ctx context.Context) error {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	// Try to list secrets as a health check
	_, err := c.setecClient.List(ctx)
	if err != nil {
		return fmt.Errorf("legerd not reachable: %w", err)
	}

	return nil
}

// GetSecret retrieves a secret value from legerd
func (c *Client) GetSecret(ctx context.Context, name string) ([]byte, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	secret, err := c.setecClient.Get(ctx, name)
	if err != nil {
		if err == api.ErrNotFound {
			return nil, fmt.Errorf("secret not found: %s", name)
		}
		return nil, fmt.Errorf("failed to get secret: %w", err)
	}

	return secret.Value, nil
}

// PutSecret stores a secret in legerd
func (c *Client) PutSecret(ctx context.Context, name string, value []byte) (api.SecretVersion, error) {
	ctx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	version, err := c.setecClient.Put(ctx, name, value)
	if err != nil {
		return 0, fmt.Errorf("failed to put secret: %w", err)
	}

	return version, nil
}

// ListSecrets returns information about all secrets
func (c *Client) ListSecrets(ctx context.Context) ([]*api.SecretInfo, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	secrets, err := c.setecClient.List(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list secrets: %w", err)
	}

	return secrets, nil
}

// InfoSecret returns metadata for a specific secret
func (c *Client) InfoSecret(ctx context.Context, name string) (*api.SecretInfo, error) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	info, err := c.setecClient.Info(ctx, name)
	if err != nil {
		if err == api.ErrNotFound {
			return nil, fmt.Errorf("secret not found: %s", name)
		}
		return nil, fmt.Errorf("failed to get secret info: %w", err)
	}

	return info, nil
}

// NewStore creates a setec.Store for secret management with AllowLookup enabled
func (c *Client) NewStore(ctx context.Context, secretNames []string) (*setec.Store, error) {
	config := setec.StoreConfig{
		Client:       c.setecClient,
		Secrets:      secretNames,
		AllowLookup:  true, // Critical for dynamic discovery
		PollInterval: -1,   // Disable automatic polling for CLI use
	}

	store, err := setec.NewStore(ctx, config)
	if err != nil {
		return nil, fmt.Errorf("failed to create store: %w", err)
	}

	return store, nil
}

// HealthHTTP performs a simple HTTP health check (for legacy compatibility)
func (c *Client) HealthHTTP(ctx context.Context) error {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, "GET", c.baseURL+"/debug/", nil)
	if err != nil {
		return err
	}

	client := &http.Client{Timeout: 3 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("legerd not reachable: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("legerd health check failed: %d", resp.StatusCode)
	}

	return nil
}
