import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const brandApi = createApi({
  reducerPath: "brandApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_URL + "/api/brands",
    prepareHeaders: function (headers, { getState }) {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    //get all brands
    getAllBrands: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });
        return `/getBrands?${params}`;
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.brands.map(({ _id }) => ({ type: "Brand", id: _id })),
              "Brand",
            ]
          : ["Brand"],
    }),
    //get all brands
    getBrand: builder.query({
      query: (brandId) => "/getBrand/" + brandId,
      providesTags: (result, error, arg) => [{ type: "Brand", id: arg._id }],
    }),
    //create Brand
    createBrand: builder.mutation({
      query: (data) => ({
        url: "createBrand",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Brand"],
    }),
    //update brand
    updateBrand: builder.mutation({
      query: (data) => ({
        url: "updateBrand",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Brand", id: arg.entityId },
      ],
    }),
    //delete brand
    deleteBrand: builder.mutation({
      query: (data) => ({
        url: "deleteBrand",
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllBrandsQuery,
  useCreateBrandMutation,
  useDeleteBrandMutation,
  useGetBrandQuery,
  useLazyGetAllBrandsQuery,
  useUpdateBrandMutation,
  useLazyGetBrandQuery,
} = brandApi;
