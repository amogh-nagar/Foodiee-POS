import CategoryCard from "./CategoryCard.js";
import { FaCaretRight } from "react-icons/fa";
import SearchModal from "../Modals/SearchModal.js";
import { useSelector } from "react-redux";
import { useGetAllCategoriesQuery } from "../../services/category.js";
import useRTKQuery from "../../hooks/useRTKQuery.js";
import Loader from "../Loaders/Loader.js";

const BillingCategories = () => {
  let selectedSuperCategory =
    useSelector((state) => state.ui.filters.selectedSuperCategory) ?? {};
  console.log("selectedSuperCategory", selectedSuperCategory);
  const { data } = useRTKQuery(
    useGetAllCategoriesQuery,
    {
      page: 1,
      superCategoryId: selectedSuperCategory?.value,
    },
    {
      skip: !selectedSuperCategory || !selectedSuperCategory?.value,
    },
    Loader
  );
  const categories = data?.categories ?? [];
  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between text-orange-400">
        <p>Categories</p>
        {categories?.length > 10 ? (
          <SearchModal
            elements={categories}
            Card={CategoryCard}
            PopUpButton={
              <button className="flex items-center justify-between text-secondary-500">
                <p>View All</p>
                <FaCaretRight className="w-5 h-5" />
              </button>
            }
            searchText={"Categories"}
          />
        ) : (
          ""
        )}
      </div>
      {categories?.length ? (
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((item, index) => (
            <CategoryCard key={index} item={item} />
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
