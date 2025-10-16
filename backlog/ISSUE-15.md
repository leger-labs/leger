# Issue #15: Configuration & Multi-Source Support

## Overview

Implement manifest parsing, configuration management, and intelligent multi-source detection to support both leger.run-hosted repositories and generic Git repositories seamlessly.

## Scope

### 1. Manifest Parsing
- Parse leger.run `manifest.json` format
- Parse generic `.leger.yaml` format
- Auto-generate manifest when absent
- Validate manifest contents

### 2. Configuration Commands
- `leger config show` - Display current deployment configuration
- `leger config pull` - Fetch latest configuration from backend

### 3. Multi-Source Support
- Detect leger.run URLs vs generic Git
- Extract user UUID from Tailscale identity
- Auto-select appropriate source when no URL provided
- Handle both pre-rendered (leger.run) and raw (Git) quadlets

### 4. leger.run Backend Integration
- HTTP client with Tailscale authentication
- Manifest fetching from static.leger.run
- Secret metadata retrieval

---

## Reference Material for This Issue

### Primary Specification
- **`docs/LEGER-CLI-SPEC-FINAL.md`**
  - § 2.2 (Deployment Source Model)
  - § 2.3 (Secrets Architecture)
  - § 4.1 (Authentication Commands)
  - § 4.6 (Configuration Commands)
  - § 6 (Manifest Format)

### Implementation Patterns

**Manifest Format**:
- `docs/LEGER-CLI-SPEC-FINAL.md` § 6.1 (leger.run format)
- `docs/LEGER-CLI-SPEC-FINAL.md` § 6.1 (generic Git format)

**Multi-Source Detection**:
- `docs/quadlets/git-source-parser.nu` (lines 5-60) - URL parsing and source detection
- `docs/leger-cli-better-pq/leger-architecture.md` - Source handling strategy

**leger.run Integration**:
- `docs/leger-cli-better-pq/pq_replacement_strategy.md` § "Integration Strategy"

**Tailscale Integration**:
- Current `internal/tailscale/` implementation (already exists)
- Current `cmd/leger/auth.go` (already exists)

---

## Implementation Checklist

### Phase 1: Internal Package - leger.run Client (3-4 hours)

- [ ] Create `internal/legerrun/` package

- [ ] Implement `client.go`
  ```go
  type Client struct {
      HTTPClient *http.Client
      BaseURL    string
      UserUUID   string
  }
  
  func NewClient(userUUID string) (*Client, error) {
      // Use Tailscale for authentication
      // Set BaseURL to https://static.leger.run
  }
  
  func (c *Client) FetchManifest(version string) (*types.Manifest, error) {
      // GET https://static.leger.run/{uuid}/{version}/manifest.json
      // version can be "latest" or specific version
  }
  
  func (c *Client) ListVersions() ([]string, error) {
      // List available versions for user
  }
  ```

- [ ] Implement `manifest.go`
  ```go
  func ParseManifest(data []byte) (*types.Manifest, error) {
      // Parse leger.run manifest.json format
  }
  
  func ValidateManifest(m *types.Manifest) error {
      // Verify required fields
      // Check checksums format
      // Validate service definitions
  }
  ```

- [ ] Implement `secrets.go`
  ```go
  func (c *Client) FetchSecretMetadata() ([]SecretInfo, error) {
      // Get list of available secrets for user
      // Used by legerd for discovery
  }
  ```

### Phase 2: Manifest Types (1-2 hours)

- [ ] Enhance `pkg/types/manifest.go`
  ```go
  type Manifest struct {
      Version    int                 `json:"version" yaml:"version"`
      CreatedAt  time.Time          `json:"created_at" yaml:"created_at"`
      UserUUID   string             `json:"user_uuid,omitempty" yaml:"user_uuid,omitempty"`
      Services   []ServiceDefinition `json:"services" yaml:"services"`
      Volumes    []VolumeDefinition  `json:"volumes,omitempty" yaml:"volumes,omitempty"`
  }
  
  type ServiceDefinition struct {
      Name            string   `json:"name" yaml:"name"`
      QuadletFile     string   `json:"quadlet_file" yaml:"quadlet_file"`
      Checksum        string   `json:"checksum,omitempty" yaml:"checksum,omitempty"`
      Image           string   `json:"image,omitempty" yaml:"image,omitempty"`
      Ports           []string `json:"ports,omitempty" yaml:"ports,omitempty"`
      SecretsRequired []string `json:"secrets_required,omitempty" yaml:"secrets_required,omitempty"`
  }
  
  type VolumeDefinition struct {
      Name      string `json:"name" yaml:"name"`
      MountPath string `json:"mount_path,omitempty" yaml:"mount_path,omitempty"`
  }
  ```

