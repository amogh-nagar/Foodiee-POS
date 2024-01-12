import React from "react";
import { getColor } from "../../utils/constants";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
const CategoryCard = ({
  img = "https://cdn.britannica.com/36/123536-050-95CB0C6E/Variety-fruits-vegetables.jpg",
  name = "Samosa",
}) => {
  let styleObj = getColor(img, name);
  return (
    <div className="w-full shadow-lg shadow-primary-700 flex items-center gap-x-6 bg-primary-200 hover:bg-secondary-light cursor-pointer p-3 rounded-md">
      <div style={styleObj} className="h-12 w-12 rounded-full"></div>
      <div  className="flex w-full items-center justify-between gap-x-5">
        <p>{name}</p>
        <div className="flex items-center gap-x-1 text-secondary-200">
            <button>
              <MdOutlineEdit className="w-6 h-6" />
            </button>
            <button>
              <MdDeleteOutline className="w-6 h-6" />
            </button>
          </div>
      </div>
    </div>
  );
};

export default CategoryCard;
