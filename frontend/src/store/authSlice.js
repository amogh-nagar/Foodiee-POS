import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    permissions: [],
    roles: [],
    entityDetails: null,
    tenantIds: null,
    brandIds: null,
    isSuperAdmin: false,
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
      state.permissions = action.payload.user.permissions ?? [];
      state.entityDetails = action.payload.user.entityDetails ?? [];
      state.roles = action.payload.user.roles;
      if (
        action.payload.user.roles &&
        action.payload.user.roles[0] &&
        action.payload.user.roles[0].roleName === "superAdmin"
      ) {
        state.isSuperAdmin = true;
      }
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
