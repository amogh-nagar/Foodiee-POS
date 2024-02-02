import { createSlice } from "@reduxjs/toolkit";
const initialcartstate = { items: {}, totalPrice: 0 };

const cartSlice = createSlice({
  name: "cart",
  initialState: initialcartstate,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existingItem = state.items[item._id];
      if (existingItem) {
        state.totalPrice += existingItem.rate;
        state.items[item._id].quantity += 1;
      } else {
        state.totalPrice += item.rate;
        state.items[item._id] = {
          id: item._id,
          rate: item.rate,
          quantity: 1,
          name: item.name,
          comment: "",
          description: item.description,
        };
      }
    },
    removeFromCart(state, action) {
      const id = action.payload._id;
      const existingitem = state.items[id];
      if (!existingitem) return;
      state.totalPrice -= existingitem.rate;
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
      state.totalPrice -= existingitem.rate * existingitem.quantity;
      delete state.items[id];
    },
    addComment(state, action) {
      const item = action.payload;
      console.log("item", item)
      const existingItem = state.items[item._id];
      if (!existingItem) return;
      state.items[item._id].comment = item.comment;
    },
    replaceCart(state, action) {
      state.items = action.payload.items;
      state.totalPrice = action.payload.totalPrice;
    },
    deleteCart(state) {
      state.items = [];
      state.totalPrice = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  deleteItemFromCart,
  addComment,
  replaceCart,
  deleteCart,
} = cartSlice.actions;

export default cartSlice.reducer;