- [ ] Add manifest parsing functions
  ```go
  func LoadManifestFromFile(path string) (*Manifest, error)
  func LoadManifestFromJSON(data []byte) (*Manifest, error)
  func LoadManifestFromYAML(data []byte) (*Manifest, error)
  func GenerateManifestFromQuadlets(quadletDir string) (*Manifest, error)
  ```

### Phase 3: Multi-Source Detection (2-3 hours)

- [ ] Enhance `internal/git/parser.go`
  ```go
  type SourceType int
  
  const (
      SourceTypeLegerRun SourceType = iota
      SourceTypeGitHub
      SourceTypeGitLab
      SourceTypeGenericGit
      SourceTypeLocal
  )
  
  func DetectSourceType(url string) SourceType {
      // Detect based on URL pattern:
      // - static.leger.run/{uuid}/... → SourceTypeLegerRun
      // - github.com/... → SourceTypeGitHub
      // - gitlab.com/... → SourceTypeGitLab
      // - file:// or local path → SourceTypeLocal
      // - others → SourceTypeGenericGit
  }
  
  func ExtractUserUUID(legerRunURL string) (string, error) {
      // Extract UUID from leger.run URL
      // Format: https://static.leger.run/{uuid}/...
  }
  ```
  Pattern: Port logic from `docs/quadlets/git-source-parser.nu` (lines 15-40)

- [ ] Implement smart source resolution
  ```go
  func ResolveSource(urlOrName string, userUUID string) (*Repository, error) {
      // If no URL provided, use leger.run default
      if urlOrName == "" {
          return &Repository{
              URL:        fmt.Sprintf("https://static.leger.run/%s/latest/", userUUID),
              SourceType: SourceTypeLegerRun,
          }, nil
      }
      
      // Detect and parse provided URL
      sourceType := DetectSourceType(urlOrName)
      // ... handle each source type
  }
  ```

### Phase 4: Manifest Auto-Discovery (2-3 hours)

- [ ] Implement manifest discovery in `internal/git/clone.go`
  ```go
  func DiscoverManifest(quadletDir string) (*types.Manifest, error) {
      // 1. Check for manifest.json (leger.run format)
      // 2. Check for .leger.yaml (generic format)
      // 3. If neither exists, generate from quadlet files
  }
  ```

- [ ] Implement auto-generation
  ```go
  func GenerateManifest(quadletDir string) (*types.Manifest, error) {
      // Scan for .container, .volume, .network, .pod files
      // Parse each for basic metadata
      // Extract ports from PublishPort directives
      // Extract secrets from Secret directives
      // Generate manifest structure
  }
  ```
  Pattern: Use file scanning from `docs/pq/pkg/quadlet/files.go:Find()`

### Phase 5: Configuration Commands (2-3 hours)

- [ ] Implement `leger config show`
  ```go
  // cmd/leger/config.go
  func configShowCmd() *cobra.Command {
      RunE: func(cmd *cobra.Command, args []string) error {
          // 1. Load deployment state
          // 2. Load current manifest
          // 3. Display formatted configuration:
          //    - Deployment name
          //    - Version
          //    - Source URL
          //    - Services list
          //    - Required secrets
          //    - Volumes
      }
  }
  ```

- [ ] Implement `leger config pull`
  ```go
  func configPullCmd() *cobra.Command {
      RunE: func(cmd *cobra.Command, args []string) error {
          // 1. Get user UUID from auth
          // 2. Create leger.run client
          // 3. Fetch latest manifest
          // 4. Display what changed
          // 5. Update local configuration
      }
  }
  ```

### Phase 6: Integration with Deploy Commands (1-2 hours)

