package git

import (
	"testing"
)

func TestParseURL(t *testing.T) {
	tests := []struct {
		name          string
		url           string
		defaultBranch string
		wantOwner     string
		wantRepoName  string
		wantBranch    string
		wantSubPath   string
		wantHost      string
		wantErr       bool
	}{
		{
			name:          "GitHub simple URL",
			url:           "https://github.com/org/repo",
			defaultBranch: "",
			wantOwner:     "org",
			wantRepoName:  "repo",
			wantBranch:    "main",
			wantHost:      "github.com",
			wantSubPath:   "",
			wantErr:       false,
		},
		{
			name:          "GitHub with tree path",
			url:           "https://github.com/org/repo/tree/develop/path/to/quadlets",
			defaultBranch: "",
			wantOwner:     "org",
			wantRepoName:  "repo",
			wantBranch:    "develop",
			wantHost:      "github.com",
			wantSubPath:   "path/to/quadlets",
			wantErr:       false,
		},
		{
			name:          "GitLab with tree path",
			url:           "https://gitlab.com/org/repo/-/tree/main/quadlets",
			defaultBranch: "",
			wantOwner:     "org",
			wantRepoName:  "repo",
			wantBranch:    "main",
			wantHost:      "gitlab.com",
			wantSubPath:   "quadlets",
			wantErr:       false,
		},
		{
			name:          "Custom branch default",
			url:           "https://github.com/org/repo",
			defaultBranch: "develop",
			wantOwner:     "org",
			wantRepoName:  "repo",
			wantBranch:    "develop",
			wantHost:      "github.com",
			wantSubPath:   "",
			wantErr:       false,
		},
		{
			name:    "Empty URL",
			url:     "",
			wantErr: true,
		},
		{
			name:    "Invalid URL",
			url:     "not-a-url",
			wantErr: true,
		},
		{
			name:    "Unsupported scheme",
			url:     "ftp://github.com/org/repo",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := ParseURL(tt.url, tt.defaultBranch)
			if (err != nil) != tt.wantErr {
				t.Errorf("ParseURL() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if tt.wantErr {
				return
			}

			if got.Owner != tt.wantOwner {
				t.Errorf("ParseURL() Owner = %v, want %v", got.Owner, tt.wantOwner)
			}
			if got.RepoName != tt.wantRepoName {
				t.Errorf("ParseURL() RepoName = %v, want %v", got.RepoName, tt.wantRepoName)
			}
			if got.Branch != tt.wantBranch {
				t.Errorf("ParseURL() Branch = %v, want %v", got.Branch, tt.wantBranch)
			}
			if got.SubPath != tt.wantSubPath {
				t.Errorf("ParseURL() SubPath = %v, want %v", got.SubPath, tt.wantSubPath)
			}
			if got.Host != tt.wantHost {
				t.Errorf("ParseURL() Host = %v, want %v", got.Host, tt.wantHost)
			}
		})
	}
}

func TestGetCloneURL(t *testing.T) {
	tests := []struct {
		name string
		repo *Repository
		want string
	}{
		{
			name: "GitHub URL",
			repo: &Repository{
				Host:     "github.com",
				Owner:    "org",
				RepoName: "repo",
			},
			want: "https://github.com/org/repo",
		},
		{
			name: "GitLab URL",
			repo: &Repository{
				Host:     "gitlab.com",
				Owner:    "org",
				RepoName: "repo",
			},
			want: "https://gitlab.com/org/repo",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := tt.repo.GetCloneURL()
			if got != tt.want {
				t.Errorf("GetCloneURL() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestIsLegerRun(t *testing.T) {
	tests := []struct {
		name string
		repo *Repository
		want bool
	}{
		{
			name: "Leger.run URL",
			repo: &Repository{
				Host: "static.leger.run",
			},
			want: true,
		},
		{
			name: "GitHub URL",
			repo: &Repository{
				Host: "github.com",
			},
			want: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := tt.repo.IsLegerRun()
			if got != tt.want {
				t.Errorf("IsLegerRun() = %v, want %v", got, tt.want)
			}
		})
	}
}
