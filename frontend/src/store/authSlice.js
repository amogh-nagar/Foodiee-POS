import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: null,
  permissions: [],
  roles: [],
  entityDetails: null,
  tenantIds: [],
  brandIds: [],
  isSuperAdmin: false,
  outletIds: [],
  isAuthenticated: false,
  tenantsQuery: {},
  brandsQuery: {},
  outletsQuery: {},
  accessibleEntities: [],
};
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
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
        state.roles &&
        state.roles[0] &&
        state.roles[0].roleName === "superAdmin"
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
      if (state.isSuperAdmin) {
        state.tenantsQuery.tenantIds = "";
        state.brandsQuery.tenantIds = "";
        state.outletsQuery.tenantIds = "";
        state.accessibleEntities = [
          {
            label: "Tenant",
            value: "Tenant",
          },
          {
            label: "Brand",
            value: "Brand",
          },
          {
            label: "Outlet",
            value: "Outlet",
          },
        ];
      }
      if (state.tenantIds && state.tenantIds.length) {
        state.tenantsQuery.tenantIds = state.tenantIds;
        state.brandsQuery.tenantIds = state.tenantIds;
        state.outletsQuery.tenantIds = state.tenantIds;
        state.accessibleEntities = [
          {
            label: "Tenant",
            value: "Tenant",
          },
          {
            label: "Brand",
            value: "Brand",
          },
          {
            label: "Outlet",
            value: "Outlet",
          },
        ];
      }
      if (state.brandIds && state.brandIds.length) {
        state.brandsQuery.brandIds = state.brandIds;
        state.outletsQuery.brandIds = state.brandIds;
        state.accessibleEntities = [
          {
            label: "Brand",
            value: "Brand",
          },
          {
            label: "Outlet",
            value: "Outlet",
          },
        ];
      }
      if (state.outletIds && state.outletIds.length) {
        state.outletsQuery.outletIds = state.outletIds;
        state.accessibleEntities = [
          {
            label: "Outlet",
            value: "Outlet",
          },
        ];
      }
      state.tenantsQuery.page =
        state.brandsQuery.page =
        state.outletsQuery.page =
          1;
    },
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("trustedDevice");
      return initialState;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
