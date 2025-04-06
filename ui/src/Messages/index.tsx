import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import { useGetMessagesQuery } from "../services/chat";
import { selectIsAppInitialized, selectUser, useAppSelector } from "../store";
import MessageItem from "./MessageItem";
import Styles from "./Styles.module.scss";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import cs from "classnames";

export default function Messages() {
    const user = useAppSelector(selectUser);
    const isAppInitialized = useAppSelector(selectIsAppInitialized);
    const ref = useRef<HTMLDivElement>(null);
    const { data: messages } = useGetMessagesQuery();

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, []);

    useEffect(() => {
        if (
            ref.current &&
            messages?.[messages.length - 1]?.user?.username === user?.username
        ) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [messages]);

    if (!isAppInitialized)
        return (
            <Spin
                indicator={<LoadingOutlined spin style={{ fontSize: 48 }} />}
                className={cs(Styles.loading, Styles.messages)}
            />
        );

    return (
        <div className={Styles.messages} ref={ref} id="messages-list">
            {messages?.map((message, i) => (
                <MessageItem
                    key={message.id}
                    message={message}
                    lastOfDay={
                        i === 0 ||
                        !dayjs(messages?.[i - 1]?.createdAt).isSame(
                            message.createdAt,
                            "day"
                        )
                    }
                />
            ))}
        </div>
    );
}
