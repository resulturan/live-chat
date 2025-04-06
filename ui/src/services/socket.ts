import { Message, SocketAction, SocketMessage } from "../types";
import { AppError } from "../types/Error";

export class SocketService {
    private socket: WebSocket | null = null;
    private subscriptions: ((message: Message) => void)[] = [];
    private errorHandlers: ((error: AppError) => void)[] = [];

    constructor(public url: string) {}

    public connect(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(this.url);

            this.socket.onopen = () => {
                console.log("Connected to the server");
                this.heartbeat();
                resolve(true);
            };

            this.socket.onmessage = event => {
                if (event.data === "heartbeat") return;

                try {
                    const data = JSON.parse(event.data);
                    if (data.type) {
                        // This is an error message
                        this.handleError(data);
                    } else {
                        // This is a regular message
                        this.subscriptions.forEach(subscription =>
                            subscription(data)
                        );
                    }
                } catch (error) {
                    console.error("Error parsing message:", error);
                    this.handleError({
                        type: "SYSTEM_ERROR",
                        code: 500,
                        message: "Error parsing message from server",
                    });
                }
            };

            this.socket.onerror = event => {
                console.error("WebSocket error:", event);
                this.handleError({
                    type: "WEBSOCKET_ERROR",
                    code: 500,
                    message: "WebSocket connection error",
                });
                reject(false);
            };

            this.socket.onclose = () => {
                console.log("Disconnected from the server");
                this.handleError({
                    type: "CONNECTION_ERROR",
                    code: 500,
                    message: "Disconnected from the server",
                });
                this.tryReconnect();
                reject(false);
            };
        });
    }

    public disconnect() {
        this.socket?.close();
    }

    public sendMessage(message: SocketMessage) {
        if (this.socket?.readyState !== WebSocket.OPEN) {
            if (message?.action !== SocketAction.HEARTBEAT) {
                this.handleError({
                    type: "CONNECTION_ERROR",
                    code: 500,
                    message: "WebSocket is not connected",
                });
            }
            return;
        }
        this.socket?.send(JSON.stringify(message));
    }

    public subscribe(callback: (message: Message) => void) {
        this.subscriptions.push(callback);
    }

    public unsubscribe(callback: (message: Message) => void) {
        this.subscriptions = this.subscriptions.filter(
            subscription => subscription !== callback
        );
    }

    public onError(callback: (error: AppError) => void) {
        this.errorHandlers.push(callback);
    }

    public removeErrorHandler(callback: (error: AppError) => void) {
        this.errorHandlers = this.errorHandlers.filter(
            handler => handler !== callback
        );
    }

    private handleError(error: AppError) {
        this.errorHandlers.forEach(handler => handler(error));
    }

    public heartbeat() {
        this.sendMessage({
            action: SocketAction.HEARTBEAT,
        });
        setTimeout(() => this.heartbeat(), 10000);
    }

    public tryReconnect() {
        let count = 0;
        const maxAttempts = 10;
        const delay = 1000;

        const attempt = () => {
            this.connect().then(success => {
                if (success) count = 0;
                else {
                    count++;
                    if (count < maxAttempts) {
                        setTimeout(attempt, delay * Math.min(count, 3));
                    } else {
                        this.handleError({
                            type: "CONNECTION_ERROR",
                            code: 500,
                            message:
                                "Max attempts reached, failed to reconnect to the server",
                        });
                    }
                }
            });
        };

        attempt();
    }
}

export const chatSocket = new SocketService(
    `ws://${window.location.host}/ws/chat`
);
