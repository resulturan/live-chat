import { Client, Server } from "mock-socket";
import { CreateMessage, SocketAction } from "../../src/types";

const sockets = {
    mockServer: null as Server | null,
    server: null as Client | null,
};

export function initServer() {
    for (const socket of Object.values(sockets)) {
        socket?.close();
    }

    mockServer();
}

function mockServer() {
    sockets.mockServer = new Server("ws://localhost:8080/ws/chat");

    sockets.mockServer.on("connection", socket => {
        sockets.server = socket;

        socket.on("message", message => {
            const data = JSON.parse(message.toString());
            if (data.action === SocketAction.SEND_MESSAGE) {
                socket.send(
                    JSON.stringify(
                        CreateMessage({
                            id: crypto.randomUUID(),
                            text: data.text,
                            senderId: data.senderId,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            user: {
                                id: data.senderId,
                                username: localStorage.getItem(
                                    "username"
                                ) as string,
                            },
                        })
                    )
                );
            }

            if (data.action === SocketAction.HEARTBEAT) {
                socket.send(SocketAction.HEARTBEAT);
            }
        });
    });
}
