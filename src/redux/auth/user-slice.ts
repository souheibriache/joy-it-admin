import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserState = {
  currentUser: null;
  loading: boolean;
  error: boolean;
};

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    fetchUserStart(state) {
      state.loading = true;
    },
    fetchUserSuccess(state, action: PayloadAction<any>) {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = false;
    },
    fetchUserFailure(state, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },
    resetUser(state) {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },
  },
});

export const { fetchUserStart, fetchUserSuccess, fetchUserFailure, resetUser } =
  userSlice.actions;

export default userSlice.reducer;
