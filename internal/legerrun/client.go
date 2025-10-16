package legerrun

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

const (
	// BaseURL is the base URL for leger.run API
	BaseURL = "https://api.leger.run"
)

// Client handles communication with leger.run API
type Client struct {
	baseURL    string
	httpClient *http.Client
	// Tailscale authentication is handled automatically by the HTTP client
	// when running on a Tailscale network
}

// NewClient creates a new leger.run API client
func NewClient() *Client {
	return &Client{
		baseURL: BaseURL,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// Secret represents a secret from leger.run
type Secret struct {
	Name      string    `json:"name"`
	Value     string    `json:"value"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// SecretsResponse is the response from the secrets API
type SecretsResponse struct {
	Secrets []Secret `json:"secrets"`
}

// FetchSecrets retrieves all secrets for a user from leger.run
// The user is identified by their Tailscale UUID
func (c *Client) FetchSecrets(ctx context.Context, userUUID string) (map[string][]byte, error) {
	url := fmt.Sprintf("%s/v1/users/%s/secrets", c.baseURL, userUUID)

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("creating request: %w", err)
	}

	// The request will automatically use Tailscale authentication
	// when the client is on the tailnet
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("fetching secrets from leger.run: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("leger.run API error (status %d): %s", resp.StatusCode, string(body))
	}

	var response SecretsResponse
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, fmt.Errorf("decoding response: %w", err)
	}

	// Convert to map of name -> value
	secrets := make(map[string][]byte)
	for _, secret := range response.Secrets {
		secrets[secret.Name] = []byte(secret.Value)
	}

	return secrets, nil
}

// GetSecretVersion retrieves a specific version of a secret
func (c *Client) GetSecretVersion(ctx context.Context, userUUID, secretName string, version int) ([]byte, error) {
	url := fmt.Sprintf("%s/v1/users/%s/secrets/%s/versions/%d", c.baseURL, userUUID, secretName, version)

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("creating request: %w", err)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("fetching secret version: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNotFound {
		return nil, fmt.Errorf("secret not found: %s (version %d)", secretName, version)
	}

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("leger.run API error (status %d): %s", resp.StatusCode, string(body))
	}

	var secret Secret
	if err := json.NewDecoder(resp.Body).Decode(&secret); err != nil {
		return nil, fmt.Errorf("decoding response: %w", err)
	}

	return []byte(secret.Value), nil
}

// HealthCheck verifies connectivity to leger.run API
func (c *Client) HealthCheck(ctx context.Context) error {
	url := fmt.Sprintf("%s/health", c.baseURL)

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return fmt.Errorf("creating request: %w", err)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("health check failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("leger.run API unhealthy (status %d)", resp.StatusCode)
	}

	return nil
}
