package quadlet

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// SecretRef represents a secret reference in a quadlet file
type SecretRef struct {
	Name       string // Secret name (first parameter of Secret= directive)
	Type       string // "env" or "mount"
	Target     string // Environment variable name or mount path
	SourceFile string // Quadlet file that references this secret
}

// ParseResult contains the results of parsing quadlet files
type ParseResult struct {
	Secrets      map[string]*SecretRef // Map of secret name to reference
	QuadletFiles []string              // List of quadlet files parsed
}

// ParseDirectory recursively parses all quadlet files in a directory
func ParseDirectory(dir string) (*ParseResult, error) {
	result := &ParseResult{
		Secrets: make(map[string]*SecretRef),
	}

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}

		// Only parse .container, .volume, .network, .pod files
		ext := filepath.Ext(path)
		if ext != ".container" && ext != ".volume" && ext != ".network" && ext != ".pod" {
			return nil
		}

		secrets, err := ParseFile(path)
		if err != nil {
			return fmt.Errorf("parsing %s: %w", path, err)
		}

		result.QuadletFiles = append(result.QuadletFiles, path)
		for name, ref := range secrets {
			if existing, ok := result.Secrets[name]; ok {
				// Secret already referenced, just note the additional file
				existing.SourceFile = existing.SourceFile + ", " + path
			} else {
				result.Secrets[name] = ref
			}
		}

		return nil
	})

	return result, err
}

// ParseFile parses a single quadlet file for Secret= directives
func ParseFile(path string) (map[string]*SecretRef, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	secrets := make(map[string]*SecretRef)
	scanner := bufio.NewScanner(file)
	inContainerSection := false

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())

		// Track sections
		if strings.HasPrefix(line, "[") && strings.HasSuffix(line, "]") {
			inContainerSection = line == "[Container]"
			continue
		}

		// Skip empty lines and comments
		if line == "" || strings.HasPrefix(line, "#") || strings.HasPrefix(line, ";") {
			continue
		}

		// Parse Secret= directives (only in [Container] section)
		if inContainerSection && strings.HasPrefix(line, "Secret=") {
			secret, err := parseSecretDirective(line, path)
			if err != nil {
				return nil, fmt.Errorf("parsing secret directive: %w", err)
			}
			secrets[secret.Name] = secret
		}
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return secrets, nil
}

// parseSecretDirective parses a Secret= directive line
// Format: Secret=name[,opt=val[,opt=val...]]
// Options: type=env|mount, target=ENV_VAR|/path, uid=N, gid=N, mode=0644
func parseSecretDirective(line, sourcePath string) (*SecretRef, error) {
	// Remove "Secret=" prefix
	line = strings.TrimPrefix(line, "Secret=")
	parts := strings.Split(line, ",")

	if len(parts) == 0 || parts[0] == "" {
		return nil, fmt.Errorf("empty secret name")
	}

	ref := &SecretRef{
		Name:       strings.TrimSpace(parts[0]),
		Type:       "env", // default
		SourceFile: sourcePath,
	}

	// Parse options
	for i := 1; i < len(parts); i++ {
		opt := strings.TrimSpace(parts[i])
		kv := strings.SplitN(opt, "=", 2)
		if len(kv) != 2 {
			continue
		}
		key := strings.TrimSpace(kv[0])
		val := strings.TrimSpace(kv[1])

		switch key {
		case "type":
			ref.Type = val
		case "target":
			ref.Target = val
		}
	}

	// If type is env and no target, target defaults to secret name in uppercase
	if ref.Type == "env" && ref.Target == "" {
		ref.Target = strings.ToUpper(strings.ReplaceAll(ref.Name, "-", "_"))
	}

	return ref, nil
}

// GetSecretNames returns a sorted list of unique secret names
func (pr *ParseResult) GetSecretNames() []string {
	names := make([]string, 0, len(pr.Secrets))
	for name := range pr.Secrets {
		names = append(names, name)
	}
	return names
}

// ParseVolumeDirectives parses a quadlet file and extracts all Volume= directives
func ParseVolumeDirectives(path string) ([]string, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var volumes []string
	scanner := bufio.NewScanner(file)
	inContainerSection := false

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())

		// Track sections
		if strings.HasPrefix(line, "[") && strings.HasSuffix(line, "]") {
			inContainerSection = line == "[Container]"
			continue
		}

		// Skip empty lines and comments
		if line == "" || strings.HasPrefix(line, "#") || strings.HasPrefix(line, ";") {
			continue
		}

		// Parse Volume= directives (only in [Container] section)
		if inContainerSection && strings.HasPrefix(line, "Volume=") {
			volumeSpec := strings.TrimPrefix(line, "Volume=")
			volumes = append(volumes, volumeSpec)
		}
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return volumes, nil
}
