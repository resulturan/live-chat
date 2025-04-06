package model

import (
	"context"
	"time"

	"resulturan/live-chat-server/internal/mongo"

	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	mongod "go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const UserCollectionName = "users"

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserName  string             `bson:"username" validate:"required,max=200,unique" json:"username"`
	CreatedAt time.Time          `bson:"createdAt,omitempty" json:"createdAt"`
	UpdatedAt time.Time          `bson:"updatedAt,omitempty" json:"updatedAt"`
}

func NewUser(username string) (*User, error) {
	now := time.Now()
	u := User{
		UserName:  username,
		CreatedAt: now,
		UpdatedAt: now,
	}
	return &u, nil
}

func (user *User) GetValue() *User {
	return user
}

func (user *User) Validate() error {
	validate := validator.New()
	return validate.Struct(user)
}

func (*User) EnsureIndexes(db mongo.Database) {
	indexes := []mongod.IndexModel{
		{
			Keys: bson.D{
				{Key: "_id", Value: 1},
			},
		},
		{
			Keys: bson.D{
				{Key: "username", Value: 1},
			},
			Options: options.Index().SetUnique(true),
		},
	}
	mongo.NewQueryBuilder[User](db, UserCollectionName).Query(context.Background()).CreateIndexes(indexes)
}
