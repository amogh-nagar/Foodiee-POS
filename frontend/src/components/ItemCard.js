import React from "react";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../store/cartSlice";
import { currencyMap } from "../utils/constants";
const ItemCard = ({ name, price = 0, quantity = 0, id, currency = "INR" }) => {
  const dispatch = useDispatch();
  var addItem = () => {
    dispatch(addToCart({ name, price, quantity, id }));
  };
  var subtractItem = () => {
    dispatch(removeFromCart({ id }));
  };
  return (
    <div
      className={`font-sans flex-col flex justify-between border-l-4 w-36 h-32 p-4 rounded-xl text-white ${
        quantity > 0
          ? "bg-secondary-400  border-white"
          : " bg-gray-700 border-secondary-400"
      }`}
    >
      <div>
        <h3 className="text-xl">{name}</h3>
        <p className="text-base text-gray-300">{currencyMap[currency]}{price}</p>
      </div>
      <div className="w-full justify-end flex gap-x-3">
        <button
          className={`border-2 w-7 h-7 rounded-lg ${
            quantity > 0 ? "border-primary-600 text-black hover:bg-gray-700 hover:text-white" : "border-gray-500 hover:bg-secondary-500 hover:text-black"
          }`}
          onClick={addItem}
        >
          -
        </button>
        <span class="dishQuantity">{quantity}</span>
        <button
          className={`border-2 w-7 h-7 rounded-lg ${
            quantity > 0 ? "border-primary-600 text-black hover:bg-gray-700 hover:text-white" : "border-gray-500 hover:bg-secondary-500 hover:text-black"
          }`}
          onClick={subtractItem}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
