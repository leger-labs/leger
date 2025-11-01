package main

import (
	"fmt"
	"os"

	"github.com/leger-labs/leger/internal/cli"
)

func main() {
	if err := cli.RootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
