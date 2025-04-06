import { SendOutlined, SmileOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, App } from "antd";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { chatSocket } from "../services/socket";
import { selectUser, useAppSelector } from "../store";
import { SocketAction } from "../types";
import Styles from "./Styles.module.scss";
import { validateMessage } from "../utils/validation";

export default function NewMessage() {
    const { notification } = App.useApp();
    const [message, setMessage] = useState("");
    const user = useAppSelector(selectUser);

    function onSendMessage() {
        if (!user?.id) return;

        const validation = validateMessage(message);
        if (!validation.isValid) {
            notification.error({
                message: validation.error,
            });
            return;
        }

        chatSocket.sendMessage({
            action: SocketAction.SEND_MESSAGE,
            text: message,
            senderId: user?.id,
        });
        setMessage("");
    }

    return (
        <div className={Styles.newMessage}>
            <Dropdown
                className={Styles.emojiPicker}
                dropdownRender={() => (
                    <EmojiPicker
                        onEmojiClick={e => setMessage(old => old + e.emoji)}
                        lazyLoadEmojis
                    />
                )}
            >
                <SmileOutlined />
            </Dropdown>

            <Input.TextArea
                autoSize={{ minRows: 3, maxRows: 3 }}
                placeholder="Start typing..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onPressEnter={e => e?.ctrlKey && onSendMessage()}
                id="new-message-input"
                autoFocus
                maxLength={1000}
                showCount
            />

            <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={onSendMessage}
                id="new-message-button"
                disabled={!message.trim()}
            />
        </div>
    );
}
