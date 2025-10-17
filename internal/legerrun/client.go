package legerrun

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
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
	token      string // JWT token for authenticated requests
}

// NewClient creates a new leger.run API client
func NewClient() *Client {
	baseURL := BaseURL
	// Allow override via environment variable
	if envURL := os.Getenv("LEGER_API_URL"); envURL != "" {
		baseURL = envURL
	}

	return &Client{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// WithToken returns a new client with the JWT token set for authenticated requests
func (c *Client) WithToken(token string) *Client {
	return &Client{
		baseURL:    c.baseURL,
		httpClient: c.httpClient,
		token:      token,
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

// AuthResponse is the response from the authentication API
type AuthResponse struct {
	Success bool `json:"success"`
	Data    struct {
		Token     string `json:"token"`
		TokenType string `json:"token_type"`
		ExpiresIn int    `json:"expires_in"` // seconds
		UserUUID  string `json:"user_uuid"`
		User      struct {
			TailscaleEmail string `json:"tailscale_email"`
			DisplayName    string `json:"display_name"`
		} `json:"user"`
	} `json:"data"`
	Error   string `json:"error,omitempty"`
	Message string `json:"message,omitempty"`
}

// TailscaleIdentity represents the Tailscale identity sent to the backend
type TailscaleIdentity struct {
	UserID     string `json:"user_id"`
	LoginName  string `json:"login_name"`
	DeviceID   string `json:"device_id"`
	Hostname   string `json:"device_hostname"`
	Tailnet    string `json:"tailnet"`
}

// AuthenticateCLI authenticates the CLI with the leger.run backend using Tailscale identity
func (c *Client) AuthenticateCLI(ctx context.Context, identity TailscaleIdentity, cliVersion string) (*AuthResponse, error) {
	reqBody := map[string]interface{}{
		"tailscale": map[string]string{
			"user_id":         identity.UserID,
			"login_name":      identity.LoginName,
			"device_id":       identity.DeviceID,
			"device_hostname": identity.Hostname,
			"tailnet":         identity.Tailnet,
		},
		"cli_version": cliVersion,
	}

	var resp AuthResponse
	if err := c.post(ctx, "/auth/cli", reqBody, &resp); err != nil {
		return nil, err
	}

	if !resp.Success {
		if resp.Error != "" {
			return nil, ParseErrorCode(resp.Error)
		}
		return nil, fmt.Errorf("authentication failed")
	}

	return &resp, nil
}

// SecretMetadata represents metadata about a secret (without its value)
type SecretMetadata struct {
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Version   int       `json:"version"`
}

// SecretValue represents a secret with its value
type SecretValue struct {
	Name    string `json:"name"`
	Value   string `json:"value"`
	Version int    `json:"version"`
}

// SetSecretResult is the response from setting a secret
type SetSecretResult struct {
	Name      string    `json:"name"`
	Version   int       `json:"version"`
	UpdatedAt time.Time `json:"updated_at"`
	Message   string    `json:"message"`
}

// DeleteSecretResult is the response from deleting a secret
type DeleteSecretResult struct {
	Name      string    `json:"name"`
	DeletedAt time.Time `json:"deleted_at"`
}

// ListSecrets retrieves all secret metadata for the authenticated user
func (c *Client) ListSecrets(ctx context.Context) ([]SecretMetadata, error) {
	var resp struct {
		Success bool `json:"success"`
		Data    struct {
			Secrets []SecretMetadata `json:"secrets"`
		} `json:"data"`
		Error   string `json:"error,omitempty"`
		Message string `json:"message,omitempty"`
	}

	if err := c.get(ctx, "/secrets/list", &resp); err != nil {
		return nil, err
	}

	if !resp.Success {
		if resp.Error != "" {
			return nil, ParseErrorCode(resp.Error)
		}
		return nil, fmt.Errorf("failed to list secrets")
	}

	return resp.Data.Secrets, nil
}

// SetSecret creates or updates a secret
func (c *Client) SetSecret(ctx context.Context, name, value string) (*SetSecretResult, error) {
	reqBody := map[string]string{
		"name":  name,
		"value": value,
	}

	var resp struct {
		Success bool            `json:"success"`
		Data    SetSecretResult `json:"data"`
		Error   string          `json:"error,omitempty"`
		Message string          `json:"message,omitempty"`
	}

	if err := c.post(ctx, "/secrets/set", reqBody, &resp); err != nil {
		return nil, err
	}

	if !resp.Success {
		if resp.Error != "" {
			return nil, ParseErrorCode(resp.Error)
		}
		return nil, fmt.Errorf("failed to set secret")
	}

	return &resp.Data, nil
}

// GetSecret retrieves a secret's value
func (c *Client) GetSecret(ctx context.Context, name string) (*SecretValue, error) {
	var resp struct {
		Success bool        `json:"success"`
		Data    SecretValue `json:"data"`
		Error   string      `json:"error,omitempty"`
		Message string      `json:"message,omitempty"`
	}

	path := fmt.Sprintf("/secrets/get/%s", name)
	if err := c.get(ctx, path, &resp); err != nil {
		return nil, err
	}

	if !resp.Success {
		if resp.Error != "" {
			return nil, ParseErrorCode(resp.Error)
		}
		return nil, fmt.Errorf("failed to get secret")
	}

	return &resp.Data, nil
}

// DeleteSecret deletes a secret
func (c *Client) DeleteSecret(ctx context.Context, name string) (*DeleteSecretResult, error) {
	var resp struct {
		Success bool               `json:"success"`
		Data    DeleteSecretResult `json:"data"`
		Error   string             `json:"error,omitempty"`
		Message string             `json:"message,omitempty"`
	}

	path := fmt.Sprintf("/secrets/%s", name)
	if err := c.delete(ctx, path, &resp); err != nil {
		return nil, err
	}

	if !resp.Success {
		if resp.Error != "" {
			return nil, ParseErrorCode(resp.Error)
		}
		return nil, fmt.Errorf("failed to delete secret")
	}

	return &resp.Data, nil
}

// HTTP helper methods

func (c *Client) post(ctx context.Context, path string, body interface{}, result interface{}) error {
	return c.doRequest(ctx, "POST", path, body, result)
}

func (c *Client) get(ctx context.Context, path string, result interface{}) error {
	return c.doRequest(ctx, "GET", path, nil, result)
}

func (c *Client) delete(ctx context.Context, path string, result interface{}) error {
	return c.doRequest(ctx, "DELETE", path, nil, result)
}

func (c *Client) doRequest(ctx context.Context, method, path string, body interface{}, result interface{}) error {
	url := c.baseURL + path

	var bodyReader io.Reader
	if body != nil {
		bodyBytes, err := json.Marshal(body)
		if err != nil {
			return fmt.Errorf("failed to marshal request body: %w", err)
		}
		bodyReader = bytes.NewReader(bodyBytes)
	}

	req, err := http.NewRequestWithContext(ctx, method, url, bodyReader)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	// Add Authorization header if token is set
	if c.token != "" {
		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.token))
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	// Handle error responses
	if resp.StatusCode >= 400 {
		return c.handleHTTPError(resp)
	}

	// Decode response
	if result != nil {
		if err := json.NewDecoder(resp.Body).Decode(result); err != nil {
			return fmt.Errorf("failed to decode response: %w", err)
		}
	}

	return nil
}

// handleHTTPError provides specific handling for common HTTP errors
func (c *Client) handleHTTPError(resp *http.Response) error {
	// Special handling for 401 Unauthorized
	// Note: Even though v1.0 doesn't validate expiry client-side,
	// the server may still reject tokens
	if resp.StatusCode == http.StatusUnauthorized {
		return fmt.Errorf("authentication failed: token rejected by server\n\nRe-authenticate with: leger auth login")
	}

	// For other errors, parse the error response
	return c.handleErrorResponse(resp)
}

func (c *Client) handleErrorResponse(resp *http.Response) error {
	var errResp struct {
		Success bool   `json:"success"`
		Error   string `json:"error"`
		Message string `json:"message"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&errResp); err != nil {
		return fmt.Errorf("HTTP %d: %s", resp.StatusCode, resp.Status)
	}

	baseErr := ParseErrorCode(errResp.Error)
	if errResp.Message != "" {
		return fmt.Errorf("%w: %s", baseErr, errResp.Message)
	}
	return baseErr
}
