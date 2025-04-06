import { User } from "./User";

export interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: string;
    updatedAt: string;
    user: User | null;
}

export function CreateMessage(message: Partial<Message>): Message {
    return {
        id: message.id || "",
        text: message.text || "",
        senderId: message.senderId || "",
        createdAt: message.createdAt || new Date().toISOString(),
        updatedAt: message.updatedAt || new Date().toISOString(),
        user: message.user || null,
    };
}
