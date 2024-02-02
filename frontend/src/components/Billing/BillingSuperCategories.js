import React from "react";
import SuperCategoryCard from "./SuperCategoryCard";
import { FaCaretRight } from "react-icons/fa";
import SearchModal from "../Modals/SearchModal";
import { useSelector } from "react-redux";
import { useGetAllOutletSuperCategoriesQuery } from "../../services/superCategory";
import useRTKQuery from "../../hooks/useRTKQuery";
const BillingSuperCategories = () => {
  const outletsQuery = useSelector((state) => state.auth.outletsQuery);
  const { data } = useRTKQuery(
    useGetAllOutletSuperCategoriesQuery,
    {
      page: 1,
      ...outletsQuery,
    },
    {
      skip: !outletsQuery || !Object.keys(outletsQuery).length,
    }
  );
  const superCategories = data?.superCategories ?? [];
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between text-orange-400">
        <p>Super Categories</p>
        {superCategories && superCategories.length > 10 ? (
          <SearchModal
            elements={superCategories ?? []}
            Card={SuperCategoryCard}
            PopUpButton={
              <button className="flex items-center justify-between text-secondary-500">
                <p>View All</p>
                <FaCaretRight className="w-5 h-5" />
              </button>
            }
            searchText={"Super Categories"}
          />
        ) : (
          ""
        )}
      </div>
      {superCategories && superCategories?.length ? (
        <div className="flex hide-scrollbar items-center gap-2 overflow-hidden">
          {superCategories.map((item, index) => (
            <SuperCategoryCard key={index} item={item} />
          ))}
        </div>
      ) : (
        <div>
          <p className="text-secondary-200">No Super Categories Found</p>
        </div>
      )}
    </div>
  );
};

export default BillingSuperCategories;
