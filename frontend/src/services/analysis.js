import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const analysisApi = createApi({
    reducerPath: "analysisApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_BACKEND_URL + "/api/analysis",
        prepareHeaders: function(headers, {getState}){
            const token = localStorage.getItem("token");
            if (token) {
              headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        //get all tenants sales for a range of dates with Bifurcation flag(if true then data will come as brand wise)
        getAllTenantsSales: builder.query({
            query: (obj) => {
                const params = new URLSearchParams();
                params.append('fromDate', obj.fromDate)
                params.append('toDate', obj.toDate)
                params.append('isBifurcated', obj.isBifurcated)
                obj.tenantIds.forEach(value => params.append('ids', value));
                return `/getAllTenantsSales?${params}`; 
            }
        }),
        //get all brands sales for a range of dates with Bifurcation flag(if true then data will come as brand wise)
        getAllBrandsSales: builder.query({
            query: (obj) => {
                const params = new URLSearchParams();
                params.append('fromDate', obj.fromDate)
                params.append('toDate', obj.toDate)
                params.append('isBifurcated', obj.isBifurcated)
                obj.brandIds.forEach(value => params.append('ids', value));
                return `/getAllBrandsSales?${params}`; 
            }
        }),
        //get all outlets sales for a range of dates
        getAllOutletsSales: builder.query({
            query: (obj) => {
                const params = new URLSearchParams();
                params.append('fromDate', obj.fromDate)
                params.append('toDate', obj.toDate)
                params.append('isBifurcated', obj.isBifurcated)
                obj.outletIds.forEach(value => params.append('ids', value));
                return `/getAllOutletsSales?${params}`; 
            }
        }),
        //get all tenants hourly sales for a range of dates
        getTenantHourlySales: builder.query({
            query: (obj) => '/getTenantHourlySales/' + obj.tenantId + "/" + obj.fromDate + "/" + obj.toDate,
        }),
        //get all brands hourly sales for a range of dates
        getBrandHourlySales: builder.query({
            query: (obj) => '/getBrandHourlySales/' + obj.brandId + "/" + obj.fromDate + "/" + obj.toDate,
        }),
        //get all outlets sales for a range of dates
        getOutletHourlySales: builder.query({
            query: (obj) => '/getOutletHourlySales/' + obj.outletId + "/" + obj.fromDate + "/" + obj.toDate,
        }),
        //get Dish Sales
        getDishSales: builder.query({
            query: (obj) => {
                const params = new URLSearchParams();
                obj.dishIds.forEach(value => params.append('dishIds', value));
                obj.entityIds.forEach(value => params.append(obj.entityType, value));
                return `/getDishSales?${params}`; 
            }
        }),
        //get top 3 brands for a range of dates
        getTop3Brands: builder.query({
            query: (obj) => {
                const params = new URLSearchParams();
                obj.brandsIds.forEach(value => params.append(obj.entityType, value));
                return `/getTop3Dishes?${params}`; 
            }
        }),
        //get top 3 outlets for a range of dates
        getTop3Outlets: builder.query({
            query: (obj) => {
                const params = new URLSearchParams();
                obj.outletIds.forEach(value => params.append(obj.entityType, value));
                return `/getTop3Dishes?${params}`; 
            }
        }),
        //get top 3 dishes for a range of dates
        getTop3Dishes: builder.query({
            query: (obj) => {
                const params = new URLSearchParams();
                obj.dishIds.forEach(value => params.append('dishIds', value));
                obj.entityIds.forEach(value => params.append(obj.entityType, value));
                return `/getTop3Dishes?${params}`; 
            }
        })
    })
})

export const {useGetAllBrandsSalesQuery, useGetAllOutletsSalesQuery, useGetAllTenantsSalesQuery, useGetBrandHourlySalesQuery, useGetDishSalesQuery, useGetOutletHourlySalesQuery, useGetTenantHourlySalesQuery, useGetTop3DishesQuery, useGetTop3BrandsQuery, useGetTop3OutletsQuery} = analysisApi;