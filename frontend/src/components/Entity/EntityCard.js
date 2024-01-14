import React from "react";
import "./EntityCard.css";
import { getColor } from "../../utils/constants";
import { Link } from "react-router-dom";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
const EntityCard = React.forwardRef(
  (
    {
      image,
      name,
      description,
      onClick,
      onDeleteBtnClick,
      onEditBtnClick,
      showEditAndDeleteBtns = false,
      ...args
    },
    ref
  ) => {
    console.log(image, name);
    let styleObj = getColor(image, name);
    return (
      <div
        ref={ref}
        style={styleObj}
        className="h-72 max-h-96 w-56 rounded-lg flex items-end cursor-pointer flex-col"
      >
        {showEditAndDeleteBtns && (
          <div className="flex py-1 px-2 items-center justify-end gap-x-3 text-slate-100">
            <button
              onClick={() => {
                onEditBtnClick({ _id: args?._id, name: name });
              }}
            >
              <MdOutlineEdit className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                onDeleteBtnClick({ _id: args?._id, name: name });
              }}
            >
              <MdDeleteOutline className="w-6 h-6" />
            </button>
          </div>
        )}
        <Link
          to={{
            pathname: "/brands",
            state: { selectedTenant: { _id: args?._id, name: name } },
          }}
        >
          <div className="h-64 max-h-96 w-56 rounded-lg flex items-end cursor-pointer">
            <div className="inner-div rounded-lg before:rounded-lg w-full h-32 max-h-80 px-2 py-3">
              <h4 className="text-xl">{name}</h4>
              <p className="text-md">{description}</p>
            </div>
          </div>
        </Link>
      </div>
    );
  }
);

export default EntityCard;
