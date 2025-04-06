import "@fontsource/source-sans-pro";
import { Provider } from "react-redux";
import Chat from "../Chat";
import { store } from "../store";
import "./App.css";
import LoginModal from "./LoginModal";
import Theme from "./Theme";

export default function App() {
    return (
        <Provider store={store}>
            <Theme>
                <Chat />

                <LoginModal />
            </Theme>
        </Provider>
    );
}
