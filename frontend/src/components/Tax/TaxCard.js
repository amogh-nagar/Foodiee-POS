import React from "react";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";

const TaxCard = ({ name = "XYZ", value = 0 }) => {
  return (
    <div className="w-full shadow-lg shadow-primary-700 flex justify-between items-center gap-x-2 bg-slate-800 hover:bg-secondary-light cursor-pointer p-3 rounded-md">
      <div className="flex items-center">
        <p>{name}</p>
        <p>@ {value}%</p>
      </div>
      <div className="flex items-center gap-x-1 text-secondary-200">
        <button className="outline-none">
          <MdOutlineEdit className="w-6 h-6" />
        </button>
        <button>
          <MdDeleteOutline className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default TaxCard;
