package validation

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/leger-labs/leger/pkg/types"
)

// Dependency represents a service dependency relationship
type Dependency struct {
	Service    string   // Service name
	DependsOn  []string // Services this service depends on
	RequiredBy []string // Services that depend on this service
}

// AnalyzeDependencies analyzes dependencies between services in quadlet files
func AnalyzeDependencies(quadletDir string) ([]Dependency, error) {
	// Map of service name -> dependencies
	depMap := make(map[string]*Dependency)

	err := filepath.Walk(quadletDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() {
			return nil
		}

		// Only analyze .container and .pod files
		ext := filepath.Ext(path)
		if ext != ".container" && ext != ".pod" {
			return nil
		}

		// Extract service name from filename
		serviceName := strings.TrimSuffix(filepath.Base(path), ext)

		// Parse dependencies from the file
		deps, err := extractDependencies(path)
		if err != nil {
			return fmt.Errorf("failed to extract dependencies from %s: %w", path, err)
		}

		depMap[serviceName] = &Dependency{
			Service:   serviceName,
			DependsOn: deps,
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	// Build RequiredBy relationships (reverse dependencies)
	for serviceName, dep := range depMap {
		for _, requiredService := range dep.DependsOn {
			if requiredDep, ok := depMap[requiredService]; ok {
				requiredDep.RequiredBy = append(requiredDep.RequiredBy, serviceName)
			}
		}
	}

	// Convert map to slice
	var dependencies []Dependency
	for _, dep := range depMap {
		dependencies = append(dependencies, *dep)
	}

	return dependencies, nil
}

// extractDependencies extracts dependency information from a quadlet file
func extractDependencies(path string) ([]string, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var deps []string
	scanner := bufio.NewScanner(file)
	inUnitSection := false

	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())

		// Track sections
		if strings.HasPrefix(line, "[") && strings.HasSuffix(line, "]") {
			inUnitSection = line == "[Unit]"
			continue
		}

		// Skip empty lines and comments
		if line == "" || strings.HasPrefix(line, "#") || strings.HasPrefix(line, ";") {
			continue
		}

		// Parse dependency directives in [Unit] section
		if inUnitSection {
			// After= specifies ordering
			if strings.HasPrefix(line, "After=") {
				depStr := strings.TrimPrefix(line, "After=")
				deps = append(deps, parseServiceList(depStr)...)
			}

			// Requires= specifies hard dependencies
			if strings.HasPrefix(line, "Requires=") {
				depStr := strings.TrimPrefix(line, "Requires=")
				deps = append(deps, parseServiceList(depStr)...)
			}

			// Wants= specifies soft dependencies
			if strings.HasPrefix(line, "Wants=") {
				depStr := strings.TrimPrefix(line, "Wants=")
				deps = append(deps, parseServiceList(depStr)...)
			}
		}
	}

	if err := scanner.Err(); err != nil {
		return nil, err
	}

	return deps, nil
}

// parseServiceList parses a space-separated list of service names
func parseServiceList(serviceStr string) []string {
	parts := strings.Fields(serviceStr)
	var services []string

	for _, part := range parts {
		// Remove .service extension if present
		serviceName := strings.TrimSuffix(part, ".service")
		if serviceName != "" {
			services = append(services, serviceName)
		}
	}

	return services
}

// DetectCircularDependencies detects circular dependencies in the dependency graph
func DetectCircularDependencies(dependencies []Dependency) []types.CircularDependency {
	var circular []types.CircularDependency

	// Build adjacency list
	graph := make(map[string][]string)
	for _, dep := range dependencies {
		graph[dep.Service] = dep.DependsOn
	}

	// Track visited nodes and current path
	visited := make(map[string]bool)
	recStack := make(map[string]bool)
	currentPath := []string{}

	// DFS to detect cycles
	var dfs func(service string) bool
	dfs = func(service string) bool {
		visited[service] = true
		recStack[service] = true
		currentPath = append(currentPath, service)

		// Check all dependencies
		for _, dep := range graph[service] {
			if !visited[dep] {
				if dfs(dep) {
					return true
				}
			} else if recStack[dep] {
				// Found a cycle - extract the cycle from currentPath
				cycleStart := -1
				for i, s := range currentPath {
					if s == dep {
						cycleStart = i
						break
					}
				}

				if cycleStart >= 0 {
					cycle := make([]string, len(currentPath)-cycleStart)
					copy(cycle, currentPath[cycleStart:])

					circular = append(circular, types.CircularDependency{
						Services: cycle,
					})
				}

				return true
			}
		}

		// Remove from recursion stack and path
		recStack[service] = false
		currentPath = currentPath[:len(currentPath)-1]

		return false
	}

	// Check each service
	for service := range graph {
		if !visited[service] {
			dfs(service)
		}
	}

	return circular
}

// ValidateDependencies validates that all dependencies exist
func ValidateDependencies(dependencies []Dependency) []types.MissingDependency {
	var missing []types.MissingDependency

	// Build set of all services
	services := make(map[string]bool)
	for _, dep := range dependencies {
		services[dep.Service] = true
	}

	// Check each dependency
	for _, dep := range dependencies {
		for _, requiredService := range dep.DependsOn {
			if !services[requiredService] {
				missing = append(missing, types.MissingDependency{
					Service:           dep.Service,
					MissingDependency: requiredService,
				})
			}
		}
	}

	return missing
}
