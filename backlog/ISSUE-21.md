# System Prompt for Fixing Leger CI/CD Test Failures

## Mission
Fix all failing tests in the Leger project to achieve 100% passing CI/CD without disabling any checks or removing functionality. The goal is to fix root causes, not symptoms.

---

## Project Context

**Leger** is a deployment management system for AI infrastructure consisting of:
- `leger` CLI (Apache-2.0) - Manages Podman Quadlet deployments
- `legerd` daemon (BSD-3-Clause) - Fork of Tailscale's setec for secrets management
- Integration with Tailscale for authentication and secure networking

**Critical Dependencies:**
- Tailscale setec (upstream) - MUST maintain compatibility
- Podman - for container orchestration
- Systemd - for service management

**License Split:**
- `cmd/leger/` and `internal/` (except daemon) → Apache-2.0
- `cmd/legerd/` and setec-related packages → BSD-3-Clause

---

## Current Test Failures

### 🔴 CRITICAL: Build Failure in `internal/daemon/client_test.go`

**Error:**
```
internal/daemon/client_test.go:8:2: "github.com/tailscale/setec/client/setec" imported and not used (typecheck)
```

**Why This Matters:**
- This package is the bridge between `leger` CLI and `legerd` daemon
- It's how secrets get from Cloudflare → legerd → Podman
- Without proper tests, this critical path is unverified

**Architecture Context (from docs):**
```
leger CLI → internal/daemon.Client → HTTP → legerd:8080 → SQLite (encrypted)
                                              ↓
                                    Podman Secret Store
```

**What client.go Actually Does:**
```go
type Client struct {
    baseURL string  // http://localhost:8080
}

func (c *Client) StoreSecret(name, value string) error
func (c *Client) GetSecret(name string) (string, error)
func (c *Client) ListSecrets() ([]string, error)
```

---

### 🟡 SECONDARY: Integration Test Failures

**Error:**
```
exec: "leger": executable file not found in $PATH
```

**Failing Tests:**
- `TestBackupWorkflow`
- `TestBackupAll`
- `TestCompleteDeploymentWorkflow`
- `TestDryRun`
- `TestStagingWorkflow`
- `TestApplyStaged`

**All in:** `tests/integration/`

---

## Fix Strategy: Two-Phase Approach

### Phase 1: Fix `internal/daemon/client_test.go` (PRIORITY 1)

**Objective:** Write proper tests that actually USE the setec import meaningfully.

**Why the import exists:** The test file was likely created with the intention to test integration between leger's daemon client and setec's client library, but tests were never written.

**What Tests Should Cover:**

1. **HTTP Communication Tests** (using httptest)
   ```go
   func TestClient_StoreSecret(t *testing.T)
   func TestClient_GetSecret(t *testing.T)
   func TestClient_ListSecrets(t *testing.T)
   func TestClient_ErrorHandling(t *testing.T)
   ```

2. **Integration with Setec Client** (if applicable)
   - If the daemon client wraps or uses setec client, test that integration
   - If not directly using setec client, the import should be removed ONLY after confirming it's not needed

**Implementation Path:**

1. **First, examine `internal/daemon/client.go`** to understand what it does
2. **Check if it uses setec client anywhere** - look for:
   ```go
   import "github.com/tailscale/setec/client/setec"
   // ... anywhere in the actual implementation
   ```
3. **Decision tree:**
   - If `client.go` imports and uses setec → Write tests that verify that usage
   - If `client.go` does NOT import setec → Check if tests SHOULD use it for mocking/testing
   - If neither → Only then remove the unused import

**Test Template (use httptest for HTTP client tests):**
```go
package daemon_test

import (
    "net/http"
    "net/http/httptest"
    "testing"
    
    "github.com/tailscale/setec/internal/daemon"
)

func TestClient_StoreSecret(t *testing.T) {
    // Create mock legerd server
    server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        if r.Method != "POST" {
            t.Errorf("expected POST, got %s", r.Method)
        }
        if r.URL.Path != "/api/put" {
            t.Errorf("expected /api/put, got %s", r.URL.Path)
        }
        w.WriteHeader(http.StatusOK)
    }))
    defer server.Close()

    client := daemon.NewClientWithURL(server.URL)
    err := client.StoreSecret("test-key", "test-value")
    if err != nil {
        t.Fatalf("StoreSecret failed: %v", err)
    }
}
```

