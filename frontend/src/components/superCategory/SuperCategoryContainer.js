import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import SuperCategoryCard from "./SuperCategoryCard";
import SearchDiv from "../Containers/SearchDiv";

const SuperCategoryContainer = () => {
  const [searchedTerm, setSearchedTerm] = useState("");
  const initialValues = {
    name: "",
    description: "",
    image: "",
  };
  const onSubmit = () => {};
  const validate = () => {};
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
      <div className="overflow-y-auto hide-scrollbar flex flex-col gap-y-2 bg-slate-900 w-full h-[90%] p-3">
        <SuperCategoryCard />
      </div>
    </div>
  );
};

export default SuperCategoryContainer;
