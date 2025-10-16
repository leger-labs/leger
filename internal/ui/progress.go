package ui

import (
	"github.com/schollz/progressbar/v3"
)

// ShowProgress displays a progress indicator while executing a task
// message: description of the operation being performed
// task: function to execute
func ShowProgress(message string, task func() error) error {
	bar := progressbar.NewOptions(-1,
		progressbar.OptionSetDescription(message),
		progressbar.OptionSetWriter(nil), // Use default stderr
		progressbar.OptionSpinnerType(14),
		progressbar.OptionFullWidth(),
	)
	defer bar.Finish()

	// Start the progress bar spinning
	go func() {
		for {
			bar.Add(1)
		}
	}()

	return task()
}

// ShowProgressWithSteps creates a progress bar with known number of steps
func ShowProgressWithSteps(message string, totalSteps int) *progressbar.ProgressBar {
	return progressbar.NewOptions(totalSteps,
		progressbar.OptionSetDescription(message),
		progressbar.OptionSetWriter(nil),
		progressbar.OptionFullWidth(),
		progressbar.OptionShowCount(),
		progressbar.OptionShowIts(),
		progressbar.OptionSetPredictTime(true),
	)
}
