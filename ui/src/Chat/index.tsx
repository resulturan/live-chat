import { useAppInit } from "../App/hooks";
import Header from "./Header";
import Messages from "../Messages";
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
