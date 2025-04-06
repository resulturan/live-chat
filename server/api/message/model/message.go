package model

import (
	"context"
	"time"

	userModel "resulturan/live-chat-server/api/user/model"
	"resulturan/live-chat-server/internal/mongo"
	"resulturan/live-chat-server/internal/validation"

	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	mongod "go.mongodb.org/mongo-driver/mongo"
)

const MessageCollectionName = "messages"

type Message struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Text      string             `bson:"text" validate:"required,max=1000" json:"text"`
	SenderId  primitive.ObjectID `bson:"senderId" validate:"required" json:"senderId"`
	CreatedAt time.Time          `bson:"createdAt" validate:"required" json:"createdAt"`
	User      *userModel.User   `bson:"user,omitempty" json:"user,omitempty"`
}

func NewMessage(text string, senderId string) (*Message, error) {
	now := time.Now()
	senderObjId, err := primitive.ObjectIDFromHex(senderId)
	if err != nil {
		return nil, err
	}

	// Validate message text
	if err := validation.ValidateMessage(text); err != nil {
		return nil, err
	}

	u := Message{
		Text:      text,
		SenderId:  senderObjId,
		CreatedAt: now,
	}
	return &u, nil
}

func (message *Message) GetValue() *Message {
	return message
}

func (message *Message) Validate() error {
	validate := validator.New()
	return validate.Struct(message)
}

func (*Message) EnsureIndexes(db mongo.Database) {
	indexes := []mongod.IndexModel{
		{
			Keys: bson.D{
				{Key: "_id", Value: 1},
			},
		},
	}
	mongo.NewQueryBuilder[Message](db, MessageCollectionName).Query(context.Background()).CreateIndexes(indexes)
}
