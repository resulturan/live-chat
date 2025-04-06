# Live Chat Application

A real-time chat application built with React, TypeScript, and Go. This application allows multiple users to join a single chat session, send messages, and view message history in real-time.

## Features

- Real-time messaging using WebSocket
- Persistent message history with MongoDB
- User authentication (without password)
- Real-time updates without page reload
- Clean and intuitive UI

## Tech Stack

### Frontend
- React with TypeScript
- Redux Toolkit for state management
- Ant Design for UI components
- WebSocket for real-time communication

### Backend
- Go with Gin web framework
- MongoDB for data persistence
- WebSocket for real-time communication
- Gorilla WebSocket for WebSocket implementation

## Prerequisites

- Node.js (v18 or higher)
- Go (v1.20 or higher)
- MongoDB (v5.0 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/resulturan/live-chat.git
cd live-chat
```

2. Install frontend dependencies:
```bash
cd ui
yarn install
```

3. Install backend dependencies:
```bash
cd server
go get ./cmd
```

## Running the Application

1. Start MongoDB:
```bash
# Make sure MongoDB is running on default port 27017
```

2. Start the backend server:
```bash
cd server
go run ./cmd
```

3. Start the frontend development server:
```bash
cd ui
yarn dev
```

The application will be available at `http://localhost`

## Architecture

### Frontend Architecture
- **Components**: React functional components with hooks
- **State Management**: Redux Toolkit for global state
- **Real-time Communication**: WebSocket connection for live updates
- **UI Framework**: Ant Design for consistent and responsive design
- **Reverse Proxy**: Nginx for reverse proxy in production

### Backend Architecture
- **API Layer**: RESTful endpoints using Gin framework
- **WebSocket Layer**: Gorilla WebSocket for real-time communication
- **Data Layer**: MongoDB for persistent storage
- **Service Layer**: Business logic separation

## Testing

### Frontend Tests
```bash
cd ui
yarn test
```

### Backend Tests
```bash
cd server
go test ./...
```

## Improvements and Trade-offs

### Improvements
1. **Scalability**:
   - Implement message pagination for large chat histories
   - Add Redis for caching frequently accessed data
   - Implement message queue for high-volume scenarios

2. **Features**:
   - Add message editing and deletion
   - Implement typing indicators
   - Add file sharing capabilities
   - Implement message reactions

3. **Security**:
   - Add rate limiting
   - Implement message encryption
   - Add user authentication with JWT

### Trade-offs
1. **Real-time vs Performance**:
   - WebSocket provides real-time updates but requires persistent connections
   - Considered polling as an alternative but chose WebSocket for better performance

2. **State Management**:
   - Chose Redux Toolkit over Context API for better debugging and simplicity

3. **Database Choice**:
   - MongoDB provides flexibility
   - Chose MongoDB for its document model which fits chat data well

## Error Handling

- Frontend: Global error boundary and toast notifications
- Backend: Structured error responses and logging
- WebSocket: Automatic reconnection and error recovery

## Deployment

The application can be containerized using Docker:

```bash
# Build and run containers
docker compose up --build
```