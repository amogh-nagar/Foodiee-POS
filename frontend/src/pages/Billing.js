import React, { useState } from "react";
import PageNameWithDate from "../components/PageNameWithDate";
import CtgNdSuperCtgCard from "../components/CtgNdSuperCtgCard";
import GrayLine from "../components/GrayLine";
import ItemCard from "../components/ItemCard";
import { useSelector } from "react-redux";
import Cart from "../components/Cart";
const superCategories = [
  {
    name: "Breakfast",
  },
  {
    name: "Lunch",
  },
  {
    name: "Dinner",
  },
  {
    name: "Snacks",
  },
  {
    name: "Snacks",
  },
  {
    name: "Snacks",
  },
  {
    name: "Snacks",
  },
  {
    name: "Snacks",
  },
  {
    name: "Snacks",
  },
  {
    name: "Snacks",
  },
  {
    name: "Snacks",
  },
  {
    name: "Snacks",
  },
  {
    name: "Snacks",
  },
  {
    name: "Snacks",
  },
  {
    name: "Snacks",
  },
  {
    name: "Snacks",
  },
  {
    name: "Snacks",
  },
  {
    name: "Snacks",
  },
];
var categories = [
  {
    name: "Samosa",
  },
  {
    name: "Samosa",
  },

  {
    name: "Samosa",
  },

  {
    name: "Samosa",
  },
  {
    name: "Samosa",
  },
  {
    name: "Samosa",
  },
  {
    name: "Samosa",
  },
  {
    name: "Samosa",
  },
  {
    name: "Samosa",
  },
  {
    name: "Samosa",
  },
  {
    name: "Samosa",
  },
  {
    name: "Samosa",
  },
  {
    name: "Samosa",
  },
  {
    name: "Samosa",
  },
  {
    name: "Samosa",
  },
  {
    name: "Samosa",
  },
  {
    name: "Samosa",
  },
  {
    name: "Samosa",
  },
  {
    name: "Samosa",
  },
];

var dishes = [
  {
    name: "Plain Samosa",
    price: 100,
  },
  {
    name: "Plain Samosa",
    price: 100,
  },
  {
    price: 100,
    name: "Plain Samosa",
  },
  {
    price: 100,
    name: "Plain Samosa",
  },
  {
    price: 100,
    name: "Plain Samosa",
  },
  {
    price: 100,
    name: "Plain Samosa",
  },
  {
    price: 100,
    name: "Plain Samosa",
  },
  {
    price: 100,
    name: "Plain Samosa",
  },
  {
    price: 100,
    name: "Plain Samosa",
  },
  {
    price: 100,
    name: "Plain Samosa",
  },
  {
    price: 100,
    name: "Plain Samosa",
  },
  {
    price: 100,
    name: "Plain Samosa",
  },
  {
    price: 100,
    name: "Plain Samosa",
  },
  {
    price: 100,
    name: "Plain Samosa",
  },
  {
    name: "Plain Samosa",
  },
  {
    name: "Plain Samosa",
  },
  {
    name: "Plain Samosa",
  },
];
const Billing = () => {
  const [activeSuperCtgIndex, setActiveSuperCtgIndex] = useState(null);
  const cart = useSelector((state) => state.cart);
  var clickHandlerForCategory = function () {};
  var clickHandlerForSuperCategory = function () {};
  return (
    <div className="w-full hide-scrollbar">
      <PageNameWithDate name="Billing" searchBox={true} />
      <div className="w-full flex">
        <div className="h-full w-[74%]">
          <div className="w-full mb-4 px-4 mt-4">
            <ul className="flex h-10 overflow-x-auto w-full hide-scrollbar">
              {superCategories.map((item, index) => {
                return (
                  <li className="w-[67px] h-9 mr-4" key={index}>
                    <button
                      onClick={() => {
                        setActiveSuperCtgIndex(index);
                        clickHandlerForSuperCategory();
                      }}
                      className={`font-sans w-20 h-10 rounded-lg ${
                        activeSuperCtgIndex === index
                          ? "border-b-secondary-500 bg-gray-600 text-secondary-400"
                          : "text-white"
                      }`}
                    >
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="w-full max-h-full h-fit px-4 mt-3 pb-5 overflow-auto">
            <div className="flex h-[270px] flex-wrap gap-x-4 gap-y-3 mb-5 overflow-auto hide-scrollbar">
              {categories.map((item, index) => {
                return (
                  <CtgNdSuperCtgCard
                    key={index}
                    img={item.img}
                    name={item.name}
                    handler={clickHandlerForCategory}
                  />
                );
              })}
            </div>
            <div className="flex h-[270px] flex-wrap gap-x-4 gap-y-3 mb-5 overflow-auto hide-scrollbar">
              {dishes.map((dish, index) => {
                return (
                  <ItemCard
                    key={index}
                    id={index}
                    price={dish.price}
                    quantity={dish.quantity}
                    currency={dish.currency}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="w-3/12 h-full p-5">
            <Cart/>
        </div>
      </div>
    </div>
  );
};

export default Billing;
