package websocket

import (
	"encoding/json"
	"net/http"

	"github.com/charmbracelet/log"

	"github.com/gorilla/websocket"

	"resulturan/live-chat-server/api/message"
	"resulturan/live-chat-server/api/message/dto"
	"resulturan/live-chat-server/api/user"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type WebSocketServer struct {
	clients        map[*websocket.Conn]bool
	broadcast      chan []byte
	register       chan *websocket.Conn
	unregister     chan *websocket.Conn
	messageService message.Service
	userService    user.Service
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func NewWebSocketServer(messageService message.Service, userService user.Service) *WebSocketServer {
	return &WebSocketServer{
		clients:        make(map[*websocket.Conn]bool),
		broadcast:      make(chan []byte),
		register:       make(chan *websocket.Conn),
		unregister:     make(chan *websocket.Conn),
		messageService: messageService,
		userService:    userService,
	}
}

func (ws *WebSocketServer) Run() {
	http.HandleFunc("/ws/chat", ws.HandleConnections)
	go ws.handleMessages()
	log.Fatal("listen and serve", "err", http.ListenAndServe(":3001", nil))
}

func (ws *WebSocketServer) handleMessages() {
	for {
		select {
		case conn := <-ws.register:
			ws.clients[conn] = true
		case conn := <-ws.unregister:
			if _, ok := ws.clients[conn]; ok {
				delete(ws.clients, conn)
				conn.Close()
			}
		case message := <-ws.broadcast:
			for conn := range ws.clients {
				err := conn.WriteMessage(websocket.TextMessage, message)
				if err != nil {
					log.Info("Error writing message", "err", err)
					conn.Close()
					delete(ws.clients, conn)
				}
			}
		}
	}
}

func (ws *WebSocketServer) HandleConnections(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Info("Error upgrading to websocket", "err", err)
		return
	}
	defer conn.Close()

	log.Info("Client connected", "addr", conn.RemoteAddr())

	ws.register <- conn

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Info("Error reading message", "err", err)
			ws.unregister <- conn
			break
		}

		var request map[string]interface{}
		if err := json.Unmarshal(message, &request); err != nil {
			log.Info("Error parsing message", "err", err)
			continue
		}

		action, ok := request["action"].(string)
		if !ok {
			log.Info("Invalid action")
			continue
		}

		switch action {
		case "send_message":
			senderID := request["senderId"].(string)

			if err != nil {
				log.Info("Invalid sender ID")
				continue
			}

			message := dto.CreateMessage{
				SenderId: senderID,
				Text:     request["text"].(string),
			}

			createdMessage, err := ws.messageService.CreateMessage(&message)
			if err != nil {
				log.Info("Error creating message", "err", err)
				continue
			}

			senderObjId, err := primitive.ObjectIDFromHex(senderID)
			if err != nil {
				log.Info("Invalid sender ID")
				continue
			}

			user, err := ws.userService.FindUserById(senderObjId)
			if err != nil {
				log.Info("Error getting user", "err", err)
				continue
			}

			createdMessage.User = user

			// Marshal the created message for broadcasting
			broadcastMessage, err := json.Marshal(createdMessage)
			if err != nil {
				log.Info("Error marshalling broadcast message", "err", err)
				continue
			}
			ws.broadcast <- broadcastMessage

			log.Info("Message sent successfully")

		case "heartbeat":
			log.Info("Heartbeat received")
			conn.WriteMessage(websocket.TextMessage, []byte("heartbeat"))

		default:
			log.Info("Unknown action")
		}
	}
}
