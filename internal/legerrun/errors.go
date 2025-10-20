package legerrun

import (
	"errors"
	"fmt"
)

// Custom error types for leger.run API responses
var (
	ErrAccountNotLinked            = errors.New("account_not_linked")
	ErrInvalidToken                = errors.New("invalid_token")
	ErrTailscaleVerificationFailed = errors.New("tailscale_verification_failed")
	ErrSecretNotFound              = errors.New("secret_not_found")
	ErrInsufficientPermissions     = errors.New("insufficient_permissions")
)

// ParseErrorCode converts an error code string from the API to a typed error
func ParseErrorCode(code string) error {
	switch code {
	case "account_not_linked":
		return ErrAccountNotLinked
	case "invalid_token":
		return ErrInvalidToken
	case "tailscale_verification_failed":
		return ErrTailscaleVerificationFailed
	case "secret_not_found":
		return ErrSecretNotFound
	case "insufficient_permissions":
		return ErrInsufficientPermissions
	default:
		return fmt.Errorf("unknown error: %s", code)
	}
}
