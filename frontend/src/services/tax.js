import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const deleteApi = createApi({
    reducerPath: "deleteApi",
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
         //get taxes
        getTaxes: builder.query({
            query: (brandId) => '/taxes/' + brandId,
        }),
        //get tax
        getTax: builder.query({
            query: (taxId) => '/taxes/' + taxId,
        }),
        createTax:  builder.mutation({
            query: (data) => ({
                url: "createTax",
                method: "POST",
                body: data,
            }),
        }),
        //update tax
        updateTax: builder.mutation({
            query: (data) => ({
                url: "updateTax",
                method: "PATCH",
                body: data,
            }),
        }),
        //delete tax
        deleteTax: builder.mutation({
            query: (data) => ({
                url: "deleteTax",
                method: "DELETE",
                body: data,
            }),
        }),
    })
})

export const {useCreateTaxMutation, useDeleteTaxMutation, useGetTaxQuery, useGetTaxesQuery, useUpdateTaxMutation} = deleteApi