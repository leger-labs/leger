package git

// SourceType represents the type of deployment source
type SourceType int

const (
	// SourceTypeUnknown represents an unknown or unsupported source type
	SourceTypeUnknown SourceType = iota
	// SourceTypeLegerRun represents a leger.run hosted repository
	SourceTypeLegerRun
	// SourceTypeGitHub represents a GitHub repository
	SourceTypeGitHub
	// SourceTypeGitLab represents a GitLab repository
	SourceTypeGitLab
	// SourceTypeGenericGit represents a generic Git repository
	SourceTypeGenericGit
	// SourceTypeLocal represents a local filesystem path
	SourceTypeLocal
)

// String returns a string representation of the SourceType
func (s SourceType) String() string {
	switch s {
	case SourceTypeLegerRun:
		return "leger.run"
	case SourceTypeGitHub:
		return "GitHub"
	case SourceTypeGitLab:
		return "GitLab"
	case SourceTypeGenericGit:
		return "Git"
	case SourceTypeLocal:
		return "Local"
	default:
		return "Unknown"
	}
}

// Repository represents a Git repository source
type Repository struct {
	URL        string     // Full Git URL
	Branch     string     // Branch name (default: main)
	SubPath    string     // Subpath within repository (e.g., /path/to/quadlets)
	Host       string     // Git host (github.com, gitlab.com, etc.)
	Owner      string     // Repository owner/organization
	RepoName   string     // Repository name
	SourceType SourceType // Type of source (leger.run, GitHub, etc.)
}
