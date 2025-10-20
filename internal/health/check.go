package health

import (
	"context"
	"fmt"
	"net/http"
	"time"
)

// Status represents the health status of a service
type Status string

const (
	StatusHealthy   Status = "healthy"
	StatusUnhealthy Status = "unhealthy"
	StatusUnknown   Status = "unknown"
)

// HealthCheck represents a health check configuration
type HealthCheck struct {
	URL      string        // HTTP endpoint to check
	Timeout  time.Duration // Request timeout
	Expected int           // Expected HTTP status code (default: 200)
}

// Result represents the result of a health check
type Result struct {
	Status       Status
	StatusCode   int
	ResponseTime time.Duration
	Error        error
}

// Check performs a health check
func (h *HealthCheck) Check(ctx context.Context) *Result {
	if h.URL == "" {
		return &Result{
			Status: StatusUnknown,
			Error:  fmt.Errorf("no health check URL configured"),
		}
	}

	// Default expected status code
	expectedCode := h.Expected
	if expectedCode == 0 {
		expectedCode = http.StatusOK
	}

	// Default timeout
	timeout := h.Timeout
	if timeout == 0 {
		timeout = 5 * time.Second
	}

	// Create context with timeout
	checkCtx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	// Perform HTTP request
	startTime := time.Now()

	req, err := http.NewRequestWithContext(checkCtx, "GET", h.URL, nil)
	if err != nil {
		return &Result{
			Status:       StatusUnhealthy,
			ResponseTime: time.Since(startTime),
			Error:        fmt.Errorf("failed to create request: %w", err),
		}
	}

	client := &http.Client{
		Timeout: timeout,
	}

	resp, err := client.Do(req)
	responseTime := time.Since(startTime)

	if err != nil {
		return &Result{
			Status:       StatusUnhealthy,
			ResponseTime: responseTime,
			Error:        fmt.Errorf("request failed: %w", err),
		}
	}
	defer resp.Body.Close()

	// Check status code
	if resp.StatusCode != expectedCode {
		return &Result{
			Status:       StatusUnhealthy,
			StatusCode:   resp.StatusCode,
			ResponseTime: responseTime,
			Error:        fmt.Errorf("unexpected status code: got %d, expected %d", resp.StatusCode, expectedCode),
		}
	}

	return &Result{
		Status:       StatusHealthy,
		StatusCode:   resp.StatusCode,
		ResponseTime: responseTime,
	}
}

// ParseHealthCheckLabels parses health check configuration from quadlet labels
// Expected label format:
//
//	Label=x-health-url=http://localhost:8080/health
//	Label=x-health-timeout=5s
//	Label=x-health-expected=200
func ParseHealthCheckLabels(labels map[string]string) *HealthCheck {
	hc := &HealthCheck{}

	// Parse URL
	if url, ok := labels["x-health-url"]; ok {
		hc.URL = url
	}

	// Parse timeout
	if timeoutStr, ok := labels["x-health-timeout"]; ok {
		if timeout, err := time.ParseDuration(timeoutStr); err == nil {
			hc.Timeout = timeout
		}
	}

	// Parse expected status code
	if expectedStr, ok := labels["x-health-expected"]; ok {
		var expected int
		if _, err := fmt.Sscanf(expectedStr, "%d", &expected); err == nil {
			hc.Expected = expected
		}
	}

	// Return nil if no URL configured
	if hc.URL == "" {
		return nil
	}

	return hc
}
