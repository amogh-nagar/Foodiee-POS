import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const dishApi = createApi({
    reducerPath: "dishApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BACKEND_URL + "/api/dish",
        prepareHeaders: function(headers, {getState}){
            const token = localStorage.getItem("token");
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        //get all Dishs 
        getAllDishes: builder.query({
            query: (brandId) => '/dishes/' + brandId,
        }),
        //get single Dishs 
        getDish: builder.query({
            query: (dishId) => '/dishes/' + dishId,
        }),
        //create Dish
        createDish: builder.mutation({
            query: (data) => ({
                url: "createDish",
                method: "POST",
                body: data,
            }),
        }),
        //update dish
        updateDish: builder.mutation({
            query: (data) => ({
                url: "updateDish",
                method: "PATCH",
                body: data,
            }),
        }),
        //delete dish
        deleteDish: builder.mutation({
            query: (data) => ({
                url: "deleteDish",
                method: "DELETE",
                body: data,
            }),
        }),
    })
})

export const {useCreateDishMutation, useDeleteDishMutation, useGetAllDishesQuery, useGetDishQuery, useUpdateDishMutation} = dishApi