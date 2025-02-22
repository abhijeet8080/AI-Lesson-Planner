import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  email: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify({ email: action.payload }));
      localStorage.setItem("isAuthenticated", "true");
    },
    logout: (state) => {
      state.email = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
    },
    loadUserFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
        if (storedUser && isAuthenticated) {
          state.email = JSON.parse(storedUser).email;
          state.isAuthenticated = true;
        }
      }
    },
  },
});

export const { login, logout, loadUserFromStorage } = userSlice.actions;

export default userSlice.reducer;
