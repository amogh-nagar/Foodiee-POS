import React from "react";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
const RoleCard = ({
  name = "XYZ",
  description = "Responsible for managing xyz and creating xyz",
  tags = [],
}) => {
  return (
    <div className="h-52 w-96 rounded-sm bg-primary-600 flex flex-col justify-between items-start">
      <div>
        <div className="border-b-2 flex items-center justify-between border-b-secondary-600 p-3">
          <h3>{name}</h3>
          <div className="flex items-center gap-2 text-secondary-200">
            <button>
              <MdOutlineEdit className="w-5 h-5" />
            </button>
            <button>
              {" "}
              <MdDeleteOutline className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-3 font-mono">
          <p>{description}</p>
        </div>
      </div>
      <div className="p-3">
        <ul>
          {tags.map((item, index) => {
            return (
              <li
                className="text-white text-sm bg-secondary-700 rounded-lg px-1"
                key={index}
              >
                {item}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default RoleCard;
