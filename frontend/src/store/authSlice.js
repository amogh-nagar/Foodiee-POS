import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    permissions: [],
    roles: [],
    entityDetails: [],
    tenantIds: null,
    brandIds: null,
    outletIds: null,
    isAuthenticated: false,
  },
  reducers: {
    login: (state, action) => {
      if (!action.payload) {
        return state;
      }
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.permissions = action.payload.permissions ?? [];
      state.entityDetails = action.payload.entityDetails ?? [];
      state.roles = action.payload.roles;
      state.entityDetails?.map((entity) => {
        if (entity.entityName === "Tenant")
          state.tenantIds.push(entity.entityId);
        if (entity.entityName === "Brand") state.brandIds.push(entity.entityId);
        if (entity.entityName === "Outlet")
          state.outletIds.push(entity.entityId);
      });
    },
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("trustedDevice");
      return {
        ...state,
        user: null,
        permissions: [],
        role: null,
        isAuthenticated: false,
        entityDetails: [],
        brandIds: null,
        outletIds: null,
        roles: [],
        tenantIds: null,
      };
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
