package git

import (
	"fmt"
	"net/url"
	"path/filepath"
	"regexp"
	"strings"
)

// ParseURL parses a Git URL and extracts repository information
// Supports formats:
// - https://github.com/org/repo
// - https://github.com/org/repo/tree/branch/path
// - https://gitlab.com/org/repo/-/tree/branch/path
// - https://static.leger.run/{uuid}/latest/
func ParseURL(gitURL, defaultBranch string) (*Repository, error) {
	if gitURL == "" {
		return nil, fmt.Errorf("empty Git URL")
	}

	// Check if it's a leger.run URL (handled differently)
	if strings.Contains(gitURL, "static.leger.run") {
		return parseLegerRunURL(gitURL)
	}

	// Parse URL
	u, err := url.Parse(gitURL)
	if err != nil {
		return nil, fmt.Errorf("invalid URL: %w", err)
	}

	if u.Scheme != "http" && u.Scheme != "https" {
		return nil, fmt.Errorf("unsupported URL scheme: %s (only http/https supported)", u.Scheme)
	}

	repo := &Repository{
		URL:    gitURL,
		Branch: defaultBranch,
		Host:   u.Host,
	}

	if repo.Branch == "" {
		repo.Branch = "main" // default
	}

	// Parse path components
	path := strings.Trim(u.Path, "/")
	parts := strings.Split(path, "/")

	if len(parts) < 2 {
		return nil, fmt.Errorf("invalid Git URL: expected format https://host/owner/repo")
	}

	repo.Owner = parts[0]
	repo.RepoName = parts[1]

	// Check for GitHub-style tree path: /tree/branch/path
	if len(parts) >= 4 && parts[2] == "tree" {
		repo.Branch = parts[3]
		if len(parts) > 4 {
			repo.SubPath = strings.Join(parts[4:], "/")
		}
	} else if len(parts) >= 5 && parts[2] == "-" && parts[3] == "tree" {
		// GitLab-style: /org/repo/-/tree/branch/path
		repo.Branch = parts[4]
		if len(parts) > 5 {
			repo.SubPath = strings.Join(parts[5:], "/")
		}
	}

	return repo, nil
}

// parseLegerRunURL parses a leger.run static URL
// Format: https://static.leger.run/{uuid}/latest/
func parseLegerRunURL(gitURL string) (*Repository, error) {
	u, err := url.Parse(gitURL)
	if err != nil {
		return nil, fmt.Errorf("invalid leger.run URL: %w", err)
	}

	path := strings.Trim(u.Path, "/")
	parts := strings.Split(path, "/")

	if len(parts) < 2 {
		return nil, fmt.Errorf("invalid leger.run URL: expected format https://static.leger.run/{uuid}/version/")
	}

	repo := &Repository{
		URL:      gitURL,
		Host:     "static.leger.run",
		Owner:    parts[0], // UUID
		RepoName: parts[1], // version (e.g., "latest", "v1.0.0")
		Branch:   "main",   // leger.run doesn't use branches
	}

	return repo, nil
}

// GetCloneURL returns the base clone URL without tree path
func (r *Repository) GetCloneURL() string {
	if r.Host == "static.leger.run" {
		// leger.run URLs are not Git repositories
		return r.URL
	}

	// Reconstruct base URL without /tree/branch/path
	return fmt.Sprintf("https://%s/%s/%s", r.Host, r.Owner, r.RepoName)
}

// IsLegerRun returns true if this is a leger.run URL
func (r *Repository) IsLegerRun() bool {
	return r.Host == "static.leger.run"
}

