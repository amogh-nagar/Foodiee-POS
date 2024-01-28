import React from "react";
import CustomForm from "../forms/Form";
import TaxCard from "./TaxCard";

const Taxes = () => {
  const initialValues = {
    name: "",
    value: "",
  };
  const onSubmit = (values) => {};
  const validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = "Tax name is required";
    }
    if (!values.value) {
      errors.value = "Tax value is required";
    }
    return errors;
  };
  return (
    <div className="py-2 px-5 h-full">
      <div className="bg-primary-700 w-full h-full flex rounded-lg flex-col">
        <div className="w-full px-5 py-2 border-b-2 border-b-secondary-500 h-max">
          <CustomForm
            initialValues={initialValues}
            onSubmit={onSubmit}
            validate={validate}
            validator={() => {}}
            btnClass = {"w-2/12 h-12 relative bottom-3"}
            fields={[
              {
                type: "text",
                name: "name",
                label: "Name",
                placeholder: "Tax Name",
              },
              {
                type: "number",
                name: "value",
                label: "Value",
                placeholder: "Tax Value",
              },
            ]}
            buttonText="Add"
          />
        </div>
        <div className="px-5 py-6 w-full overflow-y-auto hide-scrollbar flex flex-col gap-y-3">
            <TaxCard/>
            <TaxCard/>
            <TaxCard/>
            <TaxCard/>
            <TaxCard/>
            <TaxCard/>
            <TaxCard/>
            <TaxCard/>
        </div>
      </div>
    </div>
  );
};

export default Taxes;
