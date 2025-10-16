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

// FetchManifest retrieves a manifest from leger.run for a specific version
// The manifest is fetched from static.leger.run/{userUUID}/{version}/manifest.json
func (c *Client) FetchManifest(ctx context.Context, userUUID, version string) ([]byte, error) {
	// Use static.leger.run for manifest fetching
	url := fmt.Sprintf("https://static.leger.run/%s/%s/manifest.json", userUUID, version)

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("creating request: %w", err)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("fetching manifest from leger.run: %w\n\nVerify connectivity:\n  curl %s\n\nVerify authentication:\n  leger auth status", err, url)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNotFound {
		return nil, fmt.Errorf("manifest not found at %s\n\nAvailable versions:\n  leger config versions", url)
	}

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("leger.run API error (status %d): %s", resp.StatusCode, string(body))
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("reading response: %w", err)
	}

	return data, nil
}

// ListVersions retrieves available versions for a user's deployment
// Returns a list of version identifiers (e.g., "latest", "v1.0.0", "v1.1.0")
func (c *Client) ListVersions(ctx context.Context, userUUID string) ([]string, error) {
	url := fmt.Sprintf("%s/v1/users/%s/versions", c.baseURL, userUUID)

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("creating request: %w", err)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("fetching versions: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("leger.run API error (status %d): %s", resp.StatusCode, string(body))
	}

	var response struct {
		Versions []string `json:"versions"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, fmt.Errorf("decoding response: %w", err)
	}

	return response.Versions, nil
}

// DownloadFile downloads a file from leger.run static hosting
func (c *Client) DownloadFile(ctx context.Context, url string) (*http.Response, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("creating request: %w", err)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("downloading file: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		resp.Body.Close()
		return nil, fmt.Errorf("file not found (status %d): %s", resp.StatusCode, url)
	}

	return resp, nil
}
