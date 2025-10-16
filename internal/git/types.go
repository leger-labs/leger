package git

// Repository represents a Git repository source
type Repository struct {
	URL      string // Full Git URL
	Branch   string // Branch name (default: main)
	SubPath  string // Subpath within repository (e.g., /path/to/quadlets)
	Host     string // Git host (github.com, gitlab.com, etc.)
	Owner    string // Repository owner/organization
	RepoName string // Repository name
}
