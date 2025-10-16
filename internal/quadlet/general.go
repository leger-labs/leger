package quadlet

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// QuadletFile represents a parsed quadlet file
type QuadletFile struct {
	Path     string
	Name     string
	Type     string // container, volume, network, pod, kube, image
	Sections map[string]map[string][]string // section -> key -> []values
}

// ParseQuadletFile parses a quadlet file into structured data
func ParseQuadletFile(path string) (*QuadletFile, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	qf := &QuadletFile{
		Path:     path,
		Name:     filepath.Base(path),
		Type:     strings.TrimPrefix(filepath.Ext(path), "."),
		Sections: make(map[string]map[string][]string),
	}

	scanner := bufio.NewScanner(file)
	currentSection := ""

	for scanner.Scan() {
		line := scanner.Text()
		trimmed := strings.TrimSpace(line)

		// Skip empty lines and comments
		if trimmed == "" || strings.HasPrefix(trimmed, "#") || strings.HasPrefix(trimmed, ";") {
			continue
		}

		// Check for section headers
		if strings.HasPrefix(trimmed, "[") && strings.HasSuffix(trimmed, "]") {
			currentSection = trimmed[1 : len(trimmed)-1]
			if qf.Sections[currentSection] == nil {
				qf.Sections[currentSection] = make(map[string][]string)
			}
			continue
		}

		// Parse key=value pairs
		if currentSection != "" && strings.Contains(trimmed, "=") {
			parts := strings.SplitN(trimmed, "=", 2)
			key := strings.TrimSpace(parts[0])
			value := strings.TrimSpace(parts[1])

			qf.Sections[currentSection][key] = append(qf.Sections[currentSection][key], value)
		}
	}

	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("failed to scan file: %w", err)
	}

	return qf, nil
}

// GetValue returns the first value for a key in a section, or empty string if not found
func (qf *QuadletFile) GetValue(section, key string) string {
	if sec, ok := qf.Sections[section]; ok {
		if values, ok := sec[key]; ok && len(values) > 0 {
			return values[0]
		}
	}
	return ""
}

// GetValues returns all values for a key in a section
func (qf *QuadletFile) GetValues(section, key string) []string {
	if sec, ok := qf.Sections[section]; ok {
		if values, ok := sec[key]; ok {
			return values
		}
	}
	return nil
}

// HasSection checks if a section exists
func (qf *QuadletFile) HasSection(section string) bool {
	_, ok := qf.Sections[section]
	return ok
}

// HasKey checks if a key exists in a section
func (qf *QuadletFile) HasKey(section, key string) bool {
	if sec, ok := qf.Sections[section]; ok {
		_, ok := sec[key]
		return ok
	}
	return false
}

// GetServiceName returns the systemd service name for this quadlet
func (qf *QuadletFile) GetServiceName() string {
	// Remove extension from name
	name := qf.Name
	name = strings.TrimSuffix(name, filepath.Ext(name))
	return name + ".service"
}

// GetPorts extracts port mappings from a container quadlet
func (qf *QuadletFile) GetPorts() []string {
	return qf.GetValues("Container", "PublishPort")
}

// GetVolumes extracts volume mounts from a container quadlet
func (qf *QuadletFile) GetVolumes() []string {
	return qf.GetValues("Container", "Volume")
}

// GetImage returns the container image
func (qf *QuadletFile) GetImage() string {
	return qf.GetValue("Container", "Image")
}

// GetDescription returns the unit description
func (qf *QuadletFile) GetDescription() string {
	return qf.GetValue("Unit", "Description")
}
