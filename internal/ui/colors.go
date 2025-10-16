// Package ui provides user interface utilities for the CLI
package ui

import "github.com/fatih/color"

// Color functions for consistent output formatting across all commands
var (
	// Success formats text in green for successful operations
	Success = color.New(color.FgGreen).SprintFunc()

	// Error formats text in red for errors
	Error = color.New(color.FgRed).SprintFunc()

	// Warning formats text in yellow for warnings
	Warning = color.New(color.FgYellow).SprintFunc()

	// Info formats text in cyan for informational messages
	Info = color.New(color.FgCyan).SprintFunc()

	// Bold formats text in bold for emphasis
	Bold = color.New(color.Bold).SprintFunc()
)

// SuccessPrintf prints formatted text in green
func SuccessPrintf(format string, args ...interface{}) {
	color.Green(format, args...)
}

// ErrorPrintf prints formatted text in red
func ErrorPrintf(format string, args ...interface{}) {
	color.Red(format, args...)
}

// WarningPrintf prints formatted text in yellow
func WarningPrintf(format string, args ...interface{}) {
	color.Yellow(format, args...)
}

// InfoPrintf prints formatted text in cyan
func InfoPrintf(format string, args ...interface{}) {
	color.Cyan(format, args...)
}
