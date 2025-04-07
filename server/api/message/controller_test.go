package message

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"resulturan/live-chat-server/api/message/dto"
	messageModel "resulturan/live-chat-server/api/message/model"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MockService struct {
	mock.Mock
}

func (m *MockService) CreateMessage(dto *dto.CreateMessage) (*messageModel.Message, error) {
	args := m.Called(dto)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*messageModel.Message), args.Error(1)
}

func (m *MockService) GetMessageList(dto *dto.GetMessages) ([]*messageModel.Message, error) {
	args := m.Called(dto)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*messageModel.Message), args.Error(1)
}

func (m *MockService) GetMessageCount() (int64, error) {
	args := m.Called()
	if args.Get(0) == nil {
		return 0, args.Error(1)
	}
	return args.Get(0).(int64), args.Error(1)
}

func setupRouter(service Service) *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	controller := NewController(service)
	controller.MountRoutes(router.Group("/api/message"))
	return router
}

func TestCreateMessageHandler(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    dto.CreateMessage
		mockMessage    *messageModel.Message
		mockError      error
		expectedStatus int
	}{
		{
			name: "successful message creation",
			requestBody: dto.CreateMessage{
				Text:     "Hello, World!",
				SenderId: primitive.NewObjectID().Hex(),
			},
			mockMessage: &messageModel.Message{
				ID:        primitive.NewObjectID(),
				Text:      "Hello, World!",
				SenderId:  primitive.NewObjectID(),
				CreatedAt: time.Now(),
			},
			mockError:      nil,
			expectedStatus: http.StatusOK,
		},
		{
			name: "invalid request body",
			requestBody: dto.CreateMessage{
				Text: "", // Empty text should fail validation
			},
			mockMessage:    nil,
			mockError:      nil,
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockService := new(MockService)
			if tt.expectedStatus == http.StatusOK {
				mockService.On("CreateMessage", &tt.requestBody).Return(tt.mockMessage, tt.mockError)
			}

			router := setupRouter(mockService)
			requestBody, _ := json.Marshal(tt.requestBody)
			req, _ := http.NewRequest("POST", "/api/message", bytes.NewBuffer(requestBody))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
			mockService.AssertExpectations(t)
		})
	}
}

func TestGetMessageListHandler(t *testing.T) {
	tests := []struct {
		name           string
		queryParams    string
		mockMessages   []*messageModel.Message
		mockError      error
		expectedStatus int
	}{
		{
			name:        "successful message list retrieval with pagination",
			queryParams: "?offset=0&limit=20",
			mockMessages: []*messageModel.Message{
				{
					ID:        primitive.NewObjectID(),
					Text:      "Message 1",
					SenderId:  primitive.NewObjectID(),
					CreatedAt: time.Now(),
				},
				{
					ID:        primitive.NewObjectID(),
					Text:      "Message 2",
					SenderId:  primitive.NewObjectID(),
					CreatedAt: time.Now(),
				},
			},
			mockError:      nil,
			expectedStatus: http.StatusOK,
		},
		{
			name:           "empty message list",
			queryParams:    "?offset=0&limit=20",
			mockMessages:   []*messageModel.Message{},
			mockError:      nil,
			expectedStatus: http.StatusOK,
		},
		{
			name:           "error retrieving messages",
			queryParams:    "?offset=0&limit=20",
			mockMessages:   nil,
			mockError:      assert.AnError,
			expectedStatus: http.StatusInternalServerError,
		},
		{
			name:           "invalid offset parameter",
			queryParams:    "?offset=invalid&limit=20",
			mockMessages:   nil,
			mockError:      nil,
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "invalid limit parameter",
			queryParams:    "?offset=0&limit=invalid",
			mockMessages:   nil,
			mockError:      nil,
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "missing offset parameter",
			queryParams:    "?limit=20",
			mockMessages:   nil,
			mockError:      nil,
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "missing limit parameter",
			queryParams:    "?offset=0",
			mockMessages:   nil,
			mockError:      nil,
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockService := new(MockService)
			if tt.expectedStatus == http.StatusOK {
				mockService.On("GetMessageList", &dto.GetMessages{
					Offset: &[]int{0}[0],
					Limit:  &[]int{20}[0],
				}).Return(tt.mockMessages, tt.mockError)
			}

			router := setupRouter(mockService)
			req, _ := http.NewRequest("GET", "/api/message"+tt.queryParams, nil)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
			mockService.AssertExpectations(t)

			if tt.expectedStatus == http.StatusOK {
				var response struct {
					Status int         `json:"status"`
					Data   interface{} `json:"data"`
				}
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Equal(t, http.StatusOK, response.Status)
				
				if tt.mockMessages != nil {
					var messages []*messageModel.Message
					messageBytes, _ := json.Marshal(response.Data)
					err = json.Unmarshal(messageBytes, &messages)
					assert.NoError(t, err)
					assert.Equal(t, len(tt.mockMessages), len(messages))
				}
			}
		})
	}
}

func TestGetMessageCountHandler(t *testing.T) {
	tests := []struct {
		name           string
		mockCount      int64
		mockError      error
		expectedStatus int
	}{
		{
			name:           "successful count retrieval",
			mockCount:      42,
			mockError:      nil,
			expectedStatus: http.StatusOK,
		},
		{
			name:           "error retrieving count",
			mockCount:      0,
			mockError:      assert.AnError,
			expectedStatus: http.StatusInternalServerError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockService := new(MockService)
			if tt.expectedStatus == http.StatusOK {
				mockService.On("GetMessageCount").Return(tt.mockCount, tt.mockError)
			}

			router := setupRouter(mockService)
			req, _ := http.NewRequest("GET", "/api/message/count", nil)

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
			mockService.AssertExpectations(t)

			if tt.expectedStatus == http.StatusOK {
				var response struct {
					Status int   `json:"status"`
					Data   int64 `json:"data"`
				}
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Equal(t, http.StatusOK, response.Status)
				assert.Equal(t, tt.mockCount, response.Data)
			}
		})
	}
} 

