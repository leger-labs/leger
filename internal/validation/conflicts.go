package validation

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/leger-labs/leger/pkg/types"
)

// CheckPortConflicts checks for port conflicts in quadlet files
func CheckPortConflicts(quadletDir string) ([]types.PortConflict, error) {
	portUsage := make(map[string][]string) // port:protocol -> []quadlet names

	err := filepath.Walk(quadletDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() || filepath.Ext(path) != ".container" {
			return nil
		}

		ports, err := extractPorts(path)
		if err != nil {
			return fmt.Errorf("failed to extract ports from %s: %w", path, err)
		}

		quadletName := filepath.Base(path)
		for _, port := range ports {
			key := port.Host + ":" + port.Protocol
			portUsage[key] = append(portUsage[key], quadletName)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	// Find conflicts
	var conflicts []types.PortConflict
	for portKey, quadlets := range portUsage {
		if len(quadlets) > 1 {
			parts := strings.SplitN(portKey, ":", 2)
			conflict := types.PortConflict{
				Port:     parts[0],
				Protocol: parts[1],
				Quadlets: quadlets,
			}
			conflicts = append(conflicts, conflict)
		}
	}

	return conflicts, nil
}

// extractPorts extracts port mappings from a quadlet file
func extractPorts(path string) ([]types.PortInfo, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var ports []types.PortInfo
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

		// Parse PublishPort= directives
		if inContainerSection && strings.HasPrefix(line, "PublishPort=") {
			portStr := strings.TrimPrefix(line, "PublishPort=")
			port := parsePort(portStr)
			if port != nil {
				ports = append(ports, *port)
			}
		}
	}

	return ports, scanner.Err()
}

// parsePort parses a port mapping string
// Formats: "8080:80", "8080:80/tcp", "127.0.0.1:8080:80"
func parsePort(portStr string) *types.PortInfo {
	portStr = strings.TrimSpace(portStr)

	// Default protocol
	protocol := "tcp"

	// Check for protocol suffix
	if strings.Contains(portStr, "/") {
		parts := strings.SplitN(portStr, "/", 2)
		portStr = parts[0]
		protocol = parts[1]
	}

	// Parse port mapping
	parts := strings.Split(portStr, ":")
	if len(parts) < 2 {
		return nil
	}

	port := &types.PortInfo{
		Protocol: protocol,
	}

	if len(parts) == 2 {
		// Format: "8080:80"
		port.Host = parts[0]
		port.Container = parts[1]
	} else if len(parts) == 3 {
		// Format: "127.0.0.1:8080:80"
		port.Host = parts[1] // Use middle part as host port
		port.Container = parts[2]
	}

	return port
}

// CheckVolumeConflicts checks for volume mount conflicts
func CheckVolumeConflicts(quadletDir string) ([]types.VolumeConflict, error) {
	volumeUsage := make(map[string][]string) // volume name -> []quadlet names

	err := filepath.Walk(quadletDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() {
			return nil
		}

		ext := filepath.Ext(path)
		if ext != ".container" && ext != ".pod" {
			return nil
		}

		volumes, err := extractVolumes(path)
		if err != nil {
			return fmt.Errorf("failed to extract volumes from %s: %w", path, err)
		}

		quadletName := filepath.Base(path)
		for _, vol := range volumes {
			volumeUsage[vol] = append(volumeUsage[vol], quadletName)
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	// Volume sharing is generally OK, so we don't report conflicts
	// This function exists for future enhancement
	var conflicts []types.VolumeConflict

	return conflicts, nil
}

// extractVolumes extracts volume names from a quadlet file
func extractVolumes(path string) ([]string, error) {
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
			inContainerSection = line == "[Container]" || line == "[Pod]"
			continue
		}

		// Skip empty lines and comments
		if line == "" || strings.HasPrefix(line, "#") || strings.HasPrefix(line, ";") {
			continue
		}

		// Parse Volume= directives
		if inContainerSection && strings.HasPrefix(line, "Volume=") {
			volStr := strings.TrimPrefix(line, "Volume=")
			// Volume format: "name:/path" or "/host/path:/container/path"
			parts := strings.SplitN(volStr, ":", 2)
			if len(parts) >= 1 {
				volumes = append(volumes, parts[0])
			}
		}
	}

	return volumes, scanner.Err()
}
