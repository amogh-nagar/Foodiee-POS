import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const dishApi = createApi({
  reducerPath: "dishApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_URL + "/api/dishes",
    prepareHeaders: function (headers, { getState }) {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    //get all Dishs
    getAllDishes: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key] ?? "");
        });
        return `/getDishes?${params}`;
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.dishes.map(({ _id }) => ({ type: "Dish", id: _id })),
              "Dish",
            ]
          : ["Dish"],
    }),
    //get single Dishs
    getDish: builder.query({
      query: (dishId) => "/getDish/" + dishId,
      providesTags: (result, error, arg) => [{ type: "Dish", id: arg._id }],
    }),
    //create Dish
    createDish: builder.mutation({
      query: (data) => ({
        url: "createDish",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Dish"],
    }),
    //update dish
    updateDish: builder.mutation({
      query: (data) => ({
        url: "updateDish",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Dish", id: arg.dishId },
      ],
    }),
    //delete dish
    deleteDish: builder.mutation({
      query: (data) => ({
        url: "deleteDish",
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateDishMutation,
  useDeleteDishMutation,
  useGetAllDishesQuery,
  useGetDishQuery,
  useUpdateDishMutation,
} = dishApi;
