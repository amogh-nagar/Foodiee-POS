import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const outletApi = createApi({
    reducerPath: "outletApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BACKEND_URL + "/api/outlets",
        prepareHeaders: function(headers, {getState}){
            const token = localStorage.getItem("token");
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        //get all outlets 
        getAllOutlets: builder.query({
            query: (userId) => '/getAllOutlets/' + userId,
        }),
        //create Outlet
        createOutlet: builder.mutation({
            query: (data) => ({
                url: "createOutlet",
                method: "POST",
                body: data,
            }),
        })
    })
})

export const {useCreateOutletMutation, useGetAllOutletsQuery} = outletApi