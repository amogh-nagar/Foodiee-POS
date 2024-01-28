import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authReducer, { login, logout } from "./authSlice";
import cartReducer from "./cartSlice";
import uiReducer from "./uiSlice";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { authApi } from "../services/auth";
import { tenantApi } from "../services/tenant";
import { brandApi } from "../services/brand";
import { outletApi } from "../services/outlet";
import { roleApi } from "../services/role";
import { userApi } from "../services/user";
import { dishApi } from "../services/dish";
import { superCategoryApi } from "../services/superCategory";
import { categoryApi } from "../services/category";
const appStore = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
    [authApi.reducerPath]: authApi.reducer,
    [tenantApi.reducerPath]: tenantApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
    [outletApi.reducerPath]: outletApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [dishApi.reducerPath]: dishApi.reducer,
    [superCategoryApi.reducerPath]: superCategoryApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      authApi.middleware,
      tenantApi.middleware,
      brandApi.middleware,
      outletApi.middleware,
      userApi.middleware,
      roleApi.middleware,
      dishApi.middleware,
      superCategoryApi.middleware,
      categoryApi.middleware,
      redirectMiddleware,
    ]),
});
setupListeners(appStore.dispatch);
function redirectMiddleware() {
  return function (next) {
    return async function (action) {
      if (
        (action.error && action.error.code === "401") ||
        (action.payload && action.payload.originalStatus === 401)
      ) {
        window.location.reload();
      }
      return next(action);
    };
  };
}

export default appStore;
