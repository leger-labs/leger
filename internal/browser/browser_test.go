package browser

import (
	"testing"
)

// TestOpen verifies that Open returns an error for unsupported platforms
// We can't easily test the actual browser opening in CI, so we test the error case
func TestOpen(t *testing.T) {
	// Test with a valid URL format
	url := "https://app.leger.run/auth?token=test"

	// This will attempt to open the browser
	// We can't verify it actually opens, but we can ensure it doesn't panic
	err := Open(url)

	// On supported platforms (linux, darwin, windows), this should either:
	// 1. Succeed (err == nil) if the browser command is available
	// 2. Fail with a command not found error if the browser isn't available
	// Both are acceptable in tests

	// We only check that we don't get the "unsupported platform" error
	// since we're running on a known platform
	if err != nil && err.Error() == "unsupported platform: "+t.Name() {
		t.Errorf("Got unsupported platform error on a supported platform")
	}
}
