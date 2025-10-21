package tailscale

import (
	"context"
	"fmt"
	"os/exec"

	"tailscale.com/client/local"
)

// Client wraps Tailscale LocalClient
type Client struct {
	lc *local.Client
}

// NewClient creates a new Tailscale client
func NewClient() *Client {
	return &Client{
		lc: &local.Client{},
	}
}

// IsInstalled checks if Tailscale is installed
func (c *Client) IsInstalled() bool {
	_, err := exec.LookPath("tailscale")
	return err == nil
}

// IsRunning checks if Tailscale daemon is running
func (c *Client) IsRunning(ctx context.Context) bool {
	_, err := c.lc.Status(ctx)
	return err == nil
}

// Identity represents a Tailscale identity
type Identity struct {
	UserID     uint64
	LoginName  string
	Tailnet    string
	DeviceName string
	DeviceIP   string
}

// GetIdentity retrieves the current Tailscale identity
func (c *Client) GetIdentity(ctx context.Context) (*Identity, error) {
	status, err := c.lc.Status(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get Tailscale status: %w", err)
	}

	if status.Self == nil {
		return nil, fmt.Errorf("not authenticated to Tailscale")
	}

	user := status.User[status.Self.UserID]

	return &Identity{
		UserID:     uint64(status.Self.UserID),
		LoginName:  user.LoginName,
		Tailnet:    status.CurrentTailnet.Name,
		DeviceName: status.Self.HostName,
		DeviceIP:   status.Self.TailscaleIPs[0].String(),
	}, nil
}

// VerifyIdentity ensures Tailscale is installed, running, and authenticated
func (c *Client) VerifyIdentity(ctx context.Context) (*Identity, error) {
	if !c.IsInstalled() {
		return nil, fmt.Errorf("tailscale not installed (install from: https://tailscale.com/download)")
	}

	if !c.IsRunning(ctx) {
		return nil, fmt.Errorf("tailscale daemon not running (run: sudo tailscale up)")
	}

	return c.GetIdentity(ctx)
}
