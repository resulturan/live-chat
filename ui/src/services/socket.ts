import { Message, SocketAction, SocketMessage } from "../types";

export class SocketService {
    private socket: WebSocket | null = null;
    private subscriptions: ((message: Message) => void)[] = [];

    constructor(public url: string) {
        this.connect();
    }

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

                const data = JSON.parse(event.data);
                this.subscriptions.forEach(subscription => subscription(data));
            };

            this.socket.onerror = event => {
                console.error("WebSocket error:", event);
                reject(false);
            };

            this.socket.onclose = () => {
                console.log("Disconnected from the server");
                this.tryReconnect();
                reject(false);
            };
        });
    }

    public disconnect() {
        this.socket?.close();
    }

    public sendMessage(message: SocketMessage) {
        if (this.socket?.readyState !== WebSocket.OPEN) return;
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
                        console.error(
                            "Max attempts reached, failed to reconnect to the server"
                        );
                    }
                }
            });
        };

        attempt();
    }
}

export const chatSocket = new SocketService("/ws/chat");

chatSocket.subscribe(message => {
    console.log(message);
});
