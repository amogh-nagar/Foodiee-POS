import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const analysisApi = createApi({
  reducerPath: "analysisApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_URL + "/api/analysis",
    prepareHeaders: function (headers, { getState }) {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    //get all tenants sales for a range of dates with Bifurcation flag(if true then data will come as brand wise)
    getAllTenantsSales: builder.query({
      query: (obj) => {
        const params = new URLSearchParams();
        params.append("fromDate", obj.fromDate);
        params.append("toDate", obj.toDate);
        params.append("isBifurcated", obj.isBifurcated);
        obj.tenantIds.forEach((value) => params.append("ids", value));
        return `/getAllTenantsSales?${params}`;
      },
    }),
    //get all brands sales for a range of dates with Bifurcation flag(if true then data will come as brand wise)
    getAllBrandsSales: builder.query({
      query: (obj) => {
        const params = new URLSearchParams();
        params.append("fromDate", obj.fromDate);
        params.append("toDate", obj.toDate);
        params.append("isBifurcated", obj.isBifurcated);
        obj.brandIds.forEach((value) => params.append("ids", value));
        return `/getAllBrandsSales?${params}`;
      },
    }),
    //get all outlets sales for a range of dates
    getAllOutletsSales: builder.query({
      query: (obj) => {
        const params = new URLSearchParams();
        params.append("fromDate", obj.fromDate);
        params.append("toDate", obj.toDate);
        params.append("isBifurcated", obj.isBifurcated);
        obj.outletIds.forEach((value) => params.append("ids", value));
        return `/getAllOutletsSales?${params}`;
      },
    }),
    //get all tenants hourly sales for a range of dates
    getTenantHourlySales: builder.query({
      query: (obj) =>
        "/getTenantHourlySales/" +
        obj.tenantId +
        "/" +
        obj.fromDate +
        "/" +
        obj.toDate,
    }),
    //get all brands hourly sales for a range of dates
    getBrandHourlySales: builder.query({
      query: (obj) =>
        "/getBrandHourlySales/" +
        obj.brandId +
        "/" +
        obj.fromDate +
        "/" +
        obj.toDate,
    }),
    //get all outlets sales for a range of dates
    getOutletHourlySales: builder.query({
      query: (obj) =>
        "/getOutletHourlySales/" +
        obj.outletId +
        "/" +
        obj.fromDate +
        "/" +
        obj.toDate,
    }),
    //get Dish Sales
    getDishSales: builder.query({
      query: (obj) => {
        const params = new URLSearchParams();
        obj.dishIds.forEach((value) => params.append("dishIds", value));
        obj.entityIds.forEach((value) => params.append(obj.entityType, value));
        return `/getDishSales?${params}`;
      },
    }),
    //get top 3 brands for a range of dates
    getTop3Brands: builder.query({
      query: (obj) => {
        const params = new URLSearchParams();
        obj.brandsIds.forEach((value) => params.append(obj.entityType, value));
        return `/getTop3Brands?${params}`;
      },
    }),
    //get top 3 tenants for a range of dates
    getTop3Tenants: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });
        return `/getTop3Tenants?${params}`;
      },
    }),
    //get top 3 outlets for a range of dates
    getTop3Outlets: builder.query({
      query: (obj) => {
        const params = new URLSearchParams();
        obj.outletIds.forEach((value) => params.append(obj.entityType, value));
        return `/getTop3Outlets?${params}`;
      },
    }),
    //get top 3 dishes for a range of dates
    getTop3Dishes: builder.query({
      query: (obj) => {
        const params = new URLSearchParams();
        obj.dishIds.forEach((value) => params.append("dishIds", value));
        obj.entityIds.forEach((value) => params.append(obj.entityType, value));
        return `/getTop3Dishes?${params}`;
      },
    }),
    getActiveInactiveRatioForTenants: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });
        return `/getActiveInactiveRatioForTenants?${params}`;
      },
    }),
    getTop3ItemsOfTenants: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });
        return `/getTop3ItemsOfTenants?${params}`;
      },
    }),
    getTop3ItemsOfBrands: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });
        return `/getTop3ItemsOfBrands?${params}`;
      },
    }),
    getTop3ItemsOfOutlets: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });
        return `/getTop3ItemsOfOutlets?${params}`;
      },
    }),
    getMonthWiseTop3TenantsSale: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });
        return `/getMonthWiseTop3TenantsSale?${params}`;
      },
      transformResponse: (response) => {
        const tenantWiseMonthSalesBifurcation = {};
        const currMonth = new Date().getMonth();
        response?.result?.forEach((res) => {
          res.month = new Date(res.date).getMonth();
          res.tenants?.forEach((ten) => {
            if (!tenantWiseMonthSalesBifurcation[ten.tenantId]) {
              tenantWiseMonthSalesBifurcation[ten.tenantId] = {
                tenantId: ten.tenantId,
                name: ten.tenantName,
                values: Array(12).fill(0),
              };
            }
            tenantWiseMonthSalesBifurcation[ten.tenantId].values[
              res.month >= 0 && res.month <= currMonth
                ? res.month + (11 - currMonth)
                : res.month - (currMonth + 1)
            ] = ten.price;
          });
        });
        return Object.entries(tenantWiseMonthSalesBifurcation).map(
          (ele) => ele[1]
        );
      },
    }),
    getHourWiseTop3TenantsSale: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });
        return `/getHourWiseTop3TenantsSale?${params}`;
      },
      transformResponse: (response) => {
        const tenantWiseHourSalesBifurcation = {};
        const currHour = new Date().getHours();
        response?.result?.forEach((res) => {
          res.hour = new Date(res.date).getHours();
          res.tenants?.forEach((ten) => {
            if (!tenantWiseHourSalesBifurcation[ten.tenantId]) {
              tenantWiseHourSalesBifurcation[ten.tenantId] = {
                tenantId: ten.tenantId,
                name: ten.tenantName,
                values: Array(24).fill(0),
              };
            }
            tenantWiseHourSalesBifurcation[ten.tenantId].values[
              res.hour >= 0 && res.hour <= currHour
                ? res.hour + (23 - currHour)
                : res.hour - (currHour + 1)
            ] = ten.price;
          });
        });
        return Object.entries(tenantWiseHourSalesBifurcation).map(
          (ele) => ele[1]
        );
      },
    }),
    getMonthWiseTop3BrandsSale: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });
        return `/getMonthWiseTop3BrandsSale?${params}`;
      },
      transformResponse: (response) => {
        const brandWiseMonthSalesBifurcation = {};
        const currMonth = new Date().getMonth();
        response?.result?.forEach((res) => {
          res.month = new Date(res.date).getMonth();
          res.brands?.forEach((ten) => {
            if (!brandWiseMonthSalesBifurcation[ten.brandId]) {
              brandWiseMonthSalesBifurcation[ten.brandId] = {
                brandId: ten.brandId,
                name: ten.brandName,
                values: Array(12).fill(0),
              };
            }
            brandWiseMonthSalesBifurcation[ten.brandId].values[
              res.month >= 0 && res.month <= currMonth
                ? res.month + (11 - currMonth)
                : res.month - (currMonth + 1)
            ] = ten.price;
          });
        });
        return Object.entries(brandWiseMonthSalesBifurcation).map(
          (ele) => ele[1]
        );
      },
    }),
    getHourWiseTop3BrandsSale: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });
        return `/getHourWiseTop3BrandsSale?${params}`;
      },
      transformResponse: (response) => {
        const brandWiseHourSalesBifurcation = {};
        const currHour = new Date().getHours();
        response?.result?.forEach((res) => {
          res.hour = new Date(res.date).getHours();
          res.brands?.forEach((ten) => {
            if (!brandWiseHourSalesBifurcation[ten.brandId]) {
              brandWiseHourSalesBifurcation[ten.brandId] = {
                brandId: ten.brandId,
                name: ten.brandName,
                values: Array(24).fill(0),
              };
            }
            brandWiseHourSalesBifurcation[ten.brandId].values[
              res.hour >= 0 && res.hour <= currHour
                ? res.hour + (23 - currHour)
                : res.hour - (currHour + 1)
            ] = ten.price;
          });
        });
        return Object.entries(brandWiseHourSalesBifurcation).map(
          (ele) => ele[1]
        );
      },
    }),
    getMonthWiseTop3OutletsSale: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });
        return `/getMonthWiseTop3OutletsSale?${params}`;
      },
      transformResponse: (response) => {
        const outletWiseMonthSalesBifurcation = {};
        const currMonth = new Date().getMonth();
        response?.result?.forEach((res) => {
          res.month = new Date(res.date).getMonth();
          res.outlets?.forEach((ten) => {
            if (!outletWiseMonthSalesBifurcation[ten.outletId]) {
              outletWiseMonthSalesBifurcation[ten.outletId] = {
                outletId: ten.outletId,
                name: ten.outletName,
                values: Array(12).fill(0),
              };
            }
            outletWiseMonthSalesBifurcation[ten.outletId].values[
              res.month >= 0 && res.month <= currMonth
                ? res.month + (11 - currMonth)
                : res.month - (currMonth + 1)
            ] = ten.price;
          });
        });
        return Object.entries(outletWiseMonthSalesBifurcation).map(
          (ele) => ele[1]
        );
      },
    }),
    getHourWiseTop3OutletsSale: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });
        return `/getHourWiseTop3OutletsSale?${params}`;
      },
      transformResponse: (response) => {
        const outletWiseHourSalesBifurcation = {};
        const currHour = new Date().getHours();
        response?.result?.forEach((res) => {
          res.hour = new Date(res.date).getHours();
          res.outlets?.forEach((ten) => {
            if (!outletWiseHourSalesBifurcation[ten.outletId]) {
              outletWiseHourSalesBifurcation[ten.outletId] = {
                outletId: ten.outletId,
                name: ten.outletName,
                values: Array(24).fill(0),
              };
            }
            outletWiseHourSalesBifurcation[ten.outletId].values[
              res.hour >= 0 && res.hour <= currHour
                ? res.hour + (23 - currHour)
                : res.hour - (currHour + 1)
            ] = ten.price;
          });
        });
        return Object.entries(outletWiseHourSalesBifurcation).map(
          (ele) => ele[1]
        );
      },
    }),
    getActiveInactiveRatioForBrands: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });
        return `/getActiveInactiveRatioForBrands?${params}`;
      },
    }),
    getActiveInactiveRatioForOutlets: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });
        return `/getActiveInactiveRatioForOutlets?${params}`;
      },
    }),
  }),
});

