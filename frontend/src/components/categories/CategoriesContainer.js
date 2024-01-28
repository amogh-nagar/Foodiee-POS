import React, { useState } from "react";
import CategoryCard from "./CategoryCard";
import SearchDiv from "../Containers/SearchDiv";
import {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../services/category";
import { useSelector } from "react-redux";
import { showToast } from "../../utils/constants";
import useDebouncer from "../../hooks/useDebouncer";
import Loader from "../Loaders/Loader";
import useRTKQuery from "../../hooks/useRTKQuery";
import useRTKMutation from "../../hooks/useRTKMutation";

const CategoriesContainer = () => {
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const setSearchedTerm = useDebouncer(setDebouncedSearch)[1];
  const selectedSuperCategory = useSelector(
    (state) => state.ui.filters.selectedSuperCategory
  );
  const { data } = useRTKQuery(
    useGetAllCategoriesQuery,
    {
      page: 1,
      name: debouncedSearch,
      superCategoryId: selectedSuperCategory?.value,
    },
    {
      skip: !selectedSuperCategory || !selectedSuperCategory?.value,
    },
    Loader
  );
  const { trigger: createCategory } = useRTKMutation(useCreateCategoryMutation);
  const { trigger: updateCategory } = useRTKMutation(useUpdateCategoryMutation);
  const initialValues = {
    name: "",
    description: "",
    image: "",
  };
  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      for (var key in values) {
        formData.append(
          key,
          typeof values[key] === "string" ? values[key]?.trim() : values[key]
        );
      }
      formData.append("superCategoryId", selectedSuperCategory.value);
      await createCategory(formData).unwrap();
      showToast("Category Created Successfully", "success");
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
      formData.append("superCategoryId", selectedSuperCategory.value);
      await updateCategory(formData).unwrap();
      showToast("Category Updated Successfully", "success");
    } catch (err) {
      console.log("Some error occurred", err);
      showToast(err?.data?.message || "Some error occurred!");
    }
  };
  const validate = () => {};
  return (
    <div className="h-full w-4/6 p-2">
      <SearchDiv
        cntClass="justify-between"
        name={"Category"}
        setSearchedTerm={setSearchedTerm}
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
        isDisabled={!selectedSuperCategory || !selectedSuperCategory?.value}
        fields={[
          {
            type: "text",
            name: "name",
            label: "Name",
            placeholder: "Category Name",
          },
          {
            type: "textarea",
            name: "description",
            label: "Description",
            placeholder: "Category Description",
          },
          {
            type: "file",
            name: "image",
            label: "Image",
            placeholder: "Category Image",
          },
        ]}
      />
      <div className="overflow-y-auto hide-scrollbar bg-slate-900 h-[90%] flex flex-col gap-y-2 p-3">
        {data && data.categories.length ? (
          data?.categories?.map((ctg, index) => (
            <CategoryCard onSubmit={onEditHandler} key={index} {...ctg} />
          ))
        ) : (
          <div className="w-full h-96 flex items-center justify-center">
            <p>No Category Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesContainer;
