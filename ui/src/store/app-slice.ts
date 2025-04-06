import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialAppState, User } from "../types";

export const appSlice = createSlice({
    name: "app",
    initialState: initialAppState,
    reducers: {
        setUser: (state, { payload }: PayloadAction<User>) => {
            localStorage.setItem("username", payload.username);
            state.user = payload;
        },

        logout: state => {
            localStorage.removeItem("username");
            state.user = null;
        },

        setIsAppInitialized: (state, { payload }: PayloadAction<boolean>) => {
            state.isAppInitialized = payload;
        },
    },
});

export const { setUser, logout, setIsAppInitialized } = appSlice.actions;

export default appSlice.reducer;

export const appActions = appSlice.actions;
