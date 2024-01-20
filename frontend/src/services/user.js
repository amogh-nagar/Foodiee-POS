import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_URL + "/api/users",
    prepareHeaders: function (headers, { getState }) {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (obj) => {
        const params = new URLSearchParams();
        Object.keys(obj).forEach((key) => {
          if (Array.isArray(obj[key])) {
            obj[key].forEach((value) => params.append(key, value));
          } else {
            params.append(key, obj[key]);
          }
        });
        return `/getUsers?${params}`;
      },
    }),
    getUser: builder.query({
      query: (userId) => "/getUser/" + userId,
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: "createUser",
        method: "POST",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: "updateUser",
        method: "PATCH",
        body: data,
      }),
    }),
    deleteUser: builder.mutation({
      query: (data) => ({
        url: "deleteUser",
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserQuery,
  useLazyGetUserQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = userApi;
