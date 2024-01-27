import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import CategoryCard from "./CategoryCard";
import SearchDiv from "../Containers/SearchDiv";

const CategoriesContainer = () => {
  const [searchedTerm, setSearchedTerm] = useState("");
  const initialValues = {
    name: "",
    description: "",
    image: "",
  };
  const onSubmit = () => {};
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
        fields={[
          {
            type: "text",
            name: "name",
            label: "Name",
            placeholder: "Brand Name",
          },
          {
            type: "textarea",
            name: "description",
            label: "Description",
            placeholder: "Brand Description",
          },
          {
            type: "file",
            name: "image",
            label: "Image",
            placeholder: "Brand Image",
          },
        ]}
      />
      <div className="overflow-y-auto hide-scrollbar bg-slate-900 h-[90%] flex flex-col gap-y-2 p-3">
        <CategoryCard />
      </div>
    </div>
  );
};

export default CategoriesContainer;
