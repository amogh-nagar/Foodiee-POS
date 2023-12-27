import React from "react";
import SuperCategoryCard from "./superCategory/superCategoryCard";
import CategoryCard from "./categories/CategoryCard";
import { IoMdAdd } from "react-icons/io";
const Categories = () => {
  return (
    <div className="py-2 px-5 h-full">
      <div className="bg-primary-700 w-full h-full flex rounded-lg">
        <div className="h-full w-2/6 border-r-2 border-r-secondary-300 p-2">
          <div className="w-full rounded-md items-center justify-between flex h-[10%]">
            <input
              className="bg-gray-600 text-white font-sans p-2 rounded-lg outline-none w-2/3"
              placeholder="Search SuperCategories"
            />
            <button className="flex gap-x-1 items-center bg-secondary-500 p-3 rounded-lg">
              <IoMdAdd />
            </button>
          </div>
          <div className="overflow-y-auto hide-scrollbar flex flex-col gap-y-2 bg-slate-900 w-full h-[90%] p-3">
            <SuperCategoryCard />
          </div>
        </div>
        <div className="h-full w-4/6 p-2">
          <div className="w-full rounded-md items-center flex justify-between h-[10%]">
            <button className="flex gap-x-1 items-center bg-secondary-500 p-3 rounded-lg">
              <IoMdAdd />
            </button>
            <input
              className="bg-gray-600 w-2/3 text-white font-sans p-2 rounded-lg outline-none"
              placeholder="Search Categories"
            />
          </div>
          <div className="overflow-y-auto hide-scrollbar bg-slate-900 h-[90%] flex flex-col gap-y-2 p-3">
            <CategoryCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
