package ui

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

// Confirm prompts the user for confirmation
// Returns true if the user confirms (y/Y), false otherwise
// Default is No if user just presses Enter
func Confirm(message string) bool {
	fmt.Printf("%s [y/N]: ", message)

	reader := bufio.NewReader(os.Stdin)
	response, err := reader.ReadString('\n')
	if err != nil {
		return false
	}

	response = strings.TrimSpace(strings.ToLower(response))
	return response == "y" || response == "yes"
}

// ConfirmWithDefault prompts for confirmation with a custom default
func ConfirmWithDefault(message string, defaultYes bool) bool {
	prompt := "[y/N]"
	if defaultYes {
		prompt = "[Y/n]"
	}

	fmt.Printf("%s %s: ", message, prompt)

	reader := bufio.NewReader(os.Stdin)
	response, err := reader.ReadString('\n')
	if err != nil {
		return defaultYes
	}

	response = strings.TrimSpace(strings.ToLower(response))

	// If empty response, use default
	if response == "" {
		return defaultYes
	}

	return response == "y" || response == "yes"
}
