import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import dayjs from "dayjs";
import { CreateMessage, Message, ServerResponse, User } from "../types";
import { chatSocket } from "./socket";

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: builder => ({
        getMessages: builder.query<Message[], void>({
            query: () => `message`,
            transformResponse: (response: ServerResponse<Message[]>) => {
                return (
                    response.data?.sort((a, b) =>
                        dayjs(a.createdAt).diff(dayjs(b.createdAt))
                    ) || []
                );
            },

            async onCacheEntryAdded(_arg, api) {
                const onMessage = (action: Message) => {
                    api.updateCachedData(draft => {
                        const newMessage = CreateMessage(action);
                        if (!newMessage.id) return;
                        draft.push(newMessage);
                    });
                };

                chatSocket.subscribe(onMessage);

                await api.cacheEntryRemoved;

                chatSocket.unsubscribe(onMessage);
            },
        }),
        getOrCreateUser: builder.mutation<ServerResponse<User>, string>({
            query: username => ({
                url: `profile/get-or-create`,
                method: "POST",
                body: { username },
            }),
        }),
    }),
});

export const { useGetMessagesQuery, useGetOrCreateUserMutation } = chatApi;
