import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  theme: "light"
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },

    setTheme: (state, action) => {
      state.theme = action.payload;
    }
  }
});

export const {
  setUsername,
  setTheme
} = userSlice.actions;

export default userSlice.reducer;