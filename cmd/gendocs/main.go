package main

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/leger-labs/leger/internal/cli"
	"github.com/leger-labs/leger/internal/version"
	"github.com/spf13/cobra"
	"github.com/spf13/cobra/doc"
)

func main() {
	// Define output directories
	manDir := "build/man"
	completionsDir := "build/completions"
	docsDir := "docs/cli"

	// Create output directories
	dirs := []string{
		manDir,
		filepath.Join(completionsDir, "bash"),
		filepath.Join(completionsDir, "fish"),
		filepath.Join(completionsDir, "zsh"),
		docsDir,
	}

	for _, dir := range dirs {
		if err := os.MkdirAll(dir, 0755); err != nil {
			fmt.Fprintf(os.Stderr, "Error creating directory %s: %v\n", dir, err)
			os.Exit(1)
		}
	}

	// Get the root command from leger CLI
	rootCmd := cli.RootCmd

	// Generate man pages
	if err := generateManPages(rootCmd, manDir); err != nil {
		fmt.Fprintf(os.Stderr, "Error generating man pages: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("✓ Generated man pages")

	// Generate shell completions
	if err := generateCompletions(rootCmd, completionsDir); err != nil {
		fmt.Fprintf(os.Stderr, "Error generating completions: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("✓ Generated shell completions")

	// Generate markdown documentation
	if err := generateMarkdownDocs(rootCmd, docsDir); err != nil {
		fmt.Fprintf(os.Stderr, "Error generating markdown docs: %v\n", err)
		os.Exit(1)
	}
	fmt.Println("✓ Generated markdown documentation")

	fmt.Println("\nDocumentation generated successfully!")
	fmt.Printf("  Man pages:    %s/\n", manDir)
	fmt.Printf("  Completions:  %s/\n", completionsDir)
	fmt.Printf("  Web docs:     %s/\n", docsDir)
}

func generateManPages(rootCmd *cobra.Command, outputDir string) error {
	header := &doc.GenManHeader{
		Title:   "LEGER",
		Section: "1",
		Manual:  "Leger Manual",
		Source:  "Leger " + version.String(),
	}

	return doc.GenManTree(rootCmd, header, outputDir)
}

func generateCompletions(rootCmd *cobra.Command, outputDir string) error {
	// Bash completion
	bashFile := filepath.Join(outputDir, "bash", "leger")
	if err := rootCmd.GenBashCompletionFile(bashFile); err != nil {
		return fmt.Errorf("bash completion: %w", err)
	}

	// Fish completion
	fishFile := filepath.Join(outputDir, "fish", "leger.fish")
	if err := rootCmd.GenFishCompletionFile(fishFile, true); err != nil {
		return fmt.Errorf("fish completion: %w", err)
	}

	// Zsh completion
	zshFile := filepath.Join(outputDir, "zsh", "_leger")
	if err := rootCmd.GenZshCompletionFile(zshFile); err != nil {
		return fmt.Errorf("zsh completion: %w", err)
	}

	return nil
}

func generateMarkdownDocs(rootCmd *cobra.Command, outputDir string) error {
	// Generate markdown files using Cobra's default format (one file per command)
	return doc.GenMarkdownTree(rootCmd, outputDir)
}
