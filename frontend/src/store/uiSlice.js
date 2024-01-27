import { createSlice } from "@reduxjs/toolkit";
const initialState = { isLoading: false, filters: {} };

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    alterFilters(state, action) {
      const payload = action.payload;
      switch (payload.type) {
        case "SET_FILTER": {
          state.filters[payload.name] = payload.value;
          return state;
        }
        case "UNSET_FILTER": {
          state.filters[payload.name] = null;
          return state;
        }
      }
      return initialState;
    },
  },
});

export const { setIsLoading, alterFilters } = uiSlice.actions;
export default uiSlice.reducer;
