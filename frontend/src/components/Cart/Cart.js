import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { currencyMap } from "../../utils/constants";
import { BsCashStack } from "react-icons/bs";
import { FaCcMastercard } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { deleteItemFromCart } from "../../store/cartSlice";
var checkoutMethods = [
  {
    name: "Cash",
    icon: <BsCashStack />,
  },
  {
    name: "Credit",
    icon: <FaCcMastercard />,
  },
  {
    name: "EWallet",
    icon: <IoWalletOutline />,
  },
];
const Cart = ({ currency = "INR" }) => {
  const [checkoutMethod, setCheckoutMethod] = useState("Cash");
  var cart = useSelector((state) => state.cart);
  const cartItems = cart.items ?? [];
  const dispatch = useDispatch();
  const onDeleteHandler = (itemId) => {
    dispatch(deleteItemFromCart(itemId));
  };
  return (
    <div className="w-3/12 h-full p-5">
      <div className="w-full h-5">
        <h3 className="text-xl font-semibold">Cart</h3>
      </div>
      <div className="flex flex-col justify-between items-center h-[90%]">
        <div className="w-full overflow-auto my-4">
          <ul className="w-full h-full overflow-auto hide-scrollbar">
            {cartItems && Object.keys(cartItems).length > 0 ? (
              Object.entries(cartItems).map(([index, item]) => {
                return (
                  <li
                    key={index}
                    className="bg-primary-700 p-4 rounded-lg flex gap-x-3 justify-between text-white w-full mb-3"
                  >
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
              })
            ) : (
              <div>
                <h4 className="text-slate-300">
                  No Cart Items Found, Punch Some Items!
                </h4>
              </div>
            )}
          </ul>
        </div>
        <div className="bg-gray-700 w-full p-8 rounded-md">
          <div className="h-44">
            <div className="text-md flex mb-1 justify-between">
              <h3>rate</h3>
              <p>0</p>
            </div>
            <div className="text-2xl flex justify-between">
              <h2>Total</h2>
              <p>0</p>
            </div>
          </div>
          <div>
            <div className="h-24 w-full">
              <div className="mb-2">
                <h3>Payment Methods</h3>
              </div>
              <div className="flex w-full justify-between items-cente">
                {checkoutMethods.map((method, index) => {
                  return (
                    <div
                      className="w-4/12 flex-col flex items-center justify-center mr-2"
                      key={index}
                    >
                      <button
                        onClick={() => setCheckoutMethod(method.name)}
                        className={`border-2 w-full h-8 justify-center flex items-center rounded-xl border-gray-500 ${
                          checkoutMethod === method.name
                            ? "border-secondary-300 bg-secondary-300"
                            : "border-gray-500"
                        }`}
                      >
                        {method.icon}
                      </button>
                      <p>{method.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <button className="rounded-2xl text-lg font-bold bg-white text-primary-600 w-full h-12">
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
