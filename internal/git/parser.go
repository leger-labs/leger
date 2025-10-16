package git

import (
	"fmt"
	"net/url"
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
