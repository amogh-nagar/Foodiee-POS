import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api/user"
  }),
  endpoints: (builder) => ({
    login: builder.query({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: JSON.stringify(data),
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/signup",
        method: "POST",
        body: JSON.stringify(data),
      }),
    }),
  }),
});

export const {useLoginQuery, useRegisterMutation} = authApi