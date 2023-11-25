import { createSlice } from "@reduxjs/toolkit";
const initialcartstate = {items: [], totalquantity: 0};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialcartstate,
  reducers: {
    addToCart(state, action) {
      const item = action.payload;
      const existingitemindex = state.items.findIndex((i) => i.id === item.id);
      state.totalquantity++;
      if (existingitemindex >= 0) {
        state.items[existingitemindex].quantity += 1;
        state.items[existingitemindex].totalprice += item.price;
      } else {
        state.items.push({
          id: item.id,
          price: item.price,
          quantity: 1,
          totalprice: item.price,
          name: item.name,
        });
      }
    },
    removeFromCart(state, action) {
      state.totalquantity--;
      const id = action.payload;
      const existingitem = state.items.find((i) => i.id === id);
      if (existingitem.quantity === 1) {
        const items = state.items;
        const updateditems = items.filter((i) => i.id !== id);
        state.items = updateditems;
      } else {
        existingitem.quantity -= 1;
        existingitem.totalprice -= existingitem.price;
      }
    },
    replaceCart(state, action) {
      state.items = action.payload.items;
      state.totalquantity = action.payload.totalquantity;
    },
    deleteCart(state){
        state.items = [];
        state.totalquantity = 0;
    }
  },
});

export const {addToCart, removeFromCart, replaceCart, deleteCart} = cartSlice.actions

export default cartSlice.reducer;