import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import cartReducer from './cartSlice'
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import {authApi} from '../services/auth'
import { createBrowserHistory } from 'history';
const appStore = configureStore({
    reducer:{
        auth: authReducer,
        cart: cartReducer,
        [authApi.reducerPath]: authApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, redirectMiddleware)
})
setupListeners(appStore.dispatch);
function redirectMiddleware(store){
    return function(next){
        return function(action){
            if(authApi.endpoints.login.matchRejected(action)){
                if(action.error && action.error.code === '401'){
                    if(localStorage.getItem('trustedDevice')){
                        store.dispatch(authApi.endpoints.login());
                    } else {
                        const history = createBrowserHistory();
                        history.push('/auth');
                    }
                }
            }
            return next(action);
        }
    }
}

export default appStore