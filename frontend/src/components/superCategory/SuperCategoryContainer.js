import React, { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import SuperCategoryCard from "./SuperCategoryCard";
import SearchDiv from "../Containers/SearchDiv";
import {
  useCreateSuperCategoryMutation,
  useGetAllSuperCategoriesQuery,
  useUpdateSuperCategoryMutation,
} from "../../services/superCategory";
import { useDispatch, useSelector } from "react-redux";
import { alterFilters } from "../../store/uiSlice";
import debounce from "lodash.debounce";
import { showToast } from "../../utils/constants";

const SuperCategoryContainer = () => {
  const [searchedTerm, setSearchedTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  let selectedBrand =
    useSelector((state) => state.ui.filters.selectedBrand) ?? {};

  const dispatch = useDispatch();
  useEffect(() => {
    const debouncer = debounce((newTerm) => {
      setDebouncedSearch(newTerm);
    }, 500);
    if (searchedTerm) {
      debouncer(searchedTerm);
    } else {
      setDebouncedSearch("");
    }
    return () => {
      debouncer.cancel();
    };
  }, [searchedTerm]);
  const { data, isLoading, isError } = useGetAllSuperCategoriesQuery(
    {
      page: 1,
      name: debouncedSearch,
      brandId: selectedBrand?.value,
    },
    {
      skip: !selectedBrand || !selectedBrand.value,
    }
  );
  const initialValues = {
    name: "",
    description: "",
    image: "",
  };
  const superCategories =
    data?.superCategories?.map((sCtg) => {
      return {
        ...sCtg,
        label: sCtg.name,
        value: sCtg._id,
      };
    }) || [];
  const [
    createSuperCategory,
    {
      isLoading: isCreateSuperCategoryLoading,
      isError: isCreateSuperCategoryError,
    },
  ] = useCreateSuperCategoryMutation();
  const [
    updateSuperCategory,
    {
      isLoading: isUpdateSuperCategoryLoading,
      isError: isUpdateSuperCategoryError,
    },
  ] = useUpdateSuperCategoryMutation();
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
      await createSuperCategory(formData).unwrap();
      showToast("Super Category Created Successfully", "success");
    } catch (err) {
      console.log("Some error occurred", err);
      showToast(err?.data?.message || "Some error occurred!");
    }
  };
  const onEditHadler = async function (values) {
    try {
      const formData = new FormData();
      for (var key in values) {
        formData.append(
          key,
          typeof values[key] === "string" ? values[key]?.trim() : values[key]
        );
      }
      formData.append("brandId", selectedBrand.value);
      await updateSuperCategory(formData).unwrap();
      showToast("Super Category Updated Successfully", "success");
    } catch (err) {
      console.log("Some error occurred", err);
      showToast(err?.data?.message || "Some error occurred!");
    }
  };
  const validate = () => {};
  const selectSuperCategory = (sCtg) => {
    dispatch(
      alterFilters({
        type: "SET_FILTER",
        name: "selectedSuperCategory",
        value: sCtg,
      })
    );
  };
  return (
    <div className="h-full w-2/6 border-r-2 border-r-secondary-300 p-2">
      <SearchDiv
        cntClass="justify-between"
        name={"Super Category"}
        setSearchedTerm={setSearchedTerm}
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={validate}
        buttonClass="whitespace-nowrap"
        fields={[
          {
            type: "text",
            name: "name",
            label: "Name",
            placeholder: "Super Category Name",
          },
          {
            type: "textarea",
            name: "description",
            label: "Description",
            placeholder: "Super Category Description",
          },
          {
            type: "file",
            name: "image",
            label: "Image",
            placeholder: "Super Category Image",
          },
        ]}
      />
      <div className="overflow-y-auto hide-scrollbar flex flex-col gap-y-2 bg-slate-900 w-full h-[90%] p-3">
        {superCategories && superCategories.length ? (
          superCategories.map((superCtg, index) => (
            <SuperCategoryCard
              key={index}
              onClick={() => {
                selectSuperCategory(superCtg);
              }}
              onSubmit={onEditHadler}
              {...superCtg}
            />
          ))
        ) : (
          <div className="w-full h-96 flex items-center justify-center">
            <p>No Super Category Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperCategoryContainer;
