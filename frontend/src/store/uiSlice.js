import { createSlice } from "@reduxjs/toolkit";
const initialState = { isLoading: false };

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { setIsLoading } = uiSlice.actions;
export default uiSlice.reducer;
