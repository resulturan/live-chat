package validation

import (
	"regexp"
	"strings"

	"resulturan/live-chat-server/internal/errors"
)

func ValidateUsername(username string) error {
	if strings.TrimSpace(username) == "" {
		return errors.NewRequiredError("username")
	}

	if len(username) < 3 {
		return errors.NewLengthError("username", 3, 20)
	}

	if len(username) > 20 {
		return errors.NewLengthError("username", 3, 20)
	}

	validUsername := regexp.MustCompile(`^[a-zA-Z0-9_-]+$`)
	if !validUsername.MatchString(username) {
		return errors.NewFormatError("username", "Username can only contain letters, numbers, underscores, and hyphens")
	}

	return nil
}

func ValidateMessage(message string) error {
	if strings.TrimSpace(message) == "" {
		return errors.NewRequiredError("message")
	}

	if len(message) > 1000 {
		return errors.NewLengthError("message", 1, 1000)
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
			return errors.NewContentError("message", "Message contains potentially harmful content")
		}
	}

	return nil
} 