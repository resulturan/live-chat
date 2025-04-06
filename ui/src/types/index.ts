export interface ServerResponse<T> {
    code: string;
    status: number;
    message: string;
    data: T;
}

export interface SocketMessage {
    action: SocketAction;
    text?: string;
    senderId?: string;
}

export enum SocketAction {
    SEND_MESSAGE = "send_message",
    HEARTBEAT = "heartbeat",
}

export * from "./Message";
export * from "./AppState";
export * from "./User";
