import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import cartReducer from './cartSlice'
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import {authApi} from '../services/auth'
const appStore = configureStore({
    reducer:{
        auth: authReducer,
        cart: cartReducer,
        [authApi.reducerPath]: authApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware)
})
setupListeners(appStore.dispatch);
export default appStore