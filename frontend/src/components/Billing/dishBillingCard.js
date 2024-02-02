import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../store/cartSlice";
import { currencyMap } from "../../utils/constants";
const DishBillingCard = ({ dish: { name, rate, _id, currency = "INR" } }) => {
  const dispatch = useDispatch();
  const quantity = useSelector((state) => state.cart.items[_id]?.quantity) ?? 0;
  console.log("quantity", quantity)
  var addItem = () => {
    dispatch(addToCart({ name, rate, _id }));
  };
  var subtractItem = () => {
    dispatch(removeFromCart({ _id }));
  };
  return (
    <div
      className={`font-sans flex-col flex justify-between border-l-4 w-40 h-32 p-4 rounded-xl text-white ${
        quantity > 0
          ? "bg-secondary-600  border-white"
          : " bg-gray-700 border-secondary-400"
      }`}
    >
      <div>
        <h3 className="text-xl">{name}</h3>
        <p className="text-base text-gray-300">
          {currencyMap[currency]}
          {rate}
        </p>
      </div>
      <div className="w-full justify-end flex gap-x-3">
        <button
          className={`border-2 w-7 h-7 rounded-lg ${
            quantity > 0
              ? "border-primary-600 text-black hover:bg-primary-500 hover:text-white"
              : "border-gray-500 hover:bg-secondary-500 hover:text-black hover:border-secondary-500"
          }`}
          onClick={subtractItem}
        >
          -
        </button>
        <span className="dishQuantity">{quantity}</span>
        <button
          className={`border-2 w-7 h-7 rounded-lg ${
            quantity > 0
              ? "border-primary-600 text-black hover:bg-primary-500 hover:text-white"
              : "border-gray-500 hover:bg-secondary-500 hover:text-black hover:border-secondary-500"
          }`}
          onClick={addItem}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default DishBillingCard;
