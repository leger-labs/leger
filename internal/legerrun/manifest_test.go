package legerrun

import (
	"testing"
	"time"

	"github.com/tailscale/setec/pkg/types"
)

func TestParseManifest(t *testing.T) {
	tests := []struct {
		name    string
		data    string
		wantErr bool
	}{
		{
			name: "valid manifest",
			data: `{
				"version": 1,
				"created_at": "2025-10-16T12:00:00Z",
				"name": "test",
				"services": [
					{
						"name": "test-service",
						"type": "container",
						"files": ["test.container"]
					}
				]
			}`,
			wantErr: false,
		},
		{
			name: "missing version",
			data: `{
				"created_at": "2025-10-16T12:00:00Z",
				"services": []
			}`,
			wantErr: true,
		},
		{
			name: "missing services",
			data: `{
				"version": 1,
				"created_at": "2025-10-16T12:00:00Z"
			}`,
			wantErr: true,
		},
		{
			name:    "invalid JSON",
			data:    `{invalid json`,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := ParseManifest([]byte(tt.data))
			if (err != nil) != tt.wantErr {
				t.Errorf("ParseManifest() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestValidateManifest(t *testing.T) {
	tests := []struct {
		name     string
		manifest *types.Manifest
		wantErr  bool
	}{
		{
			name: "valid manifest",
			manifest: &types.Manifest{
				Version:   1,
				CreatedAt: time.Now(),
				Name:      "test",
				Services: []types.ServiceDefinition{
					{
						Name:  "test-service",
						Type:  "container",
						Files: []string{"test.container"},
					},
				},
			},
			wantErr: false,
		},
		{
			name:     "nil manifest",
			manifest: nil,
			wantErr:  true,
		},
		{
			name: "zero version",
			manifest: &types.Manifest{
				Version:   0,
				CreatedAt: time.Now(),
				Services: []types.ServiceDefinition{
					{
						Name:  "test",
						Type:  "container",
						Files: []string{"test.container"},
					},
				},
			},
			wantErr: true,
		},
		{
			name: "empty services",
			manifest: &types.Manifest{
				Version:   1,
				CreatedAt: time.Now(),
				Services:  []types.ServiceDefinition{},
			},
			wantErr: true,
		},
		{
			name: "service missing name",
			manifest: &types.Manifest{
				Version:   1,
				CreatedAt: time.Now(),
				Services: []types.ServiceDefinition{
					{
						Type:  "container",
						Files: []string{"test.container"},
					},
				},
			},
			wantErr: true,
		},
		{
			name: "service missing type",
			manifest: &types.Manifest{
				Version:   1,
				CreatedAt: time.Now(),
				Services: []types.ServiceDefinition{
					{
						Name:  "test",
						Files: []string{"test.container"},
					},
				},
			},
			wantErr: true,
		},
		{
			name: "service missing files",
			manifest: &types.Manifest{
				Version:   1,
				CreatedAt: time.Now(),
				Services: []types.ServiceDefinition{
					{
						Name:  "test",
						Type:  "container",
						Files: []string{},
					},
				},
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateManifest(tt.manifest)
			if (err != nil) != tt.wantErr {
				t.Errorf("ValidateManifest() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
