package cli

import (
	"context"
	"fmt"
	"os"

	"github.com/tailscale/setec/internal/tailscale"
)

// PrintIdentity displays Tailscale identity in user-friendly format
func PrintIdentity(identity *tailscale.Identity) {
	fmt.Println("Tailscale Identity:")
	fmt.Printf("  User:      %s\n", identity.LoginName)
	fmt.Printf("  Tailnet:   %s\n", identity.Tailnet)
	fmt.Printf("  Device:    %s\n", identity.DeviceName)
	fmt.Printf("  IP:        %s\n", identity.DeviceIP)
}

// VerifyTailscaleOrExit checks Tailscale identity and exits on failure
func VerifyTailscaleOrExit(ctx context.Context) *tailscale.Identity {
	client := tailscale.NewClient()

	identity, err := client.VerifyIdentity(ctx)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}

	return identity
}
