# Issue #20: leger.run Backend Integration - Authentication & Secrets CLI

## Overview

Implement CLI authentication and secret management commands that integrate with the leger.run backend API. This enables users to authenticate via Tailscale identity and manage secrets stored in Cloudflare KV.

**Architecture Decision Reference:** See `docs/leger-backend-architecture-decisions.md` for the complete rationale behind v0.1.0 CLI-only approach.

## Scope

### 1. Authentication Commands
- `leger auth login` - Authenticate with leger.run via Tailscale identity
- `leger auth status` - Show authentication status
- `leger auth logout` - Clear stored credentials
- Token storage in `~/.config/leger/auth.json`

### 2. Secret Management Commands
- `leger secrets set <name> <value>` - Create or update secret on leger.run
- `leger secrets list` - List all secrets (metadata only)
- `leger secrets get <name>` - Retrieve secret value
- `leger secrets delete <name>` - Delete secret from leger.run

### 3. Backend HTTP Client
- HTTP client for leger.run API (`api.leger.run`)
- JWT token management
- Error handling for backend responses

---

## Reference Material

### Primary Specifications
- **`docs/leger-backend-architecture-decisions.md`**
  - § "v0.1.0 CLI-Only" architecture
  - § "API Endpoints (v0.1.0)" - Complete endpoint specifications
  - § "CLI Commands (v0.1.0)" - Expected command behavior
  - § "User Workflow (v0.1.0)" - End-to-end flow

