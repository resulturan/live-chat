package dto

import (
	"fmt"

	"github.com/go-playground/validator/v10"
)

type CreateMessage struct {
	Text     string `json:"text" binding:"required" validate:"required"`
	SenderId string `json:"senderId" binding:"required" validate:"required"`
}

func EmptyCreateMessage() *CreateMessage {
	return &CreateMessage{}
}

func (d *CreateMessage) GetValue() *CreateMessage {
	return d
}

func (d *CreateMessage) ValidateErrors(errs validator.ValidationErrors) ([]string, error) {
	errors := make([]string, len(errs))
	for i, err := range errs {
		errors[i] = fmt.Sprintf("%s: %s", err.Field(), err.Error())
	}
	return errors, nil
}
