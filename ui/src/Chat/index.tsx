import { useAppInit } from "../App/hooks";
import Messages from "../Messages";
import Header from "./Header";
import NewMessage from "./NewMessage";
import Styles from "./Styles.module.scss";

export default function Chat() {
    useAppInit();

    return (
        <div className={Styles.chatContainer}>
            <Header />
            <Messages />
            <NewMessage />
        </div>
    );
}
