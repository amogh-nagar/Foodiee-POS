import { useState } from "react";
import Select from "react-select";
import CustomDropdownIndicator from "../CustomDropdownIndicator";
import { selectCustomStyle } from "../../utils/constants";

const BreadcrumbItem = ({ item, isLast }) => {
  const dropdownOptions = item.values;

  const handleSelectChange = (option) => {
    item.onChange(option);
  };

  return (
    <li
      className={`flex items-center text-sm ${
        isLast ? "text-orange-500" : "text-gray-400"
      }`}
    >
      {item.type == "array" ? (
        <div>
          <Select
            defaultValue={null}
            components={{ DropdownIndicator: CustomDropdownIndicator }}
            options={dropdownOptions}
            placeholder={item.title}
            onInputChange={()=>{}}
            styles={selectCustomStyle}
            onChange={handleSelectChange}
            className="basic-multi-select bg-primary-700 rounded-2xl text-secondary-600 outline-none cursor-pointer"
          />
        </div>
      ) : (
        <span className="cursor-default">{item.title}</span>
      )}
      {!isLast && <span className="mx-2">/</span>}
    </li>
  );
};
export default BreadcrumbItem;
