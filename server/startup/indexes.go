package startup

import (
	message "resulturan/live-chat-server/api/message/model"
	user "resulturan/live-chat-server/api/user/model"
	"resulturan/live-chat-server/internal/mongo"
)

func EnsureDbIndexes(db mongo.Database) {
	go mongo.Document[user.User](&user.User{}).EnsureIndexes(db)
	go mongo.Document[message.Message](&message.Message{}).EnsureIndexes(db)
}
