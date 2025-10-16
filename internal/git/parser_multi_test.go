package git

import (
	"testing"
)

func TestDetectSourceType(t *testing.T) {
	tests := []struct {
		name       string
		urlOrPath  string
		wantType   SourceType
	}{
		{
			name:      "leger.run URL",
			urlOrPath: "https://static.leger.run/abc-123-def-456/latest/",
			wantType:  SourceTypeLegerRun,
		},
		{
			name:      "GitHub URL",
			urlOrPath: "https://github.com/org/repo",
			wantType:  SourceTypeGitHub,
		},
		{
			name:      "GitLab URL",
			urlOrPath: "https://gitlab.com/org/repo",
			wantType:  SourceTypeGitLab,
		},
		{
			name:      "Generic Git URL",
			urlOrPath: "https://git.example.com/org/repo.git",
			wantType:  SourceTypeGenericGit,
		},
		{
			name:      "Absolute local path",
			urlOrPath: "/home/user/quadlets",
			wantType:  SourceTypeLocal,
		},
		{
			name:      "Relative local path",
			urlOrPath: "./quadlets",
			wantType:  SourceTypeLocal,
		},
		{
			name:      "File URL",
			urlOrPath: "file:///home/user/quadlets",
			wantType:  SourceTypeLocal,
		},
		{
			name:      "Empty string",
			urlOrPath: "",
			wantType:  SourceTypeUnknown,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := DetectSourceType(tt.urlOrPath)
			if got != tt.wantType {
				t.Errorf("DetectSourceType(%q) = %v, want %v", tt.urlOrPath, got, tt.wantType)
			}
		})
	}
}

func TestExtractUserUUID(t *testing.T) {
	tests := []struct {
		name        string
		legerRunURL string
		wantUUID    string
		wantErr     bool
	}{
		{
			name:        "valid leger.run URL",
			legerRunURL: "https://static.leger.run/abc12345-1234-1234-1234-123456789abc/latest/",
			wantUUID:    "abc12345-1234-1234-1234-123456789abc",
			wantErr:     false,
		},
		{
			name:        "not a leger.run URL",
			legerRunURL: "https://github.com/org/repo",
			wantUUID:    "",
			wantErr:     true,
		},
		{
			name:        "invalid UUID format",
			legerRunURL: "https://static.leger.run/invalid-uuid/latest/",
			wantUUID:    "",
			wantErr:     true,
		},
		{
			name:        "empty URL",
			legerRunURL: "",
			wantUUID:    "",
			wantErr:     true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := ExtractUserUUID(tt.legerRunURL)
			if (err != nil) != tt.wantErr {
				t.Errorf("ExtractUserUUID(%q) error = %v, wantErr %v", tt.legerRunURL, err, tt.wantErr)
				return
			}
			if got != tt.wantUUID {
				t.Errorf("ExtractUserUUID(%q) = %q, want %q", tt.legerRunURL, got, tt.wantUUID)
			}
		})
	}
}

func TestResolveSource(t *testing.T) {
	testUUID := "abc12345-1234-1234-1234-123456789abc"

	tests := []struct {
		name       string
		urlOrName  string
		userUUID   string
		wantType   SourceType
		wantErr    bool
	}{
		{
			name:      "empty URL with user UUID - defaults to leger.run",
			urlOrName: "",
			userUUID:  testUUID,
			wantType:  SourceTypeLegerRun,
			wantErr:   false,
		},
		{
			name:      "empty URL without user UUID - error",
			urlOrName: "",
			userUUID:  "",
			wantType:  SourceTypeUnknown,
			wantErr:   true,
		},
		{
			name:      "GitHub URL",
			urlOrName: "https://github.com/org/repo",
			userUUID:  testUUID,
			wantType:  SourceTypeGitHub,
			wantErr:   false,
		},
		{
			name:      "leger.run URL",
			urlOrName: "https://static.leger.run/abc12345-1234-1234-1234-123456789abc/latest/",
			userUUID:  testUUID,
			wantType:  SourceTypeLegerRun,
			wantErr:   false,
		},
		{
			name:      "Local path",
			urlOrName: "/home/user/quadlets",
			userUUID:  testUUID,
			wantType:  SourceTypeLocal,
			wantErr:   false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo, err := ResolveSource(tt.urlOrName, tt.userUUID)
			if (err != nil) != tt.wantErr {
				t.Errorf("ResolveSource(%q, %q) error = %v, wantErr %v", tt.urlOrName, tt.userUUID, err, tt.wantErr)
				return
			}
			if err == nil && repo.SourceType != tt.wantType {
				t.Errorf("ResolveSource(%q, %q).SourceType = %v, want %v", tt.urlOrName, tt.userUUID, repo.SourceType, tt.wantType)
			}
		})
	}
}

func TestSourceType_String(t *testing.T) {
	tests := []struct {
		sourceType SourceType
		want       string
	}{
		{SourceTypeLegerRun, "leger.run"},
		{SourceTypeGitHub, "GitHub"},
		{SourceTypeGitLab, "GitLab"},
		{SourceTypeGenericGit, "Git"},
		{SourceTypeLocal, "Local"},
		{SourceTypeUnknown, "Unknown"},
	}

	for _, tt := range tests {
		t.Run(tt.want, func(t *testing.T) {
			if got := tt.sourceType.String(); got != tt.want {
				t.Errorf("SourceType.String() = %v, want %v", got, tt.want)
			}
		})
	}
}
