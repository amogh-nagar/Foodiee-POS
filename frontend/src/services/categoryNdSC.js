import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const categoryAndSCApi = createApi({
    reducerPath: "categoryAndSCApi",
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
        //create Category
        createCategory:  builder.mutation({
            query: (data) => ({
                url: "createCategory",
                method: "POST",
                body: data,
            }),
        }),
        //get superCategorys
        getSuperCategories: builder.query({
            query: (brandId) => '/getSuperCategories/' + brandId,
        }),
        //get categorys
        getCategories: builder.query({
            query: (superCategoryId) => '/getCategories/' + superCategoryId,
        }),
        //get superCategory
        getSuperCategory: builder.query({
            query: (superCategoryId) => '/getSuperCategories/' + superCategoryId,
        }),
        //get category
        getCategory: builder.query({
            query: (categoryId) => '/getCategories/' + categoryId,
        }),
        //create SuperCategory
        createSuperCategory:  builder.mutation({
            query: (data) => ({
                url: "createSuperCategory",
                method: "POST",
                body: data,
            }),
        }),
        //update Category
        updateCategory: builder.mutation({
            query: (data) => ({
                url: "updateCategory",
                method: "PATCH",
                body: data,
            }),
        }),
        //update SuperCategory
        updateSuperCategory: builder.mutation({
            query: (data) => ({
                url: "updateSuperCategory",
                method: "PATCH",
                body: data,
            }),
        }),
        //delete Category
        deleteCategory: builder.mutation({
            query: (data) => ({
                url: "deleteCategory",
                method: "DELETE",
                body: data,
            }),
        }),
        //delete SuperCategory
        deleteSuperCategory: builder.mutation({
            query: (data) => ({
                url: "deleteSuperCategory",
                method: "DELETE",
                body: data,
            }),
        }),
    })
})

export const {useCreateCategoryMutation, useCreateSuperCategoryMutation, useDeleteCategoryMutation, useDeleteSuperCategoryMutation, useGetCategoriesQuery, useGetSuperCategoriesQuery, useGetCategoryQuery, useGetSuperCategoryQuery} = categoryAndSCApi