export const {
  useGetAllBrandsSalesQuery,
  useGetAllOutletsSalesQuery,
  useGetAllTenantsSalesQuery,
  useGetActiveInactiveRatioForBrandsQuery,
  useGetActiveInactiveRatioForOutletsQuery,
  useGetActiveInactiveRatioForTenantsQuery,
  useLazyGetActiveInactiveRatioForBrandsQuery,
  useLazyGetActiveInactiveRatioForOutletsQuery,
  useLazyGetActiveInactiveRatioForTenantsQuery,
  useGetBrandHourlySalesQuery,
  useGetDishSalesQuery,
  useGetHourWiseTop3TenantsSaleQuery,
  useLazyGetHourWiseTop3TenantsSaleQuery,
  useGetOutletHourlySalesQuery,
  useGetTenantHourlySalesQuery,
  useGetTop3DishesQuery,
  useGetTop3BrandsQuery,
  useGetTop3OutletsQuery,
  useGetHourWiseTop3BrandsSaleQuery,
  useGetMonthWiseTop3BrandsSaleQuery,
  useGetTop3ItemsOfBrandsQuery,
  useGetTop3ItemsOfOutletsQuery,
  useLazyGetHourWiseTop3BrandsSaleQuery,
  useLazyGetMonthWiseTop3BrandsSaleQuery,
  useLazyGetTop3ItemsOfBrandsQuery,
  useGetHourWiseTop3OutletsSaleQuery,
  useGetMonthWiseTop3OutletsSaleQuery,
  useLazyGetHourWiseTop3OutletsSaleQuery,
  useLazyGetMonthWiseTop3OutletsSaleQuery,
  useLazyGetTop3ItemsOfOutletsQuery,
  useGetTop3TenantsQuery,
  useLazyGetAllBrandsSalesQuery,
  useLazyGetAllOutletsSalesQuery,
  useLazyGetAllTenantsSalesQuery,
  useLazyGetBrandHourlySalesQuery,
  useLazyGetDishSalesQuery,
  useLazyGetOutletHourlySalesQuery,
  useLazyGetTenantHourlySalesQuery,
  useLazyGetTop3BrandsQuery,
  useLazyGetTop3DishesQuery,
  useLazyGetTop3OutletsQuery,
  useLazyGetTop3TenantsQuery,
  useGetTop3ItemsOfTenantsQuery,
  useGetMonthWiseTop3TenantsSaleQuery,
  useLazyGetMonthWiseTop3TenantsSaleQuery,
  useLazyGetTop3ItemsOfTenantsQuery,
} = analysisApi;
