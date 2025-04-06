import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector } from "react-redux";
import { chatApi } from "../services/chat";
import appReducer from "./app-slice";

export const getStore = () =>
    configureStore({
        reducer: {
            [chatApi.reducerPath]: chatApi.reducer,
            app: appReducer,
        },
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware().concat(chatApi.middleware),
    });

export const store = getStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = () => useDispatch<AppDispatch>();

setupListeners(store.dispatch);

export default store;

export * from "./selectors";
