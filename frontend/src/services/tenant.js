import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const tenantApi = createApi({
    reducerPath: "tenantApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BACKEND_URL + "/api/tenants",
        prepareHeaders: function(headers, {getState}){
            const token = localStorage.getItem("token");
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        //get all tenants 
        getAllTenants: builder.query({
            query: (userId) => '/getAllTenants/' + userId,
        }),
        //get tenants
        getTenant: builder.query({
            query: (tenantId) => '/getAllTenants/' + tenantId,
        }),
        //create Tenant
        createTenant: builder.mutation({
            query: (data) => ({
                url: "createTenant",
                method: "POST",
                body: data,
            }),
        }),
        //update brand
        updateTenant: builder.mutation({
            query: (data) => ({
                url: "updateTenant",
                method: "PATCH",
                body: data,
            }),
        }),
        //delete brand
        deleteTenant: builder.mutation({
            query: (data) => ({
                url: "deleteTenant",
                method: "DELETE",
                body: data,
            }),
        })
    })
})

export const {useCreateTenantMutation, useDeleteTenantMutation, useGetAllTenantsQuery, useGetTenantQuery, useUpdateTenantMutation} = tenantApi