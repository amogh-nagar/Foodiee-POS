import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_URL + "/api/categories",
    prepareHeaders: function (headers, { getState }) {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: (query) => {
        return "/getCategories/" + query.superCategoryId + "/" + query.page;
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.categories.map(({ _id }) => ({
                type: "Category",
                id: _id,
              })),
              "Category",
            ]
          : ["Category"],
    }),
    getCategory: builder.query({
      query: (categoryId) => "/getCategory/" + categoryId,
      providesTags: (result, error, arg) => [{ type: "Category", id: arg._id }],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: "createCategory",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation({
      query: (data) => ({
        url: "updateCategory",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Category", id: arg.categoryId },
      ],
    }),
    deleteCategory: builder.mutation({
      query: (data) => ({
        url: "deleteCategory",
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useGetCategoryQuery,
  useLazyGetAllCategoriesQuery,
  useLazyGetCategoryQuery,
  useUpdateCategoryMutation,
} = categoryApi;