### Existing Code to Build Upon
- ✅ `internal/tailscale/status.go` - Already reads Tailscale identity
- ✅ `cmd/leger/auth.go` - Basic auth command structure exists
- ✅ `internal/legerrun/client.go` - HTTP client foundation exists (from Issue #15)

---

## Implementation Checklist

### Phase 1: Authentication Infrastructure

- [ ] Create `internal/auth/` package for token management

- [ ] Implement `token.go`
  ```go
  type TokenStore struct {
      ConfigDir string // ~/.config/leger/
  }
  
  type StoredAuth struct {
      Token     string    `json:"token"`
      TokenType string    `json:"token_type"`
      ExpiresAt time.Time `json:"expires_at"`
      UserUUID  string    `json:"user_uuid"`
      UserEmail string    `json:"user_email"`
  }
  
  func (s *TokenStore) Save(auth *StoredAuth) error
  func (s *TokenStore) Load() (*StoredAuth, error)
  func (s *TokenStore) Clear() error
  func (s *StoredAuth) IsValid() bool // Check expiry
  ```

- [ ] Implement `cmd/leger/auth.go:loginCmd()`
  ```go
  func loginCmd() *cobra.Command {
      return &cobra.Command{
          Use:   "login",
          Short: "Authenticate with leger.run",
          Long: `Authenticate CLI with leger.run backend using Tailscale identity.

Workflow:
  1. Reads your Tailscale identity locally
  2. Sends to leger.run for verification
  3. Receives and stores authentication token

Requires:
  - Active Tailscale connection
  - Account linked at app.leger.run (v0.2.0)`,
          RunE: func(cmd *cobra.Command, args []string) error {
              // 1. Check Tailscale is running
              status, err := tailscale.Status()
              if err != nil {
                  return fmt.Errorf("Tailscale not running: %w\n\nStart Tailscale:\n  sudo tailscale up", err)
              }
              
              // 2. Extract identity
              identity := tailscale.Identity{
                  UserID:   status.Self.UserID,
                  LoginName: status.Self.LoginName,
                  DeviceID: status.Self.ID,
                  Hostname: status.Self.HostName,
                  Tailnet:  status.CurrentTailnet.Name,
              }
              
              // 3. Call leger.run backend
              client := legerrun.NewClient()
              auth, err := client.AuthenticateCLI(identity)
              if err != nil {
                  // Check for specific error codes
                  if errors.Is(err, legerrun.ErrAccountNotLinked) {
                      return fmt.Errorf(`Tailscale account not linked to leger.run

Visit https://app.leger.run to link your account
(Web UI will be available in v0.2.0 with device code authentication)

For now, leger.run backend will accept any authenticated Tailscale user.`)
                  }
                  return fmt.Errorf("authentication failed: %w", err)
              }
              
              // 4. Store token
              tokenStore := auth.NewTokenStore()
              if err := tokenStore.Save(auth); err != nil {
                  return fmt.Errorf("failed to save token: %w", err)
              }
              
              // 5. Display success
              fmt.Printf("✓ Authenticated as %s\n", ui.Success(auth.UserEmail))
              fmt.Printf("  User UUID: %s\n", auth.UserUUID)
              fmt.Printf("  Tailnet: %s\n", identity.Tailnet)
              fmt.Printf("  Token expires: %s\n", auth.ExpiresAt.Format(time.RFC3339))
              
              return nil
          },
      }
  }
  ```

- [ ] Implement `cmd/leger/auth.go:statusCmd()`
  ```go
  func statusCmd() *cobra.Command {
      return &cobra.Command{
          Use:   "status",
          Short: "Show authentication status",
          RunE: func(cmd *cobra.Command, args []string) error {
              tokenStore := auth.NewTokenStore()
              auth, err := tokenStore.Load()
              if err != nil {
                  fmt.Println("Not authenticated")
                  fmt.Println("\nAuthenticate with: leger auth login")
                  return nil
              }
              
              if !auth.IsValid() {
                  fmt.Println(ui.Warning("Token expired"))
                  fmt.Println("\nRe-authenticate with: leger auth login")
                  return nil
              }
              
              fmt.Println(ui.Success("Authenticated"))
              fmt.Printf("  User: %s\n", auth.UserEmail)
              fmt.Printf("  UUID: %s\n", auth.UserUUID)
              fmt.Printf("  Expires: %s\n", auth.ExpiresAt.Format(time.RFC3339))
              
              return nil
          },
      }
  }
  ```

- [ ] Implement `cmd/leger/auth.go:logoutCmd()`
  ```go
  func logoutCmd() *cobra.Command {
      return &cobra.Command{
          Use:   "logout",
          Short: "Clear authentication credentials",
          RunE: func(cmd *cobra.Command, args []string) error {
              tokenStore := auth.NewTokenStore()
              if err := tokenStore.Clear(); err != nil {
                  return err
              }
              fmt.Println("✓ Logged out")
              return nil
          },
      }
  }
  ```

### Phase 2: Backend HTTP Client

- [ ] Enhance `internal/legerrun/client.go`
  ```go
  type Client struct {
      BaseURL    string // https://api.leger.run or https://app.leger.run/api
      HTTPClient *http.Client
      Token      string // JWT token from auth
  }
  
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
  }
  
  func NewClient() *Client {
      return &Client{
          BaseURL: "https://api.leger.run", // or from env var
          HTTPClient: &http.Client{Timeout: 10 * time.Second},
      }
  }
  
  func (c *Client) WithToken(token string) *Client {
      c.Token = token
      return c
  }
  
  func (c *Client) AuthenticateCLI(identity tailscale.Identity) (*StoredAuth, error) {
      req := map[string]interface{}{
          "tailscale": map[string]string{
              "user_id":         identity.UserID,
              "login_name":      identity.LoginName,
              "device_id":       identity.DeviceID,
              "device_hostname": identity.Hostname,
              "tailnet":         identity.Tailnet,
          },
          "cli_version": version.Version,
      }
      
      var resp AuthResponse
      if err := c.post("/auth/cli", req, &resp); err != nil {
          return nil, err
      }
      
      if !resp.Success {
          return nil, fmt.Errorf("authentication failed")
      }
      
      // Convert to StoredAuth
      expiresAt := time.Now().Add(time.Duration(resp.Data.ExpiresIn) * time.Second)
      return &auth.StoredAuth{
          Token:     resp.Data.Token,
          TokenType: resp.Data.TokenType,
          ExpiresAt: expiresAt,
          UserUUID:  resp.Data.UserUUID,
          UserEmail: resp.Data.User.TailscaleEmail,
      }, nil
  }
  
  func (c *Client) post(path string, body, result interface{}) error {
      // JSON encode body
      // POST to c.BaseURL + path
      // Add Authorization header if c.Token set
      // Decode response
      // Handle error codes (403, 401, etc.)
  }
  
  func (c *Client) get(path string, result interface{}) error {
      // Similar to post
  }
  
  func (c *Client) delete(path string, result interface{}) error {
      // Similar to post/get
  }
  ```

### Phase 3: Secret Management Commands

- [ ] Create `cmd/leger/secrets.go` (new file, supersedes old secrets.go from v0.1.0 setec)
  ```go
  package main
  
  import (
      "fmt"
      "github.com/spf13/cobra"
      "your-module/internal/auth"
      "your-module/internal/legerrun"
      "your-module/internal/ui"
  )
  
  func secretsCmd() *cobra.Command {
      cmd := &cobra.Command{
          Use:   "secrets",
          Short: "Manage secrets on leger.run",
          Long: `Manage secrets stored in leger.run backend.

Secrets are encrypted at rest in Cloudflare KV and synced to
local deployments via legerd.`,
      }
      
      cmd.AddCommand(
          secretsSetCmd(),
          secretsListCmd(),
          secretsGetCmd(),
          secretsDeleteCmd(),
      )
      
      return cmd
  }
  ```

- [ ] Implement `secretsSetCmd()`
  ```go
  func secretsSetCmd() *cobra.Command {
      return &cobra.Command{
          Use:   "set <name> <value>",
          Short: "Create or update a secret",
          Long: `Set a secret value in leger.run backend.

Examples:
  # Set from argument
  leger secrets set openai_api_key sk-proj-abc123...
  
  # Set from stdin (for security)
  echo "sk-proj-abc123..." | leger secrets set openai_api_key -
  
  # Set from file
  leger secrets set ssh_key @~/.ssh/id_rsa`,
          Args: cobra.ExactArgs(2),
          RunE: func(cmd *cobra.Command, args []string) error {
              name := args[0]
              value := args[1]
              
              // Handle special cases
              if value == "-" {
                  // Read from stdin
                  scanner := bufio.NewScanner(os.Stdin)
                  if scanner.Scan() {
                      value = scanner.Text()
                  }
              } else if strings.HasPrefix(value, "@") {
                  // Read from file
                  filepath := strings.TrimPrefix(value, "@")
                  data, err := os.ReadFile(filepath)
                  if err != nil {
                      return fmt.Errorf("failed to read file: %w", err)
                  }
                  value = string(data)
              }
              
              // Get auth token
              tokenStore := auth.NewTokenStore()
              storedAuth, err := tokenStore.Load()
              if err != nil {
                  return fmt.Errorf("not authenticated: %w\n\nAuthenticate with: leger auth login", err)
              }
              
              if !storedAuth.IsValid() {
                  return fmt.Errorf("token expired\n\nRe-authenticate with: leger auth login")
              }
              
              // Call backend
              client := legerrun.NewClient().WithToken(storedAuth.Token)
              result, err := client.SetSecret(name, value)
              if err != nil {
                  return fmt.Errorf("failed to set secret: %w", err)
              }
              
              fmt.Printf("✓ Secret %s\n", ui.Success(result.Message))
              fmt.Printf("  Name: %s\n", name)
              fmt.Printf("  Version: %d\n", result.Version)
              fmt.Printf("  Updated: %s\n", result.UpdatedAt.Format(time.RFC3339))
              
              return nil
          },
      }
  }
  ```

- [ ] Implement `secretsListCmd()`
  ```go
  func secretsListCmd() *cobra.Command {
      return &cobra.Command{
          Use:   "list",
          Short: "List all secrets",
          Long: `List all secrets (metadata only, values not shown).

Shows secret names, creation dates, and version numbers.`,
          RunE: func(cmd *cobra.Command, args []string) error {
              // Get auth
              tokenStore := auth.NewTokenStore()
              storedAuth, err := tokenStore.Load()
              if err != nil {
                  return fmt.Errorf("not authenticated: %w\n\nAuthenticate with: leger auth login", err)
              }
              
              // Call backend
              client := legerrun.NewClient().WithToken(storedAuth.Token)
              secrets, err := client.ListSecrets()
              if err != nil {
                  return fmt.Errorf("failed to list secrets: %w", err)
              }
              
              if len(secrets) == 0 {
                  fmt.Println("No secrets configured")
                  fmt.Println("\nAdd secrets with: leger secrets set <name> <value>")
                  return nil
              }
              
              // Format as table
              table := ui.NewTable()
              table.SetHeader([]string{"Name", "Created", "Updated", "Version"})
              
              for _, s := range secrets {
                  table.Append([]string{
                      s.Name,
                      s.CreatedAt.Format("2006-01-02"),
                      s.UpdatedAt.Format("2006-01-02"),
                      fmt.Sprintf("%d", s.Version),
                  })
              }
              
              table.Render()
              fmt.Printf("\nTotal: %d secrets\n", len(secrets))
              
              return nil
          },
      }
  }
  ```

- [ ] Implement `secretsGetCmd()`
  ```go
  func secretsGetCmd() *cobra.Command {
      return &cobra.Command{
          Use:   "get <name>",
          Short: "Retrieve secret value",
          Long: `Get the value of a secret.

Prints to stdout for use in scripts.

Examples:
  # View secret
  leger secrets get openai_api_key
  
  # Export to environment
  export OPENAI_KEY=$(leger secrets get openai_api_key)
  
  # Use in script
  curl -H "Authorization: Bearer $(leger secrets get api_key)" api.example.com`,
          Args: cobra.ExactArgs(1),
          RunE: func(cmd *cobra.Command, args []string) error {
              name := args[0]
              
              // Get auth
              tokenStore := auth.NewTokenStore()
              storedAuth, err := tokenStore.Load()
              if err != nil {
                  return fmt.Errorf("not authenticated: %w\n\nAuthenticate with: leger auth login", err)
              }
              
              // Call backend
              client := legerrun.NewClient().WithToken(storedAuth.Token)
              secret, err := client.GetSecret(name)
              if err != nil {
                  return fmt.Errorf("failed to get secret: %w", err)
              }
              
              // Print to stdout (no newline for scripting)
              fmt.Print(secret.Value)
              
              return nil
          },
      }
  }
  ```

- [ ] Implement `secretsDeleteCmd()`
  ```go
  func secretsDeleteCmd() *cobra.Command {
      return &cobra.Command{
          Use:   "delete <name>",
          Short: "Delete a secret",
          Long: `Delete a secret from leger.run backend.

Warning: This is permanent and cannot be undone.

Flags:
  --force   Skip confirmation prompt`,
          Args: cobra.ExactArgs(1),
          RunE: func(cmd *cobra.Command, args []string) error {
              name := args[0]
              force := cmd.Flag("force").Changed
              
              // Confirm unless --force
              if !force {
                  if !ui.Confirm(fmt.Sprintf("Delete secret %q?", name)) {
                      fmt.Println("Cancelled")
                      return nil
                  }
              }
              
              // Get auth
              tokenStore := auth.NewTokenStore()
              storedAuth, err := tokenStore.Load()
              if err != nil {
                  return fmt.Errorf("not authenticated: %w\n\nAuthenticate with: leger auth login", err)
              }
              
              // Call backend
              client := legerrun.NewClient().WithToken(storedAuth.Token)
              result, err := client.DeleteSecret(name)
              if err != nil {
                  return fmt.Errorf("failed to delete secret: %w", err)
              }
              
              fmt.Printf("✓ Secret %s deleted\n", ui.Success(name))
              fmt.Printf("  Deleted at: %s\n", result.DeletedAt.Format(time.RFC3339))
              
              return nil
          },
      }
  }
  ```

- [ ] Add secret management methods to `internal/legerrun/client.go`
  ```go
  type SecretMetadata struct {
      Name      string    `json:"name"`
      CreatedAt time.Time `json:"created_at"`
      UpdatedAt time.Time `json:"updated_at"`
      Version   int       `json:"version"`
  }
  
  type SecretValue struct {
      Name    string `json:"name"`
      Value   string `json:"value"`
      Version int    `json:"version"`
  }
  
  type SetSecretResult struct {
      Name      string    `json:"name"`
      Version   int       `json:"version"`
      UpdatedAt time.Time `json:"updated_at"`
      Message   string    `json:"message"`
  }
  
  type DeleteSecretResult struct {
      Name      string    `json:"name"`
      DeletedAt time.Time `json:"deleted_at"`
  }
  
  func (c *Client) ListSecrets() ([]SecretMetadata, error) {
      var resp struct {
          Success bool `json:"success"`
          Data    struct {
              Secrets []SecretMetadata `json:"secrets"`
          } `json:"data"`
      }
      
      if err := c.get("/secrets/list", &resp); err != nil {
          return nil, err
      }
      
      return resp.Data.Secrets, nil
  }
  
  func (c *Client) SetSecret(name, value string) (*SetSecretResult, error) {
      req := map[string]string{
          "name":  name,
          "value": value,
      }
      
      var resp struct {
          Success bool            `json:"success"`
          Data    SetSecretResult `json:"data"`
      }
      
      if err := c.post("/secrets/set", req, &resp); err != nil {
          return nil, err
      }
      
      return &resp.Data, nil
  }
  
  func (c *Client) GetSecret(name string) (*SecretValue, error) {
      var resp struct {
          Success bool        `json:"success"`
          Data    SecretValue `json:"data"`
      }
      
      if err := c.get(fmt.Sprintf("/secrets/get/%s", name), &resp); err != nil {
          return nil, err
      }
      
      return &resp.Data, nil
  }
  
  func (c *Client) DeleteSecret(name string) (*DeleteSecretResult, error) {
      var resp struct {
          Success bool                `json:"success"`
          Data    DeleteSecretResult `json:"data"`
      }
      
      if err := c.delete(fmt.Sprintf("/secrets/%s", name), &resp); err != nil {
          return nil, err
      }
      
      return &resp.Data, nil
  }
  ```

### Phase 4: Integration with Existing Deploy Commands

- [ ] Update `leger deploy install` to fetch secrets if using leger.run source
  ```go
  // In cmd/leger/deploy.go:deployInstallCmd()
  
  // After determining source type:
  if repo.SourceType == git.SourceTypeLegerRun {
      // Get auth
      tokenStore := auth.NewTokenStore()
      storedAuth, err := tokenStore.Load()
      if err != nil {
          return fmt.Errorf("leger.run source requires authentication\n\nAuthenticate with: leger auth login")
      }
      
      // Fetch manifest and secrets from leger.run
      client := legerrun.NewClient().WithToken(storedAuth.Token)
      // ... existing leger.run logic
  }
  ```

- [ ] Add authentication check to relevant commands
  ```go
  // Helper function in internal/auth/
  func RequireAuth() (*StoredAuth, error) {
      tokenStore := NewTokenStore()
      auth, err := tokenStore.Load()
      if err != nil {
          return nil, fmt.Errorf("not authenticated\n\nAuthenticate with: leger auth login")
      }
      
      if !auth.IsValid() {
          return nil, fmt.Errorf("token expired\n\nRe-authenticate with: leger auth login")
      }
      
      return auth, nil
  }
  ```

### Phase 5: Error Handling & UX

- [ ] Define custom errors in `internal/legerrun/errors.go`
  ```go
  var (
      ErrAccountNotLinked         = errors.New("account_not_linked")
      ErrInvalidToken            = errors.New("invalid_token")
      ErrTailscaleVerificationFailed = errors.New("tailscale_verification_failed")
      ErrSecretNotFound          = errors.New("secret_not_found")
      ErrInsufficientPermissions = errors.New("insufficient_permissions")
  )
  
  func ParseErrorCode(code string) error {
      switch code {
      case "account_not_linked":
          return ErrAccountNotLinked
      case "invalid_token":
          return ErrInvalidToken
      case "tailscale_verification_failed":
          return ErrTailscaleVerificationFailed
      case "secret_not_found":
          return ErrSecretNotFound
      case "insufficient_permissions":
          return ErrInsufficientPermissions
      default:
          return fmt.Errorf("unknown error: %s", code)
      }
  }
  ```

- [ ] Enhance HTTP client error handling
  ```go
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
      return fmt.Errorf("%w: %s", baseErr, errResp.Message)
  }
  ```

---

## Testing Checklist

### Unit Tests

- [ ] `internal/auth/token_test.go`
  - [ ] Save/Load/Clear token works
  - [ ] IsValid checks expiry correctly
  - [ ] Handles missing/corrupted files

- [ ] `internal/legerrun/client_test.go`
  - [ ] AuthenticateCLI makes correct request
  - [ ] ListSecrets parses response
  - [ ] SetSecret/GetSecret/DeleteSecret work
  - [ ] Error handling correct

### Integration Tests (require test backend)

- [ ] `tests/integration/auth_test.go`
  ```go
  func TestAuthenticationFlow(t *testing.T) {
      // Requires: Test leger.run backend or mock
      // 1. Mock Tailscale status
      // 2. Call leger auth login
      // 3. Verify token stored
      // 4. Call leger auth status
      // 5. Verify shows authenticated
  }
  ```

- [ ] `tests/integration/secrets_test.go`
  ```go
  func TestSecretManagement(t *testing.T) {
      // Requires: Authenticated CLI
      // 1. leger secrets set test-key test-value
      // 2. leger secrets list (verify present)
      // 3. leger secrets get test-key (verify value)
      // 4. leger secrets delete test-key
      // 5. leger secrets list (verify absent)
  }
  ```

### Manual Verification

```bash
# Prerequisite: Tailscale running
sudo tailscale status

# Test authentication
leger auth login
# Expected: "✓ Authenticated as you@example.ts.net"

leger auth status
# Expected: Shows user, UUID, expiry

# Test secret management
leger secrets set openai_api_key sk-test-abc123
# Expected: "✓ Secret created successfully"

leger secrets list
# Expected: Table showing openai_api_key

leger secrets get openai_api_key
# Expected: sk-test-abc123 (no newline)

export KEY=$(leger secrets get openai_api_key)
echo $KEY
# Expected: sk-test-abc123

leger secrets delete openai_api_key
# Expected: Confirmation prompt, then deleted

# Test expired token
# (manually edit ~/.config/leger/auth.json to set expires_at in past)
leger secrets list
# Expected: "Token expired\n\nRe-authenticate with: leger auth login"

# Test logout
leger auth logout
# Expected: "✓ Logged out"

leger auth status
# Expected: "Not authenticated"
```

---

## Error Handling Examples

```go
// ✅ GOOD - Authentication errors
if !tailscale.IsRunning() {
    return fmt.Errorf(`Tailscale not running

Start Tailscale:
  sudo tailscale up

Verify status:
  tailscale status`)
}

// ✅ GOOD - Token expiry
if !auth.IsValid() {
    return fmt.Errorf(`Authentication token expired

Re-authenticate:
  leger auth login

Your token is valid for 30 days from authentication.`)
}

// ✅ GOOD - Backend errors
if errors.Is(err, legerrun.ErrAccountNotLinked) {
    return fmt.Errorf(`Your Tailscale account is not linked to leger.run

For v0.1.0: The backend accepts any authenticated Tailscale user.
For v0.2.0: You'll need to link your account at app.leger.run

This error should not occur in v0.1.0. Please report if you see this.`)
}

// ✅ GOOD - Secret not found
if errors.Is(err, legerrun.ErrSecretNotFound) {
    return fmt.Errorf(`Secret %q not found

List available secrets:
  leger secrets list

Create secret:
  leger secrets set %s <value>`, name, name)
}
```

---

## Acceptance Criteria

### Functionality
- [ ] Can authenticate with leger.run using Tailscale identity
- [ ] Can view authentication status
- [ ] Can logout and clear credentials
- [ ] Can create/update secrets on leger.run
- [ ] Can list all secrets (metadata only)
- [ ] Can retrieve secret values
- [ ] Can delete secrets
- [ ] Token automatically included in API requests
- [ ] Token expiry detected and handled

### Security
- [ ] Tokens stored securely in `~/.config/leger/`
- [ ] Token file permissions restricted (0600)
- [ ] Secrets never logged or displayed unintentionally
- [ ] HTTPS used for all API requests
- [ ] Expired tokens rejected

### User Experience
- [ ] Clear authentication flow
- [ ] Helpful error messages
- [ ] Success confirmations with details
- [ ] Secrets get command suitable for scripting
- [ ] Confirmation prompts for destructive operations

### Code Quality
- [ ] HTTP client properly handles errors
- [ ] All API responses validated
- [ ] Token management robust
- [ ] Conventional commits
- [ ] All exported functions documented

### Testing
- [ ] All unit tests pass
- [ ] Integration tests pass (with test backend)
- [ ] Manual verification completed
- [ ] Error scenarios tested

---

## Dependencies

- **Issue #14** - Core deployment infrastructure (for integration)
- **Issue #15** - Configuration & multi-source support (for leger.run client foundation)
- **Requires:** leger.run backend v0.1.0 deployed (see updated backend spec)

---

## Notes

### Token Storage Location

```
~/.config/leger/
├── auth.json         # JWT token and metadata
└── config.yaml       # Other CLI configuration (future)
```

### API Endpoint URLs

Development:
- Local: `http://localhost:8787`
- Dev: `https://dev.leger.run/api`

Production:
- `https://api.leger.run` or `https://app.leger.run/api`

Configure via environment variable:
```bash
export LEGER_API_URL=https://api.leger.run
```

### Secret Value Sources

Support multiple input methods:
- Direct argument: `leger secrets set key value`
- Stdin: `echo "value" | leger secrets set key -`
- File: `leger secrets set key @/path/to/file`

This enables secure workflows:
```bash
# Don't expose in shell history
read -s SECRET
echo $SECRET | leger secrets set my-key -
```

### Integration with legerd (Future)

v0.1.0: CLI manages secrets on leger.run only
v0.2.0+: legerd syncs secrets from leger.run to local Podman secrets

Flow:
```
User → leger secrets set → leger.run backend
                                ↓
                          (stored encrypted)
                                ↓
        legerd sync ← leger.run backend
                ↓
        Podman secrets
```

### v0.2.0 Preview Note

In v0.2.0, when webapp is added with device code flow:
- User can also manage secrets via web UI
- CLI authentication will generate device codes
- Both CLI and webapp use same backend API
- No changes to CLI secret commands needed

---

## Success Metrics

After completing this issue, users should be able to:

1. Authenticate CLI with leger.run using their Tailscale identity
2. Manage secrets entirely from CLI
3. Have secrets encrypted and stored in leger.run backend
4. Use secrets in scripts via `leger secrets get`
5. Clear authentication flow with good error messages
6. Be ready for v0.2.0 webapp integration (device code flow)

This implements the v0.1.0 CLI-only secret management as designed in the architectural decisions document. 🚀
