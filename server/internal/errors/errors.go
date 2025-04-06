package errors

import (
	"fmt"
	"net/http"
)

// ErrorType represents the type of error
type ErrorType string

const (
	// Validation errors
	ErrorTypeValidation ErrorType = "VALIDATION_ERROR"
	ErrorTypeRequired   ErrorType = "REQUIRED_ERROR"
	ErrorTypeLength     ErrorType = "LENGTH_ERROR"
	ErrorTypeFormat     ErrorType = "FORMAT_ERROR"
	ErrorTypeContent    ErrorType = "CONTENT_ERROR"

	// Authentication errors
	ErrorTypeAuth        ErrorType = "AUTHENTICATION_ERROR"
	ErrorTypeUnauthorized ErrorType = "UNAUTHORIZED_ERROR"

	// Database errors
	ErrorTypeDB        ErrorType = "DATABASE_ERROR"
	ErrorTypeDuplicate ErrorType = "DUPLICATE_ERROR"
	ErrorTypeNotFound  ErrorType = "NOT_FOUND_ERROR"

	// WebSocket errors
	ErrorTypeWebSocket ErrorType = "WEBSOCKET_ERROR"
	ErrorTypeConnection ErrorType = "CONNECTION_ERROR"

	// System errors
	ErrorTypeSystem ErrorType = "SYSTEM_ERROR"
)

// AppError represents a custom application error
type AppError struct {
	Type    ErrorType `json:"type"`
	Code    int       `json:"code"`
	Message string    `json:"message"`
	Field   string    `json:"field,omitempty"`
	Err     error     `json:"-"`
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

func (e *AppError) Unwrap() error {
	return e.Err
}

// NewAppError creates a new application error
func NewAppError(errorType ErrorType, code int, message string, field string, err error) *AppError {
	return &AppError{
		Type:    errorType,
		Code:    code,
		Message: message,
		Field:   field,
		Err:     err,
	}
}

// Validation Errors
func NewValidationError(message string, field string) *AppError {
	return NewAppError(ErrorTypeValidation, http.StatusBadRequest, message, field, nil)
}

func NewRequiredError(field string) *AppError {
	return NewAppError(ErrorTypeRequired, http.StatusBadRequest, fmt.Sprintf("%s is required", field), field, nil)
}

func NewLengthError(field string, min, max int) *AppError {
	return NewAppError(ErrorTypeLength, http.StatusBadRequest, 
		fmt.Sprintf("%s must be between %d and %d characters", field, min, max), field, nil)
}

func NewFormatError(field string, message string) *AppError {
	return NewAppError(ErrorTypeFormat, http.StatusBadRequest, message, field, nil)
}

func NewContentError(field string, message string) *AppError {
	return NewAppError(ErrorTypeContent, http.StatusBadRequest, message, field, nil)
}

// Authentication Errors
func NewAuthError(message string) *AppError {
	return NewAppError(ErrorTypeAuth, http.StatusUnauthorized, message, "", nil)
}

func NewUnauthorizedError(message string) *AppError {
	return NewAppError(ErrorTypeUnauthorized, http.StatusForbidden, message, "", nil)
}

// Database Errors
func NewDBError(err error) *AppError {
	return NewAppError(ErrorTypeDB, http.StatusInternalServerError, "Database error occurred", "", err)
}

func NewDuplicateError(field string) *AppError {
	return NewAppError(ErrorTypeDuplicate, http.StatusConflict, 
		fmt.Sprintf("%s already exists", field), field, nil)
}

func NewNotFoundError(field string) *AppError {
	return NewAppError(ErrorTypeNotFound, http.StatusNotFound, 
		fmt.Sprintf("%s not found", field), field, nil)
}

// WebSocket Errors
func NewWebSocketError(message string, err error) *AppError {
	return NewAppError(ErrorTypeWebSocket, http.StatusInternalServerError, message, "", err)
}

func NewConnectionError(message string) *AppError {
	return NewAppError(ErrorTypeConnection, http.StatusBadRequest, message, "", nil)
}

// System Errors
func NewSystemError(err error) *AppError {
	return NewAppError(ErrorTypeSystem, http.StatusInternalServerError, "Internal server error", "", err)
} 