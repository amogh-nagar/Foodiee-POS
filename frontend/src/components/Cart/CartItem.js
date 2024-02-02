import React, { useEffect, useState } from "react";
import { currencyMap } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { addComment, deleteItemFromCart } from "../../store/cartSlice";
import useDebouncer from "../../hooks/useDebouncer";
import { AiOutlineDelete } from "react-icons/ai";
const CartItem = ({ item, currency = "INR" }) => {
  const dispatch = useDispatch();
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchedTerm, setSearchedTerm] = useDebouncer(setDebouncedSearch);
  const onDeleteHandler = (itemId) => {
    dispatch(deleteItemFromCart(itemId));
  };
  useEffect(() => {
    dispatch(
      addComment({
        _id: item.id,
        comment: debouncedSearch,
      })
    );
  }, [debouncedSearch]);
  return (
    <li className="bg-primary-700 p-4 rounded-lg flex gap-x-3 justify-between text-white w-full mb-3">
      <div className="w-full flex gap-y-2 flex-col justify-between items-center ">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col gap-x-3">
            <h4 className="text-base">{item.name}</h4>
            <p className="text-xs">
              {currencyMap[currency]}
              {item.rate}
            </p>
          </div>
          <div className="flex items-center justify-between gap-x-2">
            <p className="text-gray-400">X</p>
            <div className=" bg-gray-600 w-9 h-9 rounded-xl flex items-center justify-center">
              <p>{item.quantity}</p>
            </div>
          </div>
        </div>
        <div className="w-full">
          <input
            value={searchedTerm}
            onChange={(e) => setSearchedTerm(e.target.value)}
            placeholder="Dish Note...."
            className="w-full px-2 h-11 rounded-lg bg-gray-600 outline-none"
          />
        </div>
      </div>
      <div className="px-2 flex flex-col gap-y-4 justify-between items-center text-secondary-500">
        <h4 className="text-lg h-10 flex items-center justify-center">
          {currencyMap[currency]}
          {item.quantity * item.rate}
        </h4>
        <button
          onClick={() => onDeleteHandler(item.id)}
          className="border-2 hover:bg-secondary-500 hover:text-primary-500  border-secondary-600 rounded-xl p-2"
        >
          <AiOutlineDelete className="w-5 h-5" />
        </button>
      </div>
    </li>
  );
};

export default CartItem;
