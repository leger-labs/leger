package quadlet

import (
	"fmt"
	"os"
	"path/filepath"
)

// DiscoveredQuadlets represents discovered quadlet files
type DiscoveredQuadlets struct {
	Directory string   // Root directory
	Files     []string // All quadlet files found
	Containers []string // .container files
	Volumes    []string // .volume files
	Networks   []string // .network files
	Pods       []string // .pod files
	Kubes      []string // .kube files
	Images     []string // .image files
}

// DiscoverQuadlets discovers all quadlet files in a directory
func DiscoverQuadlets(dir string) (*DiscoveredQuadlets, error) {
	discovered := &DiscoveredQuadlets{
		Directory: dir,
	}

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() {
			return nil
		}

		ext := filepath.Ext(path)

		switch ext {
		case ".container":
			discovered.Containers = append(discovered.Containers, path)
			discovered.Files = append(discovered.Files, path)
		case ".volume":
			discovered.Volumes = append(discovered.Volumes, path)
			discovered.Files = append(discovered.Files, path)
		case ".network":
			discovered.Networks = append(discovered.Networks, path)
			discovered.Files = append(discovered.Files, path)
		case ".pod":
			discovered.Pods = append(discovered.Pods, path)
			discovered.Files = append(discovered.Files, path)
		case ".kube":
			discovered.Kubes = append(discovered.Kubes, path)
			discovered.Files = append(discovered.Files, path)
		case ".image":
			discovered.Images = append(discovered.Images, path)
			discovered.Files = append(discovered.Files, path)
		}

		return nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to discover quadlets: %w", err)
	}

	if len(discovered.Files) == 0 {
		return nil, fmt.Errorf("no quadlet files found in %s", dir)
	}

	return discovered, nil
}

// Count returns the total number of quadlet files
func (d *DiscoveredQuadlets) Count() int {
	return len(d.Files)
}

// HasType checks if any files of the given type exist
func (d *DiscoveredQuadlets) HasType(quadletType string) bool {
	switch quadletType {
	case "container":
		return len(d.Containers) > 0
	case "volume":
		return len(d.Volumes) > 0
	case "network":
		return len(d.Networks) > 0
	case "pod":
		return len(d.Pods) > 0
	case "kube":
		return len(d.Kubes) > 0
	case "image":
		return len(d.Images) > 0
	default:
		return false
	}
}

// Summary returns a summary string of discovered quadlets
func (d *DiscoveredQuadlets) Summary() string {
	summary := fmt.Sprintf("Found %d quadlet file(s):\n", d.Count())

	if len(d.Containers) > 0 {
		summary += fmt.Sprintf("  - %d container(s)\n", len(d.Containers))
	}
	if len(d.Volumes) > 0 {
		summary += fmt.Sprintf("  - %d volume(s)\n", len(d.Volumes))
	}
	if len(d.Networks) > 0 {
		summary += fmt.Sprintf("  - %d network(s)\n", len(d.Networks))
	}
	if len(d.Pods) > 0 {
		summary += fmt.Sprintf("  - %d pod(s)\n", len(d.Pods))
	}
	if len(d.Kubes) > 0 {
		summary += fmt.Sprintf("  - %d kube(s)\n", len(d.Kubes))
	}
	if len(d.Images) > 0 {
		summary += fmt.Sprintf("  - %d image(s)\n", len(d.Images))
	}

	return summary
}
