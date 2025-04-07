package dto

import (
	"strings"

	"github.com/go-playground/validator/v10"
)

type GetMessages struct {
	Offset *int `form:"offset" validate:"required,min=0"`
	Limit  *int `form:"limit" validate:"required,min=1"`
}

func (dto *GetMessages) GetValue() *GetMessages {
	return dto
}

func (dto *GetMessages) GetOffset() int {
	return *dto.Offset
}

func (dto *GetMessages) GetLimit() int {
	return *dto.Limit
}

func (dto *GetMessages) ValidateErrors(errs validator.ValidationErrors) ([]string, error) {
	var messages []string
	for _, err := range errs {
		switch err.Field() {
		case "Offset":
			messages = append(messages, "offset is required")
		case "Limit":
			messages = append(messages, "limit is required")
		default:
			messages = append(messages, strings.ToLower(err.Field())+" is invalid")
		}
	}
	return messages, nil
}
