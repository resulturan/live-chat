package user

import (
	"context"
	"resulturan/live-chat-server/api/user/dto"
	"resulturan/live-chat-server/api/user/model"
	"resulturan/live-chat-server/internal/mongo"
	"resulturan/live-chat-server/internal/network"

	"github.com/charmbracelet/log"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Service interface {
	CreateUser(dto *dto.CreateUser) (*model.User, error)
	GetUserList() ([]*model.User, error)
	FindUserById(id primitive.ObjectID) (*model.User, error)
	GetOrCreateUser(username string) (*model.User, error)
}

type service struct {
	network.BaseService
	userQueryBuilder mongo.QueryBuilder[model.User]
}

func NewService(db mongo.Database) Service {
	return &service{
		BaseService:      network.NewBaseService(),
		userQueryBuilder: mongo.NewQueryBuilder[model.User](db, model.UserCollectionName),
	}
}

func (s *service) FindUserById(id primitive.ObjectID) (*model.User, error) {
	userFilter := bson.M{"_id": id}
	user, err := s.userQueryBuilder.SingleQuery().FindOne(userFilter, nil)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *service) GetOrCreateUser(username string) (*model.User, error) {
	user, err := s.userQueryBuilder.SingleQuery().FindOne(bson.M{"username": username}, nil)
	// if err != nil {
	// 	return nil, err
	// }
	if user == nil {
		user, err = s.CreateUser(&dto.CreateUser{Username: username})
		if err != nil {
			return nil, err
		}
	}
	return user, nil
}

func (s *service) GetUserList() ([]*model.User, error) {
	userList, err := s.userQueryBuilder.Query(context.Background()).FindAll(bson.M{}, nil)
	if err != nil {
		return nil, err
	}

	return userList, nil
}

func (s *service) CreateUser(dto *dto.CreateUser) (*model.User, error) {
	log.Info("create-user", "username", dto.Username)
	user, err := model.NewUser(dto.Username)
	if err != nil {
		return nil, err
	}
	id, err := s.userQueryBuilder.SingleQuery().InsertOne(user)
	if err != nil {
		return nil, err
	}
	user.ID = *id
	return user, nil
}
