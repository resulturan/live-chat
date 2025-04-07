import { useEffect } from "react";
import { chatApi } from "../services/chat";
import { chatSocket } from "../services/socket";
import { CreateMessage, Message } from "../types";
import { InfiniteData } from "@reduxjs/toolkit/query";
import { useAppDispatch } from "../store";

export function useListenNewMessages(limit: number) {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const onMessage = (action: Message) => {
            dispatch(
                chatApi.util.updateQueryData(
                    "getMessages",
                    { limit },
                    (draft: InfiniteData<Message[], number>) => {
                        const newMessage = CreateMessage(action);
                        if (!newMessage.id) return;
                        draft.pages[0].push(newMessage);
                    }
                )
            );
        };

        chatSocket.subscribe(onMessage);

        return () => {
            chatSocket.unsubscribe(onMessage);
        };
    }, []);
}
