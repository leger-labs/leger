package daemon

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestClientCreation(t *testing.T) {
	client := NewClient("")
	if client == nil {
		t.Fatal("expected non-nil client")
	}

	if client.baseURL != "http://localhost:8080" {
		t.Errorf("expected default baseURL, got %s", client.baseURL)
	}
}

func TestClientWithCustomURL(t *testing.T) {
	client := NewClient("http://custom:9000")
	if client.baseURL != "http://custom:9000" {
		t.Errorf("expected custom baseURL, got %s", client.baseURL)
	}
}

func TestHealth_Success(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/health" {
			t.Errorf("unexpected path: %s", r.URL.Path)
		}
		w.WriteHeader(http.StatusOK)
	}))
	defer server.Close()

	client := NewClient(server.URL)
	err := client.Health(context.Background())
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
}

func TestHealth_Failure(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusInternalServerError)
	}))
	defer server.Close()

	client := NewClient(server.URL)
	err := client.Health(context.Background())
	if err == nil {
		t.Error("expected error, got nil")
	}
}

func TestGetSecret_Success(t *testing.T) {
	expectedSecret := Secret{
		Name:  "test-secret",
		Value: "test-value",
	}

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/get" {
			t.Errorf("unexpected path: %s", r.URL.Path)
		}
		if r.URL.Query().Get("name") != "test-secret" {
			t.Errorf("unexpected name query param: %s", r.URL.Query().Get("name"))
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(expectedSecret)
	}))
	defer server.Close()

	client := NewClient(server.URL)
	value, err := client.GetSecret(context.Background(), "test-secret")
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
	if value != "test-value" {
		t.Errorf("expected 'test-value', got %s", value)
	}
}

func TestGetSecret_NotFound(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotFound)
	}))
	defer server.Close()

	client := NewClient(server.URL)
	_, err := client.GetSecret(context.Background(), "nonexistent")
	if err == nil {
		t.Error("expected error, got nil")
	}
}

func TestPutSecret_Success(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/put" {
			t.Errorf("unexpected path: %s", r.URL.Path)
		}
		if r.Method != "POST" {
			t.Errorf("unexpected method: %s", r.Method)
		}

		var secret Secret
		if err := json.NewDecoder(r.Body).Decode(&secret); err != nil {
			t.Errorf("failed to decode body: %v", err)
		}
		if secret.Name != "test-secret" || secret.Value != "test-value" {
			t.Errorf("unexpected secret: %+v", secret)
		}

		w.WriteHeader(http.StatusOK)
	}))
	defer server.Close()

	client := NewClient(server.URL)
	err := client.PutSecret(context.Background(), "test-secret", "test-value")
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
}

func TestListSecrets_Success(t *testing.T) {
	expectedSecrets := []string{"secret1", "secret2", "secret3"}

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/list" {
			t.Errorf("unexpected path: %s", r.URL.Path)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(expectedSecrets)
	}))
	defer server.Close()

	client := NewClient(server.URL)
	secrets, err := client.ListSecrets(context.Background())
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
	if len(secrets) != 3 {
		t.Errorf("expected 3 secrets, got %d", len(secrets))
	}
	for i, secret := range secrets {
		if secret != expectedSecrets[i] {
			t.Errorf("expected %s, got %s", expectedSecrets[i], secret)
		}
	}
}

func TestListSecrets_Empty(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode([]string{})
	}))
	defer server.Close()

	client := NewClient(server.URL)
	secrets, err := client.ListSecrets(context.Background())
	if err != nil {
		t.Errorf("expected no error, got %v", err)
	}
	if len(secrets) != 0 {
		t.Errorf("expected 0 secrets, got %d", len(secrets))
	}
}
