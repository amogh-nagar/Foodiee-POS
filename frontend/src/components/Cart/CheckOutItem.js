import React from "react";
import { currencyMap } from "../../utils/constants";
import { addToCart, removeFromCart } from "../../store/cartSlice";
import { useDispatch } from "react-redux";

const CheckOutItem = ({ item, currency = "INR" }) => {
  const dispatch = useDispatch();
  var addItem = (item) => {
    dispatch(
      addToCart({
        name: item.name,
        rate: item.rate,
        _id: item.id,
        description: item.description,
      })
    );
  };
  var subtractItem = (item) => {
    dispatch(removeFromCart({ _id: item.id }));
  };
  return (
    <li className="w-[35rem] flex items-center justify-between bg-primary-700 px-4 rounded-xl py-2">
      <div className="flex flex-col items-start justify-start">
        <div>
          <h4 className="text-2xl">
            <span>{item.name}</span>
            <span className="ml-4">
              - {currencyMap[currency]}
              {item.rate}
            </span>
          </h4>
          <p className="text-base text-slate-400">{item.description}</p>
        </div>
        <div className="text-secondary-500">
          <span>Comment - </span> <span>{item.comment || "NA"}</span>
        </div>
      </div>
      <div className="flex gap-x-14 h-full items-start justify-between">
        <div className="h-full gap-x-3 flex items-center justify-between">
          <button
            className="border-2 w-7 h-7 rounded-lg bg-secondary-dark text-white border-secondary-500"
            onClick={() => subtractItem(item)}
          >
            -
          </button>
          <span className="dishQuantity">{item.quantity}</span>
          <button
            className="border-2 w-7 h-7 rounded-lg bg-secondary-dark text-white border-secondary-500"
            onClick={() => addItem(item)}
          >
            +
          </button>
        </div>
        <div className="flex items-start">
          <h4 className="text-2xl h-10 flex items-start justify-center">
            {currencyMap[currency]}
            {item.quantity * item.rate}
          </h4>
        </div>
      </div>
    </li>
  );
};

export default CheckOutItem;
