import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { authApi } from "../services/auth";
import { tenantApi } from "../services/tenant";
import { createBrowserHistory } from "history";
import { brandApi } from "../services/brand";
import { outletApi } from "../services/outlet";
const appStore = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    [authApi.reducerPath]: authApi.reducer,
    [tenantApi.reducerPath]: tenantApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
    [outletApi.reducerPath]: outletApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware, redirectMiddleware)
      .concat(tenantApi.middleware)
      .concat(brandApi.middleware)
      .concat(outletApi.middleware),
});
setupListeners(appStore.dispatch);
function redirectMiddleware(store) {
  return function (next) {
    return function (action) {
      if (authApi.endpoints.login.matchRejected(action)) {
        if (action.error && action.error.code === "401") {
          if (localStorage.getItem("trustedDevice")) {
            store.dispatch(authApi.endpoints.login());
          } else {
            const history = createBrowserHistory();
            localStorage.clear();
            history.push("/auth");
          }
        }
      }
      return next(action);
    };
  };
}

export default appStore;
