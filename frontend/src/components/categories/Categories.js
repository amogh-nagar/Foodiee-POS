import React from "react";
import CategoriesContainer from "./CategoriesContainer";
import SuperCategoryContainer from "../SuperCategory/SuperCategoryContainer";
const Categories = () => {
  return (
    <div className="py-2 px-5 h-full">
      <div className="bg-primary-700 w-full h-full flex rounded-lg">
        <SuperCategoryContainer />
        <CategoriesContainer />
      </div>
    </div>
  );
};

export default Categories;
