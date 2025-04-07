import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import cs from "classnames";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import {
    useGetMessagesInfiniteQuery,
    useGetMessageCountQuery,
} from "../services/chat";
import { selectIsAppInitialized, useAppSelector } from "../store";
import MessageItem from "./MessageItem";
import Styles from "./Styles.module.scss";
import InfiniteScroll from "react-infinite-scroll-component";
import { useListenNewMessages } from "./useListenNewMessages";

const LIMIT = 100;
export default function Messages() {
    const isAppInitialized = useAppSelector(selectIsAppInitialized);
    const ref = useRef<HTMLDivElement>(null);
    const { data: messageCount } = useGetMessageCountQuery();
    useListenNewMessages(LIMIT);
    const { messages, fetchNextPage, isSuccess } = useGetMessagesInfiniteQuery(
        { limit: LIMIT },
        {
            selectFromResult: ({ data = { pages: [] }, ...rest }) => {
                return {
                    messages: [...data?.pages].reverse().flat().reverse() || [],
                    ...rest,
                };
            },
        }
    );

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [isSuccess]);

    if (!isAppInitialized)
        return (
            <Spin
                indicator={<LoadingOutlined spin style={{ fontSize: 48 }} />}
                className={cs(Styles.loading, Styles.messages)}
            />
        );

    return (
        <div className={Styles.messages} ref={ref} id="messages-list">
            <InfiniteScroll
                dataLength={messages?.length || 0}
                next={fetchNextPage}
                hasMore={Boolean(
                    messageCount && messageCount > messages?.length
                )}
                loader={
                    <Spin
                        indicator={
                            <LoadingOutlined spin style={{ fontSize: 48 }} />
                        }
                        className={cs(Styles.loading, Styles.messages)}
                    />
                }
                endMessage={
                    <div className={Styles.endMessage}>
                        <p>No more messages</p>
                    </div>
                }
                style={{
                    display: "flex",
                    flexDirection: "column-reverse",
                    overflow: "visible",
                }}
                scrollableTarget="messages-list"
                inverse={true}
            >
                {messages?.map((message, i) => (
                    <MessageItem
                        key={message.id}
                        message={message}
                        index={i}
                        lastOfDay={
                            i === messages.length ||
                            !dayjs(messages?.[i + 1]?.createdAt).isSame(
                                message.createdAt,
                                "day"
                            )
                        }
                    />
                ))}
            </InfiniteScroll>
        </div>
    );
}
