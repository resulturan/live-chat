package dto

import (
	"fmt"

	"github.com/go-playground/validator/v10"
)

type CreateUser struct {
	Username string `json:"username" binding:"required" validate:"required"`
}

func EmptyCreateUser() *CreateUser {
	return &CreateUser{}
}

func (d *CreateUser) GetValue() *CreateUser {
	return d
}

func (d *CreateUser) ValidateErrors(errs validator.ValidationErrors) ([]string, error) {
	errors := make([]string, len(errs))
	for i, err := range errs {
		errors[i] = fmt.Sprintf("%s: %s", err.Field(), err.Error())
	}
	return errors, nil
}
