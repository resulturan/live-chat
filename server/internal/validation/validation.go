package validation

import (
	"regexp"
	"strings"
)

type ValidationError struct {
	Field   string
	Message string
}

func (e *ValidationError) Error() string {
	return e.Message
}

func ValidateUsername(username string) error {
	if strings.TrimSpace(username) == "" {
		return &ValidationError{
			Field:   "username",
			Message: "Username is required",
		}
	}

	if len(username) < 3 {
		return &ValidationError{
			Field:   "username",
			Message: "Username must be at least 3 characters long",
		}
	}

	if len(username) > 20 {
		return &ValidationError{
			Field:   "username",
			Message: "Username must be less than 20 characters long",
		}
	}

	validUsername := regexp.MustCompile(`^[a-zA-Z0-9_-]+$`)
	if !validUsername.MatchString(username) {
		return &ValidationError{
			Field:   "username",
			Message: "Username can only contain letters, numbers, underscores, and hyphens",
		}
	}

	return nil
}

func ValidateMessage(message string) error {
	if strings.TrimSpace(message) == "" {
		return &ValidationError{
			Field:   "message",
			Message: "Message is required",
		}
	}

	if len(message) > 1000 {
		return &ValidationError{
			Field:   "message",
			Message: "Message must be less than 1000 characters long",
		}
	}

	// Check for potentially harmful content
	harmfulPatterns := []string{
		`<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>`, // Script tags
		`javascript:`, // JavaScript protocol
		`data:`,      // Data protocol
		`vbscript:`,  // VBScript protocol
	}

	for _, pattern := range harmfulPatterns {
		matched, err := regexp.MatchString(pattern, message)
		if err != nil {
			continue
		}
		if matched {
			return &ValidationError{
				Field:   "message",
				Message: "Message contains potentially harmful content",
			}
		}
	}

	return nil
} 