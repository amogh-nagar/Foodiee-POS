import React from "react";
import { FaCaretRight } from "react-icons/fa";
import DishBillingCard from "./DishBillingCard";
import SearchModal from "../Modals/SearchModal";
import useRTKQuery from "../../hooks/useRTKQuery";
import { useGetAllDishesQuery } from "../../services/dish";
import { useSelector } from "react-redux";

const BillingItems = () => {
  let selectedSuperCategory =
    useSelector((state) => state.ui.filters.selectedSuperCategory) ?? {};
  let selectedCategory =
    useSelector((state) => state.ui.filters.selectedCategory) ?? {};
  const { data } = useRTKQuery(
    useGetAllDishesQuery,
    {
      page: 1,
      superCategoryId: selectedSuperCategory?.value,
      categoryId: selectedCategory?.value,
    },
    {
      skip: !selectedSuperCategory.value || !selectedCategory.value,
    }
  );
  const dishes = data?.dishes ?? [];
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between text-orange-400">
        <p>Dishes</p>
        {dishes?.length > 10 ? (
          <SearchModal
            elements={dishes}
            Card={DishBillingCard}
            PopUpButton={
              <button className="flex items-center justify-between text-secondary-500">
                <p>View All</p>
                <FaCaretRight className="w-5 h-5" />
              </button>
            }
            searchText={"Dishes"}
          />
        ) : (
          ""
        )}
      </div>
      {dishes?.length ? (
        <div className="flex items-center gap-2 flex-wrap">
          {dishes.map((dish, index) => {
            return <DishBillingCard key={index} dish={dish} />;
          })}
        </div>
      ) : (
        <div>
          <p className="text-secondary-200">No Items Found</p>
        </div>
      )}
    </div>
  );
};

export default BillingItems;
