import React from "react";
import { useDispatch } from "react-redux";
import { alterFilters } from "../../store/uiSlice";
import { truncate } from "../../utils/constants";

const SuperCategoryCard = ({ item }) => {
  const dispatch = useDispatch();
  const selectSuperCategory = () => {
    dispatch(
      alterFilters({
        type: "SET_FILTER",
        name: "selectedSuperCategory",
        value: {
          label: item.name,
          value: item._id
        },
      })
    );
  };
  return (
    <div
      onClick={selectSuperCategory}
      className="cursor-pointer text-ellipsis whitespace-nowrap overflow-hidden font-sans bg-gray-700 border-l-2 border-secondary-500 px-2 py-1 w-20 h-10 flex items-center justify-center rounded-2xl text-white"
    >
      <p className="text-ellipsis">{truncate(item.name,6)}</p>
    </div>
  );
};

export default SuperCategoryCard;
