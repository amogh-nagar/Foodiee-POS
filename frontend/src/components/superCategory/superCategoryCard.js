import React from "react";
import { getColor } from "../../utils/constants";
import { FaAngleRight } from "react-icons/fa";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
const SuperCategoryCard = ({ img, name = "Samosa" }) => {
  let styleObj = getColor(img);
  return (
    <div className="w-full shadow-lg shadow-primary-700 flex items-center gap-x-6 bg-primary-300 hover:bg-secondary-light cursor-pointer p-3 rounded-md">
      <div style={styleObj} className="h-12 w-12 rounded-full"></div>
      <div className="w-[77%] flex justify-between items-center">
        <div className="flex items-center justify-center gap-x-5">
          <p>{name}</p>
          <div className="flex items-center gap-x-1 text-secondary-200">
            <button>
              <MdOutlineEdit className="w-5 h-5" />
            </button>
            <button>
              <MdDeleteOutline className="w-5 h-5" />
            </button>
          </div>
        </div>
        <FaAngleRight />
      </div>
    </div>
  );
};

export default SuperCategoryCard;