- [ ] Update `leger deploy install` to use multi-source
  ```go
  // In cmd/leger/deploy.go
  func deployInstallCmd() *cobra.Command {
      RunE: func(cmd *cobra.Command, args []string) error {
          sourceURL := "" // Default to leger.run
          if len(args) > 0 {
              sourceURL = args[0]
          }
          
          // Get user UUID from auth
          auth, err := auth.Load()
          if err != nil {
              return fmt.Errorf("not authenticated: %w\nRun: leger auth login", err)
          }
          
          userUUID := auth.DeriveUUID() // Implement this
          
          // Resolve source
          repo, err := git.ResolveSource(sourceURL, userUUID)
          if err != nil {
              return err
          }
          
          // Handle based on source type
          switch repo.SourceType {
          case git.SourceTypeLegerRun:
              // Use leger.run client to fetch
              return installFromLegerRun(repo, userUUID)
          default:
              // Use git clone (existing logic from Issue #14)
              return installFromGit(repo)
          }
      }
  }
  ```

---

## Testing Checklist

### Unit Tests

- [ ] `internal/legerrun/client_test.go`
  - [ ] NewClient creates valid client
  - [ ] FetchManifest makes correct HTTP request
  - [ ] URL construction is correct
  - [ ] Handles HTTP errors gracefully

- [ ] `internal/legerrun/manifest_test.go`
  - [ ] ParseManifest parses leger.run format
  - [ ] ValidateManifest catches invalid manifests
  - [ ] Handles missing optional fields

- [ ] `pkg/types/manifest_test.go`
  - [ ] LoadManifestFromJSON works
  - [ ] LoadManifestFromYAML works
  - [ ] GenerateManifestFromQuadlets creates valid manifest
  - [ ] Both JSON and YAML formats supported

- [ ] `internal/git/parser_test.go` (extend from Issue #14)
  - [ ] DetectSourceType identifies leger.run URLs
  - [ ] DetectSourceType identifies GitHub URLs
  - [ ] DetectSourceType identifies GitLab URLs
  - [ ] ExtractUserUUID parses UUID correctly
  - [ ] ResolveSource handles no URL (defaults to leger.run)

### Integration Tests

- [ ] **Install from leger.run** (if test account available)
  ```bash
  # Requires: leger auth login completed
  leger deploy install
  # Should default to leger.run/{user-uuid}/latest/
  ```

- [ ] **Install with explicit leger.run URL**
  ```bash
  leger deploy install https://static.leger.run/{uuid}/v1.0.0/
  ```

- [ ] **Config commands**
  ```bash
  leger config show
  # Should display current deployment info
  
  leger config pull
  # Should fetch latest from leger.run
  ```

- [ ] **Manifest auto-discovery**
  ```bash
  # Test with repo that has manifest.json
  leger deploy install https://github.com/org/repo-with-manifest
  
  # Test with repo that has .leger.yaml
  leger deploy install https://github.com/org/repo-with-yaml
  
  # Test with repo that has neither (auto-generate)
  leger deploy install https://github.com/rgolangh/podman-quadlets/tree/main/nginx
  ```

### Manual Verification

```bash
# Prerequisite: Authentication
leger auth login
# Verify: Tailscale authenticated and user UUID stored

# Test 1: Default leger.run installation
leger deploy install myapp
# Expected: Fetches from https://static.leger.run/{uuid}/latest/myapp/
# Expected: Manifest loaded from manifest.json
# Expected: Quadlets installed

# Test 2: Config show
leger config show
# Expected: Displays deployment configuration
# Expected: Shows services, secrets, volumes

# Test 3: Config pull
leger config pull
# Expected: Fetches latest manifest from leger.run
# Expected: Shows if configuration changed

# Test 4: Install from GitHub with manifest
leger deploy install https://github.com/org/repo
# Expected: Detects as GitHub source
# Expected: Clones repository
# Expected: Loads manifest.json or .leger.yaml
# Expected: Installs quadlets

# Test 5: Install from GitHub without manifest
leger deploy install https://github.com/rgolangh/podman-quadlets/tree/main/nginx
# Expected: Auto-generates manifest from quadlet files
# Expected: Installs quadlets successfully
```

---

## Error Handling Examples

```go
// ✅ GOOD - Clear leger.run errors
client := legerrun.NewClient(userUUID)
manifest, err := client.FetchManifest("latest")
if err != nil {
    return fmt.Errorf(`Failed to fetch manifest from leger.run: %w

Verify connectivity:
  curl https://static.leger.run/%s/latest/manifest.json

Verify authentication:
  leger auth status

If the service is unavailable, try again later or use a Git repository:
  leger deploy install https://github.com/org/repo`, err, userUUID)
}