**Coverage Target:** >80% for `internal/daemon/client.go`

---

### Phase 2: Fix Integration Tests (PRIORITY 2)

**Root Cause:** Integration tests expect `leger` binary to be built and in PATH, but CI doesn't build it before running tests.

**Solution Options:**

**Option A: Build Binary in TestMain (Recommended)**
```go
// tests/integration/main_test.go
package integration

import (
    "os"
    "os/exec"
    "path/filepath"
    "testing"
)

var legerBinary string

func TestMain(m *testing.M) {
    // Build leger binary
    tmpDir, err := os.MkdirTemp("", "leger-test")
    if err != nil {
        panic(err)
    }
    defer os.RemoveAll(tmpDir)
    
    legerBinary = filepath.Join(tmpDir, "leger")
    
    cmd := exec.Command("go", "build", "-o", legerBinary, "../../cmd/leger")
    if output, err := cmd.CombinedOutput(); err != nil {
        panic(string(output))
    }
    
    // Add to PATH
    oldPath := os.Getenv("PATH")
    os.Setenv("PATH", tmpDir+":"+oldPath)
    defer os.Setenv("PATH", oldPath)
    
    // Run tests
    code := m.Run()
    os.Exit(code)
}
```

**Option B: Use go run (Simpler but Slower)**
```go
// Replace: exec.Command("leger", args...)
// With:    exec.Command("go", append([]string{"run", "../../cmd/leger"}, args...)...)
```

**Option C: Build in CI Before Tests (CI Change)**
```yaml
# .github/workflows/ci.yml
- name: Build binaries
  run: |
    go build -o leger ./cmd/leger
    go build -o legerd ./cmd/legerd

- name: Run tests
  env:
    PATH: ${{ github.workspace }}:${{ env.PATH }}
  run: go test -v -race -coverprofile=coverage.txt -covermode=atomic ./...
```

**Recommended:** Combine Option A + Option C for best results.

---

## Implementation Checklist

### Step 1: Investigate
```bash
# View the actual client.go to understand implementation
cat internal/daemon/client.go

# View the test file
cat internal/daemon/client_test.go

# Check if client.go imports setec
grep -n "setec" internal/daemon/client.go
```

### Step 2: Write Tests
```bash
# Create comprehensive tests for daemon client
# Target: 80%+ coverage
# Required tests:
#   - HTTP communication (using httptest)
#   - Error handling (network failures, 404s, 500s)
#   - Request/response formatting
#   - Authentication headers (if applicable)
```

### Step 3: Fix Integration Tests
```bash
# Add TestMain to build binary
# OR update CI workflow
# Verify with: cd tests/integration && go test -v
```

### Step 4: Verify
```bash
# All linters pass
golangci-lint run --timeout=5m

# All tests pass
go test -v -race ./...

# Check coverage
go test -coverprofile=coverage.txt -covermode=atomic ./...
go tool cover -html=coverage.txt
```

---

## What NOT To Do

### ❌ DON'T: Remove unused import without investigation
```go
// BAD: Just deleting this line
- import "github.com/tailscale/setec/client/setec"
```

### ❌ DON'T: Skip tests to make them pass
```go
// BAD
func TestClient_StoreSecret(t *testing.T) {
    t.Skip("TODO: implement")
}
```

### ❌ DON'T: Disable linter rules
```yaml
# BAD: .golangci.yml
linters:
  disable:
    - typecheck  # Don't do this!
```

### ❌ DON'T: Change integration tests to not require binary
```go
// BAD: Mocking everything instead of testing real binary
// Integration tests SHOULD test the real binary
```

---

## What TO Do

### ✅ DO: Write meaningful tests
```go
// GOOD: Tests that verify actual functionality
func TestClient_StoreSecret(t *testing.T) {
    // Test with mock HTTP server
    // Verify correct HTTP method, path, body
    // Test error cases
}
```

### ✅ DO: Build binary for integration tests
```go
// GOOD: TestMain that builds binary
func TestMain(m *testing.M) {
    // Build leger
    // Run tests
    // Cleanup
}
```

### ✅ DO: Improve test coverage
```go
// GOOD: Comprehensive test suite
// - Happy path
// - Error cases
// - Edge cases
// - Concurrent access (if applicable)
```

### ✅ DO: Document decisions
```go
// GOOD: Comments explaining why
// StoreSecret tests verify HTTP communication with legerd.
// We use httptest to avoid requiring a running daemon.
```

