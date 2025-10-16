package tailscale

import (
	"testing"
)

func TestClientCreation(t *testing.T) {
	client := NewClient()
	if client == nil {
		t.Fatal("expected non-nil client")
	}
	if client.lc == nil {
		t.Fatal("expected non-nil LocalClient")
	}
}

func TestIsInstalled(t *testing.T) {
	client := NewClient()
	// This test depends on whether Tailscale is actually installed
	// We just verify it doesn't panic
	_ = client.IsInstalled()
}