// DetectSourceType determines the source type from a URL or path
func DetectSourceType(urlOrPath string) SourceType {
	if urlOrPath == "" {
		return SourceTypeUnknown
	}

	// Check for local path
	if !strings.HasPrefix(urlOrPath, "http://") && !strings.HasPrefix(urlOrPath, "https://") {
		if filepath.IsAbs(urlOrPath) || strings.HasPrefix(urlOrPath, ".") || strings.HasPrefix(urlOrPath, "file://") {
			return SourceTypeLocal
		}
	}

	// Check for leger.run
	if strings.Contains(urlOrPath, "static.leger.run") || strings.Contains(urlOrPath, "api.leger.run") {
		return SourceTypeLegerRun
	}

	// Check for GitHub
	if strings.Contains(urlOrPath, "github.com") {
		return SourceTypeGitHub
	}

	// Check for GitLab
	if strings.Contains(urlOrPath, "gitlab.com") {
		return SourceTypeGitLab
	}

	// Check for generic git URL patterns
	if strings.HasPrefix(urlOrPath, "http://") || strings.HasPrefix(urlOrPath, "https://") {
		if strings.HasSuffix(urlOrPath, ".git") || strings.Contains(urlOrPath, "/") {
			return SourceTypeGenericGit
		}
	}

	return SourceTypeUnknown
}

// ExtractUserUUID extracts the user UUID from a leger.run URL
// Format: https://static.leger.run/{uuid}/version/...
func ExtractUserUUID(legerRunURL string) (string, error) {
	if !strings.Contains(legerRunURL, "static.leger.run") {
		return "", fmt.Errorf("not a leger.run URL: %s", legerRunURL)
	}

	u, err := url.Parse(legerRunURL)
	if err != nil {
		return "", fmt.Errorf("invalid URL: %w", err)
	}

	path := strings.Trim(u.Path, "/")
	parts := strings.Split(path, "/")

	if len(parts) < 1 {
		return "", fmt.Errorf("invalid leger.run URL: expected format https://static.leger.run/{uuid}/version/")
	}

	uuid := parts[0]

	// Validate UUID format (basic check)
	uuidPattern := regexp.MustCompile(`^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$`)
	if !uuidPattern.MatchString(uuid) {
		return "", fmt.Errorf("invalid UUID format in leger.run URL: %s", uuid)
	}

	return uuid, nil
}

// ResolveSource resolves a deployment source from a URL or name
// If urlOrName is empty, returns a leger.run URL for the given user UUID
func ResolveSource(urlOrName string, userUUID string) (*Repository, error) {
	// If no URL provided, default to leger.run latest
	if urlOrName == "" {
		if userUUID == "" {
			return nil, fmt.Errorf(`no deployment source specified and no user UUID available

Options:
  1. Provide a deployment source:
     leger deploy install https://github.com/org/repo

  2. Authenticate to use leger.run default:
     leger auth login
     leger deploy install  # Uses leger.run automatically`)
		}

		legerRunURL := fmt.Sprintf("https://static.leger.run/%s/latest/", userUUID)
		return &Repository{
			URL:        legerRunURL,
			Host:       "static.leger.run",
			Owner:      userUUID,
			RepoName:   "latest",
			Branch:     "main",
			SourceType: SourceTypeLegerRun,
		}, nil
	}

	// Detect source type
	sourceType := DetectSourceType(urlOrName)
	if sourceType == SourceTypeUnknown {
		return nil, fmt.Errorf(`unable to determine source type for: %s

Supported formats:
  - leger.run:  https://static.leger.run/{uuid}/latest/
  - GitHub:     https://github.com/org/repo
  - GitLab:     https://gitlab.com/org/repo
  - Local:      /path/to/quadlets
  - Generic:    https://git.example.com/org/repo.git`, urlOrName)
	}

	// Handle local paths differently (they don't need URL parsing)
	if sourceType == SourceTypeLocal {
		return &Repository{
			URL:        urlOrName,
			Branch:     "main",
			Host:       "local",
			Owner:      "",
			RepoName:   filepath.Base(urlOrName),
			SourceType: SourceTypeLocal,
		}, nil
	}

	// Parse URL based on source type
	repo, err := ParseURL(urlOrName, "main")
	if err != nil {
		return nil, err
	}

	repo.SourceType = sourceType
	return repo, nil
}
