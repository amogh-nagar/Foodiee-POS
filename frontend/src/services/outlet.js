import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const outletApi = createApi({
  reducerPath: "outletApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_URL + "/api/outlets",
    prepareHeaders: function (headers, { getState }) {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    //get all outlets
    getAllOutlets: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        if (query.brandId) params.append("brandId", query.brandId);
        return (
          `/getOutlets?` +
          (query.getAll
            ? "getAll=true"
            : `name=${query?.name || ""}&page=${query?.page || 0}`) +
          (params ? `&${params}` : "")
        );
      },
    }),
    //get outlet
    getOutlet: builder.query({
      query: (outletId) => "/getOutlet/" + outletId,
    }),
    //create Outlet
    createOutlet: builder.mutation({
      query: (data) => ({
        url: "createOutlet",
        method: "POST",
        body: data,
      }),
    }),
    //update brand
    updateOutlet: builder.mutation({
      query: (data) => ({
        url: "updateOutlet",
        method: "PATCH",
        body: data,
      }),
    }),
    //delete brand
    deleteOutlet: builder.mutation({
      query: (data) => ({
        url: "deleteOutlet",
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateOutletMutation,
  useDeleteOutletMutation,
  useGetAllOutletsQuery,
  useGetOutletQuery,
  useUpdateOutletMutation,
} = outletApi;
