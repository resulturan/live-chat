import { useEffect } from "react";
import {
    useAppDispatch,
    useAppSelector,
    selectIsAppInitialized,
} from "../../store";
import { useLogin } from "./useLogin";
import { appActions } from "../../store/app-slice";
import { chatSocket } from "../../services/socket";
export function useAppInit() {
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

    return { isAppInitialized };
}
