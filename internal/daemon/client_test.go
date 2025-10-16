package daemon

import (
	"context"
	"net/http/httptest"
	"testing"

	"github.com/tailscale/setec/setectest"
)

func TestClientSetecIntegration(t *testing.T) {
	// Create test setec server
	db := setectest.NewDB(t, nil)
	ts := setectest.NewServer(t, db, nil)
	hs := httptest.NewServer(ts.Mux)
	defer hs.Close()

	// Create leger daemon client
	client := NewClient(hs.URL)

	ctx := context.Background()

	t.Run("Health", func(t *testing.T) {
		if err := client.Health(ctx); err != nil {
			t.Errorf("Health() failed: %v", err)
		}
	})

	t.Run("PutAndGetSecret", func(t *testing.T) {
		secretName := "test-secret"
		secretValue := []byte("test-value")

		// Put secret
		version, err := client.PutSecret(ctx, secretName, secretValue)
		if err != nil {
			t.Fatalf("PutSecret() failed: %v", err)
		}
		if version == 0 {
			t.Error("PutSecret() returned zero version")
		}

		// Get secret
		got, err := client.GetSecret(ctx, secretName)
		if err != nil {
			t.Fatalf("GetSecret() failed: %v", err)
		}
		if string(got) != string(secretValue) {
			t.Errorf("GetSecret() = %q, want %q", got, secretValue)
		}
	})

	t.Run("ListSecrets", func(t *testing.T) {
		// Put a few test secrets
		_, _ = client.PutSecret(ctx, "secret1", []byte("value1"))
		_, _ = client.PutSecret(ctx, "secret2", []byte("value2"))

		secrets, err := client.ListSecrets(ctx)
		if err != nil {
			t.Fatalf("ListSecrets() failed: %v", err)
		}

		if len(secrets) < 2 {
			t.Errorf("ListSecrets() returned %d secrets, want at least 2", len(secrets))
		}
	})

	t.Run("InfoSecret", func(t *testing.T) {
		secretName := "info-test"
		_, _ = client.PutSecret(ctx, secretName, []byte("test"))

		info, err := client.InfoSecret(ctx, secretName)
		if err != nil {
			t.Fatalf("InfoSecret() failed: %v", err)
		}

		if info.Name != secretName {
			t.Errorf("InfoSecret().Name = %q, want %q", info.Name, secretName)
		}
		if info.ActiveVersion == 0 {
			t.Error("InfoSecret().ActiveVersion = 0, want non-zero")
		}
	})

	t.Run("NewStore", func(t *testing.T) {
		// Put some test secrets
		_, _ = client.PutSecret(ctx, "store-secret1", []byte("value1"))
		_, _ = client.PutSecret(ctx, "store-secret2", []byte("value2"))

		// Create store
		store, err := client.NewStore(ctx, []string{"store-secret1", "store-secret2"})
		if err != nil {
			t.Fatalf("NewStore() failed: %v", err)
		}
		defer store.Close()

		// Verify secrets are accessible
		secret1 := store.Secret("store-secret1")
		if secret1 == nil {
			t.Error("Store.Secret() returned nil for store-secret1")
		}
		if string(secret1.Get()) != "value1" {
			t.Errorf("Store.Secret().Get() = %q, want %q", secret1.Get(), "value1")
		}

		// Test AllowLookup (dynamic discovery)
		_, _ = client.PutSecret(ctx, "dynamic-secret", []byte("dynamic-value"))
		dynamicSecret, err := store.LookupSecret(ctx, "dynamic-secret")
		if err != nil {
			t.Errorf("Store.LookupSecret() failed: %v", err)
		}
		if string(dynamicSecret.Get()) != "dynamic-value" {
			t.Errorf("Store.LookupSecret().Get() = %q, want %q", dynamicSecret.Get(), "dynamic-value")
		}
	})

	t.Run("SecretNotFound", func(t *testing.T) {
		_, err := client.GetSecret(ctx, "nonexistent-secret")
		if err == nil {
			t.Error("GetSecret() for nonexistent secret should return error")
		}
	})

	t.Run("SetecClientAccess", func(t *testing.T) {
		// Verify we can access the underlying setec.Client
		setecClient := client.SetecClient()
		if setecClient.Server != hs.URL {
			t.Errorf("SetecClient().Server = %q, want %q", setecClient.Server, hs.URL)
		}

		// Verify we can use it directly
		version, err := setecClient.Put(ctx, "direct-secret", []byte("direct-value"))
		if err != nil {
			t.Errorf("Direct setec.Client.Put() failed: %v", err)
		}
		if version == 0 {
			t.Error("Direct setec.Client.Put() returned zero version")
		}
	})
}

func TestClientDefaults(t *testing.T) {
	client := NewClient("")

	if client.baseURL != "http://localhost:8080" {
		t.Errorf("NewClient(\"\").baseURL = %q, want %q", client.baseURL, "http://localhost:8080")
	}

	if client.setecClient.Server != "http://localhost:8080" {
		t.Errorf("NewClient(\"\").setecClient.Server = %q, want %q", client.setecClient.Server, "http://localhost:8080")
	}
}

func TestClientCustomURL(t *testing.T) {
	customURL := "http://custom:9090"
	client := NewClient(customURL)

	if client.baseURL != customURL {
		t.Errorf("NewClient(%q).baseURL = %q, want %q", customURL, client.baseURL, customURL)
	}

	if client.setecClient.Server != customURL {
		t.Errorf("NewClient(%q).setecClient.Server = %q, want %q", customURL, client.setecClient.Server, customURL)
	}
}