---

## Expected Outcome

After completing this work, you should be able to run:

```bash
# Linter passes
$ golangci-lint run
[No issues found]

# All tests pass
$ go test -v ./...
ok      github.com/tailscale/setec/internal/daemon     1.234s
ok      github.com/tailscale/setec/tests/integration   5.678s
[All packages pass]

# CI passes
✓ Lint
✓ Test  
✓ Build
✓ Security
```

---

## Files to Modify

### Primary Targets
1. `internal/daemon/client_test.go` - Add comprehensive tests
2. `tests/integration/main_test.go` - Add TestMain (create if doesn't exist)
3. `.github/workflows/ci.yml` - Add binary build step

### Reference Files (Read Only)
- `internal/daemon/client.go` - Understand implementation
- `cmd/leger/secrets.go` - See how daemon client is used
- `docs/leger-cli-legerd-architecture.md` - Architecture reference

### Verify Changes In
- All `internal/daemon/*_test.go` files
- All `tests/integration/*_test.go` files

---

## Architecture Requirements

### Daemon Client Communication Pattern
```
leger CLI calls:
  client := daemon.NewClient()
  client.StoreSecret("name", "value")

Client does internally:
  POST http://localhost:8080/api/put
  {
    "name": "leger/<user-uuid>/<secret-name>",
    "value": "<base64-encoded-value>"
  }

legerd receives:
  Stores encrypted in /var/lib/legerd/secrets.db

Podman reads via:
  Secret=<name>,type=env,target=ENV_VAR
```

### Test Requirements
- **Unit tests:** Mock HTTP with httptest
- **Integration tests:** Use real binary, real HTTP
- **Coverage:** >75% overall, >80% for daemon package
- **No flaky tests:** All tests must pass consistently

---

## Success Criteria

### Must Have
- ✅ `golangci-lint run` exits 0
- ✅ `go test ./...` exits 0  
- ✅ All integration tests pass
- ✅ Coverage for `internal/daemon` > 80%
- ✅ No skipped tests (except documented reasons)
- ✅ CI/CD pipeline fully green

### Should Have
- ✅ Test documentation explaining what's tested
- ✅ Clear error messages in test failures
- ✅ Fast test execution (<10s for unit tests)
- ✅ Integration tests properly isolated

### Nice to Have
- ✅ Table-driven tests for multiple scenarios
- ✅ Parallel test execution where safe
- ✅ Benchmark tests for performance-critical paths

---

## Debugging Tips

### If tests still fail after fixing:

```bash
# Check if setec import is actually needed
cd internal/daemon
grep -r "setec" *.go

# Verify HTTP communication
# Add debug logging in tests:
t.Logf("Request: %+v", req)
t.Logf("Response: %+v", resp)

# Test manually
go build -o leger ./cmd/leger
go build -o legerd ./cmd/legerd
./legerd &  # Start daemon
./leger secrets sync  # Test CLI

# Check binary location
which leger
echo $PATH
```

### If integration tests still fail:

```bash
# Build manually
go build -o /tmp/leger ./cmd/leger

# Run with binary in PATH
PATH=/tmp:$PATH go test ./tests/integration/...

# Check TestMain execution
go test -v ./tests/integration/... 2>&1 | head -20
```

---

## Final Notes

**Remember:**
- Leger depends on setec - treat it carefully
- Tests should document AND verify behavior
- Integration tests need the real binary
- Coverage is important but not at expense of quality
- Green CI is the goal, not disabled checks

**Philosophy:**
- Fix root causes, not symptoms
- Write tests that would catch real bugs  
- Make the code testable, don't fake the tests
- Document architectural decisions

**When Done:**
Report back with:
1. What was broken and why
2. What you fixed and how
3. Test output showing all pass
4. Coverage improvements
5. Any architectural insights discovered

---

## Quick Start Commands

```bash
# 1. Check current state
golangci-lint run ./internal/daemon
go test -v ./internal/daemon
go test -v ./tests/integration

# 2. Fix daemon tests
$EDITOR internal/daemon/client_test.go

# 3. Fix integration tests  
$EDITOR tests/integration/main_test.go

# 4. Verify
golangci-lint run
go test -v ./...

# 5. Push and watch CI
git add -A
git commit -m "fix(tests): add daemon client tests and fix integration test binary path"
git push
```

---

Now go fix those tests! 🚀
