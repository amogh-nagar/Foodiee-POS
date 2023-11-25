import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import cartReducer from './cartSlice'
const appStore = configureStore({
    reducer:{
        auth: authReducer,
        cart: cartReducer
    }
})
export default appStore