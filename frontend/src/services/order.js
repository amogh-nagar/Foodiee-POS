import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_URL + "/api/orders",
    prepareHeaders: function (headers, { getState }) {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    //get all orders
    getAllOrders: builder.query({
      query: (query) => {
        const params = new URLSearchParams();
        Object.keys(query).forEach((key) => {
          params.append(key, query[key]);
        });
        return `/getOrders?${params}`;
      },
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.orders.map(({ _id }) => ({ type: "Order", id: _id })),
              "Order",
            ]
          : ["Order"],
    }),
    //RazorPay Order Id
    getRazorPayOrderId: builder.mutation({
      query: (data) => ({
        url: "getRazorPayOrderId",
        method: "POST",
        body: data,
      }),
    }),
    //RazorPay Valiate
    validateRazorPayOrder: builder.mutation({
      query: (data) => ({
        url: "validateRazorPayOrder",
        method: "POST",
        body: data,
      }),
    }),
    //get Order
    getOrder: builder.query({
      query: (orderId) => "/getOrder/" + orderId,
      providesTags: (result, error, arg) => [{ type: "Order", id: arg._id }],
    }),
    //create Order
    createOrder: builder.mutation({
      query: (data) => ({
        url: "createOrder",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
    //update Order
    updateOrder: builder.mutation({
      query: (data) => ({
        url: "updateOrder",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Order", id: arg.entityId },
      ],
    }),
    //delete Order
    deleteOrder: builder.mutation({
      query: (data) => ({
        url: "deleteOrder",
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useDeleteOrderMutation,
  useGetRazorPayOrderIdMutation,
  useValidateRazorPayOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderQuery,
  useLazyGetAllOrdersQuery,
  useLazyGetOrderQuery,
  useUpdateOrderMutation,
} = orderApi;
