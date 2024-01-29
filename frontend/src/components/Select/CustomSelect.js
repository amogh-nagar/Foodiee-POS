import React, { useState } from "react";
import Select from "react-select";
import CustomDropdownIndicator from "./CustomDropdownIndicator";
import { selectCustomStyle } from "../../utils/constants";
import useDebouncer from "../../hooks/useDebouncer";
import useRTKQuery from "../../hooks/useRTKQuery";
import Loader from "../Loaders/Loader";
const CustomSelect = ({
  defaultValue,
  handleSelectChange,
  useGetOptionsQuery,
  skip,
  inputQuery,
  field,
  customField,
  name,
}) => {
  const [debouncedText, setDebouncedText] = useState("");
  const setSearchedText = useDebouncer(setDebouncedText)[1];
  const { data, isLoading } = useRTKQuery(
    useGetOptionsQuery,
    {
      ...inputQuery,
      name: debouncedText,
    },
    {
      skip: skip,
    },
    Loader
  );
  const options =
    data && data[field]
      ? data[field].map((ele) => {
          const customEle = {
            label: ele.name,
            value: ele._id,
          };
          customField?.forEach((val) => {
            if (ele[val]) {
              customEle[val] = ele[val];
            }
          });
          return customEle;
        })
      : [];
  return (
    <Select
      components={{ DropdownIndicator: CustomDropdownIndicator }}
      defaultValue={defaultValue && defaultValue.label ? defaultValue : null}
      onChange={handleSelectChange}
      name={name}
      isLoading={isLoading}
      onInputChange={(e) => setSearchedText(e)}
      options={options}
      placeholder={`Select Entity`}
      className="basic-multi-select w-96 bg-primary-700 rounded-lg text-secondary-600"
      styles={selectCustomStyle}
    />
  );
};

export default CustomSelect;
