package message

import (
	"context"

	"resulturan/live-chat-server/api/message/dto"
	messageModel "resulturan/live-chat-server/api/message/model"
	"resulturan/live-chat-server/internal/mongo"
	"resulturan/live-chat-server/internal/network"

	"github.com/charmbracelet/log"
	"go.mongodb.org/mongo-driver/bson"
)

type Service interface {
	CreateMessage(dto *dto.CreateMessage) (*messageModel.Message, error)
	GetMessageList(dto *dto.GetMessages) ([]*messageModel.Message, error)
	GetMessageCount() (int64, error)
}

type service struct {
	network.BaseService
	messageQueryBuilder mongo.QueryBuilder[messageModel.Message]
}

func NewService(db mongo.Database) Service {
	return &service{
		BaseService:         network.NewBaseService(),
		messageQueryBuilder: mongo.NewQueryBuilder[messageModel.Message](db, messageModel.MessageCollectionName),
	}
}

func (s *service) GetMessageList(dto *dto.GetMessages) ([]*messageModel.Message, error) {
	populateUserState := bson.D{
		{"$lookup", bson.D{
			{"from", "users"},
			{"localField", "senderId"},
			{"foreignField", "_id"},
			{"as", "user"},
		}},
	}
	convertToUser := bson.D{{"$unwind", "$user"}}
	sort := bson.D{{"$sort", bson.D{{"createdAt", -1}}}}
	skip := bson.D{{"$skip", dto.GetOffset()}}
	limit := bson.D{{"$limit", dto.GetLimit()}}
	messageList, err := s.messageQueryBuilder.Query(context.Background()).Aggregate([]bson.D{populateUserState, convertToUser, sort, skip, limit})
	if err != nil {
		log.Error("error getting message list", "error", err)
		return nil, err
	}

	if messageList == nil {
		return []*messageModel.Message{}, nil
	}

	return messageList, nil
}

func (s *service) CreateMessage(dto *dto.CreateMessage) (*messageModel.Message, error) {
	message, err := messageModel.NewMessage(dto.Text, dto.SenderId)
	if err != nil {
		return nil, err
	}
	id, err := s.messageQueryBuilder.SingleQuery().InsertOne(message)
	if err != nil {
		return nil, err
	}
	message.ID = *id
	return message, nil
}

func (s *service) GetMessageCount() (int64, error) {
	count, err := s.messageQueryBuilder.SingleQuery().CountDocuments(bson.M{}, nil)
	if err != nil {
		return 0, err
	}
	return count, nil
}
