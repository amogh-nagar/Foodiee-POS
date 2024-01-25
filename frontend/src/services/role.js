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
      query: (query) => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });
        return `/getRoles?${params}`
      },
      providesTags: (result, error, arg) =>
        result
          ? [...result.roles.map(({ _id }) => ({ type: 'Role' , id: _id })), 'Role']
          : ['Role'],
    }),
    //get roles
    getRole: builder.query({
      query: (roleId) => "/getRole/" + roleId,
      providesTags: (result, error, arg) => [{ type: "Role", id: arg._id }],
    }),
    //create Role
    createRole: builder.mutation({
      query: (data) => ({
        url: "createRole",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Role'],
    }),
    //update role
    updateRole: builder.mutation({
      query: (data) => ({
        url: "updateRole",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Role', id: arg._id }],
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
