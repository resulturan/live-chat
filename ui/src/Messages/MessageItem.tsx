import { Divider, Typography } from "antd";
import cs from "classnames";
import dayjs from "dayjs";
import { selectUser, useAppSelector } from "../store";
import { Message } from "../types/Message";
import Styles from "./Styles.module.scss";

export default function MessageItem({ message, lastOfDay }: MessageItemProps) {
    const user = useAppSelector(selectUser);

    const isMine = message.user?.username === user?.username;

    const getDateText = () => {
        const date = dayjs(message.createdAt);
        const isToday = date.isSame(dayjs(), "day");
        const isYesterday = date.isSame(dayjs().subtract(1, "day"), "day");

        if (isToday) return "Today";
        if (isYesterday) return "Yesterday";
        return date.format("MMM D, YYYY");
    };

    return (
        <>
            {lastOfDay && (
                <Divider className={Styles.dateDivider}>
                    {getDateText()}
                </Divider>
            )}
            <div className={Styles.messageRow} id={message.id}>
                {!isMine && <div className={Styles.leftArrow} />}
                <div
                    className={cs(Styles.messageBox, {
                        [Styles.mine]: isMine,
                    })}
                >
                    {!isMine && (
                        <Typography.Text
                            className={Styles.messageHeader}
                            strong
                        >
                            {message?.user?.username}
                        </Typography.Text>
                    )}

                    <Typography.Text className={Styles.messageContent}>
                        {message.text}
                    </Typography.Text>

                    <Typography.Text className={Styles.messageTime}>
                        {dayjs(message.createdAt).format("HH:mm")}
                    </Typography.Text>
                </div>
                {isMine && <div className={Styles.rightArrow} />}
            </div>
        </>
    );
}

interface MessageItemProps {
    message: Message;
    lastOfDay: boolean;
}
