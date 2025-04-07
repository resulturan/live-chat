import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import dayjs from "dayjs";
import { CreateMessage, Message, ServerResponse, User } from "../types";
import { chatSocket } from "./socket";

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: builder => ({
        getMessages: builder.infiniteQuery<
            Message[],
            { limit: number },
            number
        >({
            query: ({ pageParam, queryArg }) => ({
                url: `message`,
                params: { offset: pageParam, limit: queryArg.limit },
            }),
            transformResponse: (response: ServerResponse<Message[]>) => {
                return (
                    response.data?.sort((a, b) =>
                        dayjs(a.createdAt).diff(dayjs(b.createdAt))
                    ) || []
                );
            },

            infiniteQueryOptions: {
                initialPageParam: 0,
                getNextPageParam: (lastPage, pages) => {
                    return pages?.flat().length ?? 0;
                },
            },
        }),
        getOrCreateUser: builder.mutation<ServerResponse<User>, string>({
            query: username => ({
                url: `profile/get-or-create`,
                method: "POST",
                body: { username },
            }),
        }),
        getMessageCount: builder.query<number, void>({
            query: () => ({
                url: `message/count`,
            }),
            transformResponse: (response: ServerResponse<number>) => {
                return response.data;
            },
        }),
    }),
});

export const {
    useGetMessagesInfiniteQuery,
    useGetOrCreateUserMutation,
    useGetMessageCountQuery,
} = chatApi;
