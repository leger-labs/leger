package daemon

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"
)

// Client communicates with legerd daemon
type Client struct {
	baseURL    string
	httpClient *http.Client
}

// NewClient creates a new legerd client
func NewClient(baseURL string) *Client {
	if baseURL == "" {
		baseURL = "http://localhost:8080"
	}

	return &Client{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// Health checks if legerd is running
func (c *Client) Health(ctx context.Context) error {
	req, err := http.NewRequestWithContext(ctx, "GET", c.baseURL+"/health", nil)
	if err != nil {
		return err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("legerd not reachable: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("legerd health check failed: %d", resp.StatusCode)
	}

	return nil
}

// Secret represents a secret from legerd
type Secret struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

// GetSecret retrieves a secret from legerd
func (c *Client) GetSecret(ctx context.Context, name string) (string, error) {
	u := fmt.Sprintf("%s/api/get?name=%s", c.baseURL, url.QueryEscape(name))

	req, err := http.NewRequestWithContext(ctx, "GET", u, nil)
	if err != nil {
		return "", err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to get secret: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusNotFound {
		return "", fmt.Errorf("secret not found: %s", name)
	}

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("legerd error: %d: %s", resp.StatusCode, string(body))
	}

	var secret Secret
	if err := json.NewDecoder(resp.Body).Decode(&secret); err != nil {
		return "", fmt.Errorf("failed to decode response: %w", err)
	}

	return secret.Value, nil
}

// PutSecret stores a secret in legerd
func (c *Client) PutSecret(ctx context.Context, name, value string) error {
	secret := Secret{
		Name:  name,
		Value: value,
	}

	body, err := json.Marshal(secret)
	if err != nil {
		return err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", c.baseURL+"/api/put", bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to put secret: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		respBody, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("legerd error: %d: %s", resp.StatusCode, string(respBody))
	}

	return nil
}

// ListSecrets returns all secret names
func (c *Client) ListSecrets(ctx context.Context) ([]string, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", c.baseURL+"/api/list", nil)
	if err != nil {
		return nil, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to list secrets: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("legerd error: %d: %s", resp.StatusCode, string(body))
	}

	var secrets []string
	if err := json.NewDecoder(resp.Body).Decode(&secrets); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return secrets, nil
}
