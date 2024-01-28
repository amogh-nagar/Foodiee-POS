import React from "react";
import DishCard from "../dish/dishCard";
import { IoMdAdd } from "react-icons/io";
import Modal from "../Modals/Modal";
import {
  useCreateDishMutation,
  useGetAllDishesQuery,
  useUpdateDishMutation,
} from "../../services/dish";
import { useSelector } from "react-redux";
import Breadcrumbs from "../Wrappers/BreadCrumbs/BreadCrumbs";
import { useGetAllSuperCategoriesQuery } from "../../services/superCategory";
import { useGetAllCategoriesQuery } from "../../services/category";
import { alterFilters } from "../../store/uiSlice";
import { showToast } from "../../utils/constants";
import useRTKQuery from "../../hooks/useRTKQuery";
import useRTKMutation from "../../hooks/useRTKMutation";
const Dishes = () => {
  let selectedBrand =
    useSelector((state) => state.ui.filters.selectedBrand) ?? {};
  let selectedSuperCategory =
    useSelector((state) => state.ui.filters.selectedSuperCategory) ?? {};
  let selectedCategory =
    useSelector((state) => state.ui.filters.selectedCategory) ?? {};
  const { data } = useRTKQuery(
    useGetAllDishesQuery,
    {
      page: 1,
      brandId: selectedBrand?.value,
      superCategoryId: selectedSuperCategory?.value,
      categoryId: selectedCategory?.value,
    },
    {
      skip: !selectedBrand.value,
    }
  );
  const { trigger: createDish } = useRTKMutation(useCreateDishMutation);
  const { trigger: updateDish } = useRTKMutation(useUpdateDishMutation);

  const validate = () => {};
  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      for (var key in values) {
        formData.append(
          key,
          typeof values[key] === "string" ? values[key]?.trim() : values[key]
        );
      }
      formData.append("brandId", selectedBrand.value);
      formData.append("superCategoryId", selectedSuperCategory.value);
      formData.append("superCategoryName", selectedSuperCategory.label);
      formData.append("categoryId", selectedCategory.value);
      formData.append("categoryName", selectedCategory.label);
      await createDish(formData).unwrap();
      showToast("Dish Created Successfully", "success");
    } catch (err) {
      console.log("Some error occurred", err);
      showToast(err?.data?.message || "Some error occurred!");
    }
  };
  const onEditHandler = async (values) => {
    try {
      const formData = new FormData();
      for (var key in values) {
        formData.append(
          key,
          typeof values[key] === "string" ? values[key]?.trim() : values[key]
        );
      }
      formData.append("brandId", selectedBrand.value);
      formData.append("superCategoryId", selectedSuperCategory.value);
      formData.append("superCategoryName", selectedSuperCategory.label);
      formData.append("categoryId", selectedCategory.value);
      formData.append("categoryName", selectedCategory.label);
      await updateDish(formData).unwrap();
      showToast("Dish Updated Successfully", "success");
    } catch (err) {
      console.log("Some error occurred", err);
      showToast(err?.data?.message || "Some error occurred!");
    }
  };
  const initialValues = {
    name: "",
    image: "",
    description: "",
    rate: 0,
  };
  let popUpButton = (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <IoMdAdd />
      <p>Add Dish</p>
    </div>
  );

  if (
    !selectedBrand?.value ||
    !selectedSuperCategory?.value ||
    !selectedCategory?.value
  ) {
    popUpButton = (
      <div className="disableEntity w-full h-full flex flex-col items-center justify-center">
        <IoMdAdd />
        <p>Add Dish</p>
      </div>
    );
  }
  const breadcrumbItems = [
    { title: "Dish Type" },
    {
      title: "Super Category",
      useGetOptionsQuery: useGetAllSuperCategoriesQuery,
      fieldToSubscribe: "selectedBrand",
      type: "array",
      fieldToPassInQuery: "brandId",
      fieldinResponse: "superCategories",
      detailsToDispatch: {
        func: alterFilters,
        args: {
          name: "selectedSuperCategory",
          type: "SET_FILTER",
        },
      },
    },
    {
      title: "Category",
      useGetOptionsQuery: useGetAllCategoriesQuery,
      fieldToSubscribe: "selectedSuperCategory",
      fieldToPassInQuery: "superCategoryId",
      fieldinResponse: "categories",
      type: "array",
      detailsToDispatch: {
        func: alterFilters,
        args: {
          name: "selectedCategory",
          type: "SET_FILTER",
        },
      },
    },
  ];
  return (
    <div>
      <Breadcrumbs breadcrumbItems={breadcrumbItems} />
      <div className="py-4 px-5 flex flex-wrap gap-x-4 gap-y-3">
        <div className="cursor-pointer bg-primary-700 shadow-lg shadow-primary-700 w-48 h-60 border-2 border-dashed border-secondary-500 text-secondary-500 rounded-xl">
          <Modal
            PopUpButton={popUpButton}
            validate={validate}
            isForm={true}
            HeaderText={() => <h3>Add New Dish</h3>}
            buttonText={"Create"}
            fields={[
              {
                type: "text",
                name: "name",
                label: "Name",
                placeholder: "Dish Name",
              },
              {
                type: "textarea",
                name: "description",
                label: "Description",
                placeholder: "Dish Description",
              },
              {
                type: "file",
                name: "image",
                label: "Image",
                placeholder: "Dish Image",
              },
              {
                type: "number",
                name: "rate",
                label: "Rate",
                placeholder: "Dish Rate",
              },
            ]}
            initialValues={initialValues}
            onSubmit={onSubmit}
          />
        </div>
        {data?.dishes?.map((dish) => (
          <DishCard onSubmit={onEditHandler} {...dish} />
        ))}
      </div>
    </div>
  );
};

export default Dishes;
