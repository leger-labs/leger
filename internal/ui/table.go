package ui

import (
	"bytes"
	"fmt"
	"strings"
)

// FormatTable formats data as a table with the specified headers and rows
func FormatTable(headers []string, rows [][]string) string {
	var buf bytes.Buffer

	// Calculate column widths
	widths := make([]int, len(headers))
	for i, h := range headers {
		widths[i] = len(h)
	}
	for _, row := range rows {
		for i, cell := range row {
			if i < len(widths) && len(cell) > widths[i] {
				widths[i] = len(cell)
			}
		}
	}

	// Print header
	for i, h := range headers {
		buf.WriteString(fmt.Sprintf("%-*s  ", widths[i], h))
	}
	buf.WriteString("\n")

	// Print separator
	for _, w := range widths {
		buf.WriteString(strings.Repeat("-", w))
		buf.WriteString("  ")
	}
	buf.WriteString("\n")

	// Print rows
	for _, row := range rows {
		for i, cell := range row {
			if i < len(widths) {
				buf.WriteString(fmt.Sprintf("%-*s  ", widths[i], cell))
			}
		}
		buf.WriteString("\n")
	}

	return buf.String()
}

// PrintTable prints a table directly to stdout
func PrintTable(headers []string, rows [][]string) {
	fmt.Print(FormatTable(headers, rows))
}
