import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BACKEND_URL + "/api/users",
        prepareHeaders: function(headers, {getState}){
            const token = localStorage.getItem("token");
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: (obj) => {
                const params = new URLSearchParams();
                obj.entityIds.forEach(value => params.append(obj.entityType, value));
                if(obj.role){
                    params.append('role', obj.role);
                }
                return `/getUsers?${params}`; 
            }
        }),
        createUser: builder.mutation({
            query: (data) => ({
                url: "createUser",
                method: "POST",
                body: data,
            }),
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: "updateUser",
                method: "PATCH",
                body: data,
            }),
        }),
        deleteUser: builder.mutation({
            query: (data) => ({
                url: "deleteUser",
                method: "DELETE",
                body: data,
            }),
        }),
        getRoles: builder.query({
            query: (obj) => {
                const params = new URLSearchParams();
                obj.entityIds.forEach(value => params.append(obj.entityType, value));
                if(obj.role){
                    params.append('role', obj.role);
                }
                return `/getRoles?${params}`; 
            }
        }),
        createRole: builder.mutation({
            query: (data) => ({
                url: "createRole",
                method: "POST",
                body: data,
            }),
        }),
        updateRole: builder.mutation({
            query: (data) => ({
                url: "updateRole",
                method: "PATCH",
                body: data,
            }),
        }),
        deleteRole: builder.mutation({
            query: (data) => ({
                url: "deleteRole",
                method: "DELETE",
                body: data,
            }),
        }),
    })
})


export const {useCreateUserMutation, useGetUsersQuery, useCreateRoleMutation, useGetRolesQuery, useDeleteRoleMutation, useDeleteUserMutation, useUpdateRoleMutation, useUpdateUserMutation} = profileApi