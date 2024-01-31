import React from "react";
import SuperCategoryCard from "./SuperCategoryCard";
import { FaCaretRight } from "react-icons/fa";
const BillingSuperCategories = ({ superCategories }) => {
  // border-b-secondary-500 bg-gray-600 text-secondary-400 border-b-2
  superCategories = [
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
    },{
        name: "Samosa",
      },
  ];
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between text-orange-400">
        <p>Super Categories</p>
        <button className="flex items-center justify-between text-secondary-500">
          <p>View All</p>
          <FaCaretRight className="w-5 h-5" />
        </button>
      </div>
      {superCategories?.length ? (
        <div className="flex hide-scrollbar items-center gap-2 overflow-x-auto">
          {superCategories.map((item, index) => (
            <SuperCategoryCard key={index} item={item} />
          ))}
        </div>
      ) : (
        <div>
          <p className="text-secondary-200">No Super Categories Found</p>
        </div>
      )}
    </div>
  );
};

export default BillingSuperCategories;
