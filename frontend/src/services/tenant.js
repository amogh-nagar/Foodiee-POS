import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const tenantApi = createApi({
  reducerPath: "tenantApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_URL + "/api/tenants",
    prepareHeaders: function (headers, { getState }) {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    //get all tenants
    getAllTenants: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });
        return `/getTenants?${params}`;
      },
      providesTags: (result, error, arg) =>
        result
          ? [...result.tenants.map(({ _id }) => ({ type: 'Tenant' , id: _id })), 'Tenant']
          : ['Tenant'],
    }),
    //get tenants
    getTenant: builder.query({
      query: (tenantId) => "/getTenant/" + tenantId,
      providesTags: (result, error, arg) => [{ type: 'Tenant' , id: arg._id }]
    }),
    //create Tenant
    createTenant: builder.mutation({
      query: (data) => ({
        url: "createTenant",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Tenant'],
    }),
    //update tenant
    updateTenant: builder.mutation({
      query: (data) => ({
        url: "updateTenant",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Tenant', id: arg.entityId }],
    }),
    //delete tenant
    deleteTenant: builder.mutation({
      query: (data) => ({
        url: "deleteTenant",
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateTenantMutation,
  useLazyGetAllTenantsQuery,
  useLazyGetTenantQuery,
  useDeleteTenantMutation,
  useGetAllTenantsQuery,
  useSearchTenantsQuery,
  useGetTenantQuery,
  useUpdateTenantMutation,
} = tenantApi;
