import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BACKEND_URL + "/api/profile",
        prepareHeaders: function(headers, {getState}){
            const token = localStorage.getItem("token");
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: (userId) => '/getProfile/' + userId,
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: "updateProfile",
                method: "POST",
                body: data,
            }),
        })
    })
})


export const {useGetProfileQuery, useUpdateProfileMutation} = profileApi