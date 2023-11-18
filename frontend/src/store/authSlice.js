import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        permissions: [],
        role: null,
        isAuthenticated: false,
    },
    reducers: {
        login : (state, action) => {
            if(!action.payload){
                return state;
            }
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.permissions = action.payload.permissions;
            state.role = action.payload.role;
        },
        logout: (state) => {
            return {
              ...state,
                user: null,
                permissions: [],
                role: null,
                isAuthenticated: false,
            }
        }
    }
});

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;