import React, { useState } from "react";
import CtgNdSuperCtgCard from "./categories/BillingCtgNdSuperCtgCard";
import ItemCard from "./dish/dishBillingCard";
const superCategories = [
  {
    name: "Breakfast",
  },
];
var categories = [
  {
    name: "Samosa",
  },
];
var dishes = [];
const PunchItems = ({}) => {
  const [activeSuperCtgIndex, setActiveSuperCtgIndex] = useState(null);
  var clickHandlerForCategory = function () {};
  var clickHandlerForSuperCategory = function () {};
  return (
    <>
      {superCategories && superCategories.length > 0 ? (
        <>
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
                          ? "border-b-secondary-500 bg-gray-600 text-secondary-400 border-b-2"
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
            <div className="flex h-fit max-h-[270px] flex-wrap gap-x-4 gap-y-3 mb-5 overflow-auto hide-scrollbar">
              {categories && categories.length > 0 ? (
                categories.map((item, index) => {
                  return (
                    <CtgNdSuperCtgCard
                      key={index}
                      img={item.img}
                      name={item.name}
                      handler={clickHandlerForCategory}
                    />
                  );
                })
              ) : (
                <div className="text-secondary-200">
                  <h3>No Dishes Found</h3>
                </div>
              )}
            </div>
            {dishes && dishes.length > 0 ? (
              <div className="flex h-fit max-h-[270px] flex-wrap gap-x-4 gap-y-3 mb-5 overflow-auto hide-scrollbar">
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
            ) : (
              <div className="text-secondary-200">
                <h3>No Dishes Found</h3>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="h-96 flex justify-center items-center w-full text-center text-secondary-300">
            <h3>No Super Categories</h3>
        </div>
      )}
    </>
  );
};

export default PunchItems;
