import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BACKEND_URL + "/api/dashboard",
        prepareHeaders: function(headers, {getState}){
            const token = localStorage.getItem("token");
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        //get all tenants sales, active/inactive ratio
        getAllTenantsDetails: builder.query({
            query: (superAdminId) => '/getAllTenantsDetails/' + superAdminId,
        }),
        //get all brands sales, active/inactive ratio
        getAllBrandsDetails: builder.query({
            query: (userId) => '/getAllBrandsDetails/' + userId,
        }),
        //get all outlets sales, active/inactive ratio
        getAllOutletsDetails: builder.query({
            query: (userId) => '/getAllOutletsDetails/' + userId,
        }),
    })
})

export const {useGetAllBrandsDetailsQuery, useGetAllTenantsDetailsQuery, useGetAllOutletsDetailsQuery} = dashboardApi