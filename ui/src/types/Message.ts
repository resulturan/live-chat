import { User } from "./User";

export interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: Date;
    updatedAt: Date;
    user: User | null;
}

export function CreateMessage(message: Partial<Message>): Message {
    return {
        id: message.id || "",
        text: message.text || "",
        senderId: message.senderId || "",
        createdAt: message.createdAt || new Date(),
        updatedAt: message.updatedAt || new Date(),
        user: message.user || null,
    };
}
