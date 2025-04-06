package user

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"resulturan/live-chat-server/api/user/dto"
	userModel "resulturan/live-chat-server/api/user/model"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// MockService is a mock implementation of the Service interface
type MockService struct {
	mock.Mock
}

func (m *MockService) CreateUser(dto *dto.CreateUser) (*userModel.User, error) {
	args := m.Called(dto)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*userModel.User), args.Error(1)
}

func (m *MockService) GetUserList() ([]*userModel.User, error) {
	args := m.Called()
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*userModel.User), args.Error(1)
}

func (m *MockService) FindUserById(id primitive.ObjectID) (*userModel.User, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*userModel.User), args.Error(1)
}

func (m *MockService) GetOrCreateUser(username string) (*userModel.User, error) {
	args := m.Called(username)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*userModel.User), args.Error(1)
}

func setupRouter(service Service) *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	controller := NewController(service)
	controller.MountRoutes(router.Group("/api/profile"))
	return router
}

func TestCreateUserHandler(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    dto.CreateUser
		mockUser       *userModel.User
		mockError      error
		expectedStatus int
	}{
		{
			name: "successful user creation",
			requestBody: dto.CreateUser{
				Username: "testuser",
			},
			mockUser: &userModel.User{
				ID:        primitive.NewObjectID(),
				UserName:  "testuser",
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
			mockError:      nil,
			expectedStatus: http.StatusOK,
		},
		{
			name: "invalid request body",
			requestBody: dto.CreateUser{
				Username: "", // Empty username should fail validation
			},
			mockUser:       nil,
			mockError:      nil,
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockService := new(MockService)
			if tt.expectedStatus == http.StatusOK {
				mockService.On("CreateUser", &tt.requestBody).Return(tt.mockUser, tt.mockError)
			}

			router := setupRouter(mockService)
			requestBody, _ := json.Marshal(tt.requestBody)
			req, _ := http.NewRequest("POST", "/api/profile", bytes.NewBuffer(requestBody))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)
			mockService.AssertExpectations(t)
		})
	}
}

func TestGetUserListHandler(t *testing.T) {
	tests := []struct {
		name           string
		mockUsers      []*userModel.User
		mockError      error
		expectedStatus int
	}{
		{
			name: "successful user list retrieval",
			mockUsers: []*userModel.User{
				{
					ID:        primitive.NewObjectID(),
					UserName:  "user1",
					CreatedAt: time.Now(),
					UpdatedAt: time.Now(),
				},
				{
					ID:        primitive.NewObjectID(),
					UserName:  "user2",
					CreatedAt: time.Now(),
					UpdatedAt: time.Now(),
				},
			},
			mockError:      nil,
			expectedStatus: http.StatusOK,
		},
		{
			name:           "empty user list",
			mockUsers:      []*userModel.User{},
			mockError:      nil,
			expectedStatus: http.StatusOK,
		},
		{
			name:           "error retrieving users",
			mockUsers:      nil,
			mockError:      assert.AnError,
			expectedStatus: http.StatusInternalServerError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockService := new(MockService)
			mockService.On("GetUserList").Return(tt.mockUsers, tt.mockError)

			router := setupRouter(mockService)
			req, _ := http.NewRequest("GET", "/api/profile", nil)

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
				
				if tt.mockUsers != nil {
					var users []*userModel.User
					userBytes, _ := json.Marshal(response.Data)
					err = json.Unmarshal(userBytes, &users)
					assert.NoError(t, err)
					assert.Equal(t, len(tt.mockUsers), len(users))
				}
			}
		})
	}
}

func TestGetOrCreateUserHandler(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    dto.CreateUser
		mockUser       *userModel.User
		mockError      error
		expectedStatus int
	}{
		{
			name: "successful get or create user",
			requestBody: dto.CreateUser{
				Username: "testuser",
			},
			mockUser: &userModel.User{
				ID:        primitive.NewObjectID(),
				UserName:  "testuser",
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
			mockError:      nil,
			expectedStatus: http.StatusOK,
		},
		{
			name: "invalid request body",
			requestBody: dto.CreateUser{
				Username: "", // Empty username should fail validation
			},
			mockUser:       nil,
			mockError:      nil,
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockService := new(MockService)
			if tt.expectedStatus == http.StatusOK {
				mockService.On("GetOrCreateUser", tt.requestBody.Username).Return(tt.mockUser, tt.mockError)
			}

			router := setupRouter(mockService)
			requestBody, _ := json.Marshal(tt.requestBody)
			req, _ := http.NewRequest("POST", "/api/profile/get-or-create", bytes.NewBuffer(requestBody))
			req.Header.Set("Content-Type", "application/json")

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
			}
		})
	}
} 