import { useGetOrCreateUserMutation } from "../../services/chat";
import { useAppDispatch } from "../../store";
import { appActions } from "../../store/app-slice";

export function useLogin() {
    const [getOrCreateUser, { isLoading }] = useGetOrCreateUserMutation();
    const dispatch = useAppDispatch();

    const login = async (username: string) => {
        const response = await getOrCreateUser(username).unwrap();
        if (!response.data) return;
        dispatch(appActions.setUser(response.data));
    };

    const logout = () => {
        dispatch(appActions.logout());
    };

    return { login, logout, isLoading };
}
