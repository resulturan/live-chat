import "@fontsource/source-sans-pro";
import { App as AntApp } from "antd";
import { ErrorBoundary } from "react-error-boundary";
import { Provider } from "react-redux";
import { store } from "../store";
import { appActions } from "../store/app-slice";
import "./App.css";
import Falback from "./Falback";
import Theme from "./Theme";

export default function Providers({ children }: ProvidersProps) {
    return (
        <Provider store={store}>
            <ErrorBoundary
                fallbackRender={Falback}
                onReset={() => {
                    store.dispatch(appActions.resetAppState());
                }}
            >
                <AntApp>
                    <Theme>{children}</Theme>
                </AntApp>
            </ErrorBoundary>
        </Provider>
    );
}

interface ProvidersProps {
    children: React.ReactNode;
}
