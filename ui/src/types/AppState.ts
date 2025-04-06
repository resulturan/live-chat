import { User } from "./User";

export interface AppState {
    user: User | null;
    isAppInitialized: boolean;
}

export const initialAppState: AppState = {
    user: null,
    isAppInitialized: false,
};
