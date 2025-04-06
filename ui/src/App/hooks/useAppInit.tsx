import { App } from "antd";
import { useEffect } from "react";
import { chatSocket } from "../../services/socket";
import {
    selectIsAppInitialized,
    useAppDispatch,
    useAppSelector,
} from "../../store";
import { appActions } from "../../store/app-slice";
import {
    AppError,
    ErrorType,
    isAuthError,
    isDBError,
    isSystemError,
    isValidationError,
    isWebSocketError,
} from "../../types/Error";
import { useLogin } from "./useLogin";

export function useAppInit() {
    const { notification } = App.useApp();

    const { login } = useLogin();
    const dispatch = useAppDispatch();
    const isAppInitialized = useAppSelector(selectIsAppInitialized);

    useEffect(() => {
        const username = localStorage.getItem("username");
        if (username) {
            login(username).then(() => {
                dispatch(appActions.setIsAppInitialized(true));
            });
        } else {
            dispatch(appActions.setIsAppInitialized(true));
        }

        chatSocket.connect();
    }, []);

    useEffect(() => {
        const handleError = (error: AppError) => {
            if (isValidationError(error)) {
                notification.error({
                    message: error.message,
                    description: error.field
                        ? `Field: ${error.field}`
                        : undefined,
                });
            } else if (isAuthError(error)) {
                notification.error({
                    message: "Authentication Error",
                    description: error.message,
                });
                dispatch(appActions.logout());
            } else if (isDBError(error)) {
                notification.error({
                    message: "Database Error",
                    description: error.message,
                });
            } else if (isWebSocketError(error)) {
                if (error.type === ErrorType.RATE_LIMIT_ERROR) {
                    notification.warning({
                        message: "Rate Limit Exceeded",
                        description:
                            "Please wait a moment before sending more messages",
                        duration: 5,
                    });
                } else {
                    notification.error({
                        message: "Connection Error",
                        description: error.message,
                    });
                }
            } else if (isSystemError(error)) {
                notification.error({
                    message: "System Error",
                    description: error.message,
                });
            }
        };

        chatSocket.onError(handleError);

        return () => {
            chatSocket.removeErrorHandler(handleError);
        };
    }, [notification]);

    return { isAppInitialized };
}
