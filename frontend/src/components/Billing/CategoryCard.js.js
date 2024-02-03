import React from "react";
import { getColor, getRandomColors, truncate } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { alterFilters } from "../../store/uiSlice";

const CategoryCard = ({ item }) => {
  const dispatch = useDispatch();
  const selectCategory = () => {
    dispatch(
      alterFilters({
        type: "SET_FILTER",
        name: "selectedCategory",
        value: {
          label: item.name,
          value: item._id,
        },
      })
    );
  };

  let styleObj = getColor(item.image, item.name);
  return (
    <div
      onClick={selectCategory}
      className="flex flex-col items-start justify-end text-primary-700 w-40 h-32 p-4 rounded-xl cursor-pointer"
      style={styleObj}
    >
      <div className="">
        <h3 className="text-xl text-white">{truncate(item.name, 12)}</h3>
      </div>
    </div>
  );
};

export default CategoryCard;
