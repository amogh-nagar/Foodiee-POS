import { createSlice } from "@reduxjs/toolkit";
const initialcartstate = { items: {}, totalquantity: 0 };

const cartSlice = createSlice({
  name: "cart",
  initialState: initialcartstate,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existingitemindex = state.items[item._id];
      state.totalquantity++;
      if (existingitemindex) {
        state.items[item._id].quantity += 1;
      } else {
        state.items[item._id] = {
          id: item._id,
          rate: item.rate,
          quantity: 1,
          name: item.name,
        };
      }
    },
    removeFromCart(state, action) {
      const id = action.payload._id;
      const existingitem = state.items[id];
      if (!existingitem) return;
      state.totalquantity--;
      if (existingitem.quantity === 1) {
        delete state.items[id];
      } else {
        existingitem.quantity -= 1;
      }
    },
    deleteItemFromCart(state, action) {
      const id = action.payload;
      const existingitem = state.items[id];
      if (!existingitem) return;
      state.totalquantity -= existingitem.quantity;
      delete state.items[id];
    },
    replaceCart(state, action) {
      state.items = action.payload.items;
      state.totalquantity = action.payload.totalquantity;
    },
    deleteCart(state) {
      state.items = [];
      state.totalquantity = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  deleteItemFromCart,
  replaceCart,
  deleteCart,
} = cartSlice.actions;

export default cartSlice.reducer;
