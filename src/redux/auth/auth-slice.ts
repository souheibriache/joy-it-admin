import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: boolean;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signInStart(state) {
      state.loading = true;
    },
    signInSuccess(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string | null;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.loading = false;
      state.error = false;
    },
    signInFailure(state, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
      state.accessToken = null;
      state.refreshToken = null;
    },
    resetAuth(state) {
      state.loading = false;
      state.error = false;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { signInStart, signInSuccess, signInFailure, resetAuth } =
  authSlice.actions;

export default authSlice.reducer;
