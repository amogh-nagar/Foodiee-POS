import React, { useEffect, useState } from "react";
import Select from "react-select";
import CustomDropdownIndicator from "../CustomDropdownIndicator";
import { selectCustomStyle } from "../../utils/constants";
import debounce from "lodash.debounce";
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
  const [searchedText, setSearchedText] = useState("");
  const [debouncedText, setDebouncedText] = useState("");
  useEffect(() => {
    const debouncer = debounce((newTerm) => {
      setDebouncedText(newTerm);
    }, 500);
    if (searchedText) {
      debouncer(searchedText);
    } else {
      setDebouncedText("");
    }
    return () => {
      debouncer.cancel();
    };
  }, [searchedText]);
  const { data, isError, isLoading } = useGetOptionsQuery(
    {
      ...inputQuery,
      name: debouncedText,
    },
    {
      skip: skip,
    }
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
      defaultValue={defaultValue}
      onChange={handleSelectChange}
      name={name}
      isLoading={isLoading}
      onInputChange={(e) => setSearchedText(e)}
      options={options}
      placeholder={`Select ${name}`}
      className="basic-multi-select w-96 bg-primary-700 rounded-lg text-secondary-600"
      styles={selectCustomStyle}
    />
  );
};

export default CustomSelect;
