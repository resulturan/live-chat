import type { RootState } from ".";

export const selectUser = (state: RootState) => state.app.user;
export const selectIsAppInitialized = (state: RootState) =>
    state.app.isAppInitialized;
