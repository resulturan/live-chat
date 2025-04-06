package startup

import (
	"context"

	"resulturan/live-chat-server/api/message"
	"resulturan/live-chat-server/api/user"
	"resulturan/live-chat-server/config"
	"resulturan/live-chat-server/internal/mongo"
	"resulturan/live-chat-server/internal/websocket"

	"resulturan/live-chat-server/internal/network"

	coreMW "resulturan/live-chat-server/internal/middleware"
)

type Module network.Module[module]

type module struct {
	Context         context.Context
	Env             *config.Env
	DB              mongo.Database
	UserService     user.Service
	MessageService  message.Service
	WebSocketServer *websocket.WebSocketServer
}

func (m *module) GetInstance() *module {
	return m
}

func (m *module) Controllers() []network.Controller {
	return []network.Controller{
		user.NewController(m.UserService),
		message.NewController(m.MessageService),
	}
}

func (m *module) RootMiddlewares() []network.RootMiddleware {
	return []network.RootMiddleware{
		coreMW.NewErrorCatcher(),
		coreMW.NewNotFound(),
	}
}

func NewModule(context context.Context, env *config.Env, db mongo.Database) Module {
	userService := user.NewService(db)
	messageService := message.NewService(db)
	webSocketServer := websocket.NewWebSocketServer(messageService, userService)
	go webSocketServer.Run()

	return &module{
		Context:         context,
		Env:             env,
		DB:              db,
		WebSocketServer: webSocketServer,
		MessageService:  messageService,
		UserService:     userService,
	}
}
