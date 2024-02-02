import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const superCategoryApi = createApi({
  reducerPath: "superCategoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_URL + "/api/superCategories",
    prepareHeaders: function (headers, { getState }) {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllSuperCategories: builder.query({
      query: (query) => {
        return "/getSuperCategories/" + query.brandId + "/" + query.page;
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.superCategories.map(({ _id }) => ({
                type: "SuperCategory",
                id: _id,
              })),
              "SuperCategory",
            ]
          : ["SuperCategory"],
    }),
    getAllOutletSuperCategories: builder.query({
      query: (query) => {
        console.log("query is", query);
        return "/getOutletSuperCategories/" + query.outletId + "/" + query.page;
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.superCategories.map(({ _id }) => ({
                type: "SuperCategory",
                id: _id,
              })),
              "SuperCategory",
            ]
          : ["SuperCategory"],
    }),
    getSuperCategory: builder.query({
      query: (superCategoryId) => "/getSuperCategory/" + superCategoryId,
      providesTags: (result, error, arg) => [
        { type: "SuperCategory", id: arg._id },
      ],
    }),
    createSuperCategory: builder.mutation({
      query: (data) => ({
        url: "createSuperCategory",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SuperCategory"],
    }),
    updateSuperCategory: builder.mutation({
      query: (data) => ({
        url: "updateSuperCategory",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "SuperCategory", id: arg.superCategoryId },
      ],
    }),
    deleteSuperCategory: builder.mutation({
      query: (data) => ({
        url: "deleteSuperCategory",
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateSuperCategoryMutation,
  useDeleteSuperCategoryMutation,
  useGetAllSuperCategoriesQuery,
  useGetAllOutletSuperCategoriesQuery,
  useGetSuperCategoryQuery,
  useLazyGetAllSuperCategoriesQuery,
  useLazyGetSuperCategoryQuery,
  useUpdateSuperCategoryMutation,
} = superCategoryApi;
