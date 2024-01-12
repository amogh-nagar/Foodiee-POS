import React from "react";
import PageNameWithDate from "../components/PageNameWithDate";
import Select from "react-select";
const Brands = () => {
  return (
    <div>
      <PageNameWithDate
        name="Brands"
        MultiSelect={() => (
          <Select
            isMulti
            name="colors"
            options={[
              { value: "chocolate", label: "Chocolate" },
              { value: "strawberry", label: "Strawberry" },
              { value: "vanilla", label: "Vanilla" },
            ]}
            placeholder="Select Tenants"
            className="basic-multi-select w-96 bg-primary-700 rounded-lg text-secondary-600"
            styles={{
              control: (provided, state) => ({
                ...provided,
                boxShadow: "none",
                border: "none",
                backgroundColor: "#EA7C6",
                color: "white",
              }),
            }}
          />
        )}
      />
    </div>
  );
};

export default Brands;
