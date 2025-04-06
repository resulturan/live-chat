import "@fontsource/source-sans-pro";
import { ErrorBoundary } from "react-error-boundary";
import { Provider } from "react-redux";
import Chat from "../Chat";
import { store } from "../store";
import { appActions } from "../store/app-slice";
import "./App.css";
import Falback from "./Falback";
import LoginModal from "./LoginModal";
import Theme from "./Theme";

export default function App() {
    return (
        <Provider store={store}>
            <ErrorBoundary
                fallbackRender={Falback}
                onReset={() => {
                    store.dispatch(appActions.resetAppState());
                }}
            >
                <Theme>
                    <Chat />

                    <LoginModal />
                </Theme>
            </ErrorBoundary>
        </Provider>
    );
}
