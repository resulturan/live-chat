FROM golang:1.24.2-alpine

RUN adduser --disabled-password --gecos '' gouser

RUN mkdir -p /home/gouser/go-server

WORKDIR /home/gouser/go-server

COPY . .

RUN chown -R gouser:gouser /home/gouser/go-server

USER gouser

RUN go mod tidy
RUN go build -o build/server cmd/main.go

EXPOSE 3000

CMD ["./build/server"]
