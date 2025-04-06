# Stage 1: Build stage
FROM golang:1.24.2-alpine AS builder

WORKDIR /app

COPY . .

RUN go mod tidy
RUN go build -o server cmd/main.go

# Stage 2: Runner stage
FROM alpine:3.19 AS runner

RUN adduser --disabled-password --gecos '' gouser

RUN mkdir -p /home/gouser/go-server

WORKDIR /app

COPY --from=builder /app/server .

RUN apk --no-cache add ca-certificates tzdata

RUN chown -R gouser:gouser /home/gouser/go-server

USER gouser

EXPOSE 3000

ENTRYPOINT  ["./server"]
