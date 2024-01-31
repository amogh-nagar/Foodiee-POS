import React from "react";
import CategoryCard from "./CategoryCard.js";
import { FaCaretRight } from "react-icons/fa";

const BillingCategories = ({categories}) => {
    categories=[
        {
            name:"Samosa"
        },
        
        {
            name:"Samosa"
        },
        
        {
            name:"Samosa"
        },
        
        {
            name:"Samosa"
        },
        
        {
            name:"Samosa"
        },
        
        {
            name:"Samosa"
        },
        
        {
            name:"Samosa"
        },
        
        {
            name:"Samosa"
        },
        
        {
            name:"Samosa"
        },
        
        {
            name:"Samosa"
        },
        
        {
            name:"Samosa"
        },
        
        {
            name:"Samosa"
        }
    ]
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between text-orange-400">
        <p>Categories</p>
        <button className="flex items-center justify-between text-secondary-500">
          <p>View All</p>
          <FaCaretRight className="w-5 h-5" />
        </button>
      </div>
      {categories?.length ? (
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((item, index) => (
            <CategoryCard
              key={index}
              img={item.img}
              name={item.name}
            />
          ))}
        </div>
      ) : (
        <div>
          <p className="text-secondary-200">No Categories Found</p>
        </div>
      )}
    </div>
  );
};

export default BillingCategories;
