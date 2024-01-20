import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const roleApi = createApi({
  reducerPath: "roleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_URL + "/api/roles",
    prepareHeaders: function (headers, { getState }) {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    //get all roles
    getAllRoles: builder.query({
      query: (query) =>
        `/getRoles?` +
        (query.getAll
          ? "getAll=true"
          : `name=${query?.name || ""}&page=${query?.page || 0}`),
    }),
    //get roles
    getRole: builder.query({
      query: (roleId) => "/getRole/" + roleId,
    }),
    //create Role
    createRole: builder.mutation({
      query: (data) => ({
        url: "createRole",
        method: "POST",
        body: data,
      }),
    }),
    //update role
    updateRole: builder.mutation({
      query: (data) => ({
        url: "updateRole",
        method: "PATCH",
        body: data,
      }),
    }),
    //delete role
    deleteRole: builder.mutation({
      query: (data) => ({
        url: "deleteRole",
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateRoleMutation,
  useLazyGetAllRolesQuery,
  useLazyGetRoleQuery,
  useDeleteRoleMutation,
  useGetAllRolesQuery,
  useGetRoleQuery,
  useUpdateRoleMutation,
} = roleApi;
