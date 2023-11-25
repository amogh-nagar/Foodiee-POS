import React, { useState } from "react";
import { useSelector } from "react-redux";
import { currencyMap } from "../utils/constants";
import { BsCashStack } from "react-icons/bs";
import { FaCcMastercard } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
const cartItems = [
  {
    name: "Roasted Kitchen",
    price: 25.5,
    quantity: 2,
    subtotal: 100,
    currency: "INR",
  },
  {
    name: "Roasted Kitchen",
    price: 25.5,
    quantity: 2,
    subtotal: 100,
    currency: "INR",
  },
  {
    name: "Roasted Kitchen",
    price: 25.5,
    quantity: 2,
    subtotal: 100,
    currency: "INR",
  },
  {
    name: "Roasted Kitchen",
    price: 25.5,
    quantity: 2,
    subtotal: 100,
    currency: "INR",
  },
  {
    name: "Roasted Kitchen",
    price: 25.5,
    quantity: 2,
    subtotal: 100,
    currency: "INR",
  },
  {
    name: "Roasted Kitchen",
    price: 25.5,
    quantity: 2,
    subtotal: 100,
    currency: "INR",
  },
  {
    name: "Roasted Kitchen",
    price: 25.5,
    quantity: 2,
    subtotal: 100,
    currency: "INR",
  },
];
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
const Cart = () => {
  const [checkoutMethod, setCheckoutMethod] = useState("Cash");
  const cart = useSelector((state) => state.cart);
  return (
    <>
      <div className="w-full">
        <h3 className="text-xl">Order 34567</h3>
      </div>
      <div className="w-full h-[267px] overflow-auto my-4">
        <ul className="w-full h-full overflow-auto hide-scrollbar">
          {cartItems.map((item, index) => {
            return (
              <li className="bg-gray-700 p-4 rounded-lg flex justify-between text-white w-full mb-3">
                <div className="flex gap-x-3">
                  <p className="rounded-full bg-white text-black w-6 text-center">
                    {index + 1}
                  </p>
                  <h4>{item.name}</h4>
                  <span className="text-gray-500"> x {item.quantity}</span>
                </div>
                <div>
                  <h4>
                    {currencyMap[item.currency]}
                    {item.subtotal}
                  </h4>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="bg-gray-700 w-full h-full p-3 rounded-md">
        <div className="h-44">
          <div className="text-md flex justify-between">
            <h3>Subtotal</h3>
            <p>23.09</p>
          </div>
          <div className="text-2xl flex justify-between">
            <h2>Total</h2>
            <p>23.09</p>
          </div>
        </div>
        <div>
          <div className="h-24 w-full">
            <div className="mb-2">
              <h3>Payment Method</h3>
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
            <button className="rounded-2xl bg-white text-primary-600 w-full h-12">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