// ✅ GOOD - Source detection errors
sourceType := git.DetectSourceType(url)
if sourceType == git.SourceTypeUnknown {
    return fmt.Errorf(`Unable to determine source type for URL: %s

Supported formats:
  - leger.run: https://static.leger.run/{uuid}/latest/
  - GitHub: https://github.com/org/repo
  - GitLab: https://gitlab.com/org/repo
  - Local: /path/to/quadlets`, url)
}

// ✅ GOOD - Manifest errors
manifest, err := types.LoadManifestFromFile(path)
if err != nil {
    return fmt.Errorf(`Failed to load manifest: %w

Checking for manifest in:
  - manifest.json (leger.run format)
  - .leger.yaml (generic format)

If no manifest exists, one will be auto-generated from quadlet files.`, err)
}
```

---

## Acceptance Criteria

### Functionality
- [ ] Can fetch manifests from leger.run
- [ ] Can parse leger.run manifest.json format
- [ ] Can parse generic .leger.yaml format
- [ ] Can auto-generate manifest from quadlet files
- [ ] Detects source type correctly (leger.run vs Git)
- [ ] Defaults to leger.run when no URL provided
- [ ] `leger config show` displays deployment configuration
- [ ] `leger config pull` fetches latest from leger.run

### Multi-Source Support
- [ ] Installs from leger.run URLs
- [ ] Installs from GitHub URLs
- [ ] Installs from GitLab URLs
- [ ] Installs from local paths
- [ ] Handles URLs with tree paths
- [ ] Works without manifest (auto-generates)

### Code Quality
- [ ] leger.run client uses Tailscale authentication
- [ ] Source type detection is robust
- [ ] UUID extraction is validated
- [ ] Error messages are actionable
- [ ] All exported functions have docstrings
- [ ] Conventional commit messages used

### Testing
- [ ] All unit tests pass
- [ ] Integration tests pass with both sources
- [ ] Manifest parsing tested for all formats
- [ ] Auto-generation tested
- [ ] Manual verification completed

---

## Dependencies

- **Issue #14** - Requires deploy install infrastructure

---

## Estimated Effort

**Total**: 10-12 hours

- leger.run client: 3-4 hours
- Manifest types: 1-2 hours
- Multi-source detection: 2-3 hours
- Auto-discovery: 2-3 hours
- Config commands: 2-3 hours
- Integration: 1-2 hours
- Testing: Integrated throughout

---

## Notes

### Key Differences: leger.run vs Generic Git

**leger.run Source**:
- Pre-rendered quadlet files (no templating)
- manifest.json included (with checksums)
- UUID-based paths (authenticated via Tailscale)
- Versioning built-in (v1.0.0, latest)
- Secret metadata available

**Generic Git Source**:
- Raw quadlet files (may include templates - not our concern)
- Optional .leger.yaml metadata
- Public or authenticated Git access
- Branch-based versioning
- No secret metadata (legerd discovers from quadlets)

### UUID Derivation

User UUID comes from Tailscale identity:

```go
func DeriveUUID(tailscaleUser string) string {
    // leger.run backend derives UUID from Tailscale login
    // We need to implement same logic or fetch from leger.run API
    // For now, can be part of auth.Auth struct
}
```

### Manifest Priority

When discovering manifest:
1. Check for `manifest.json` (leger.run format)
2. Check for `.leger.yaml` (generic format)
3. Auto-generate from quadlet files

Always prefer explicit manifest over auto-generation.

### Configuration State

Store deployment configuration in `~/.local/share/leger/`:
- `deployments.yaml` - List of deployments with metadata
- `manifest.json` - Current active manifest

### Success Metrics

After this issue, users should be able to:

1. Install from leger.run with just `leger deploy install myapp`
2. Install from any Git repository
3. Have manifests automatically discovered or generated
4. View current deployment configuration
5. Pull latest configuration from leger.run
6. Experience seamless multi-source support

This issue bridges the gap between generic Git repositories and the leger.run backend, providing a unified experience. 🚀
