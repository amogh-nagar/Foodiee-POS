import React, { useEffect, useState } from "react";
import CustomDropdownIndicator from "../CustomDropdownIndicator";
import Loader from "../../UI/Loaders/Loader";
import { selectCustomStyle } from "../../utils/constants";
import Select from "react-select";
import { MdOutlineCancel } from "react-icons/md";
import { debounce } from "lodash";
const MultiValueContainer = ({ children, ...props }) => {
  return null;
};
const ValueDisplay = ({ selectedOptions, onRemoveItem, field }) => {
  return (
    <div className="flex flex-wrap items-center justify-start gap-3 mt-3">
      {selectedOptions?.map((option) => (
        <div
          key={option.value}
          onClick={() => onRemoveItem(option, field)}
          className="border-2 flex items-center justify-between  gap-x-2 rounded-xl hover:bg-secondary-700 hover:border-secondary-700 hover:text-primary-700 bg-secondary-light cursor-pointer border-secondary-light px-3 py-2 text-secondary-700"
        >
          <p className="text-sm">{option.label}</p>
          <p>
            <MdOutlineCancel className="w-6 h-6 text-red-600" />
          </p>
        </div>
      ))}
    </div>
  );
};
const MultiSelect = ({
  initialValues,
  title,
  useOptionsQuery,
  inputQuery,
  field,
  skipIfNull,
  onSubmit,
  btnClass,
  buttonText,
  customFields,
}) => {
  const [selectedOptions, setSelectedOptions] = useState(initialValues);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data, isLoading, isError } = useOptionsQuery(
    {
      ...inputQuery,
      name: debouncedSearch,
    },
    {
      skip: !skipIfNull,
    }
  );
  useEffect(() => {
    const debouncer = debounce((newTerm) => {
      setDebouncedSearch(newTerm);
    }, 500);
    if (searchTerm) {
      debouncer(searchTerm);
    } else {
      setDebouncedSearch("");
    }
    return () => {
      debouncer.cancel();
    };
  }, [searchTerm]);
  const onRemoveItem = (option) => {
    setSelectedOptions((prev) =>
      prev.filter((opt) => opt.value != option.value)
    );
  };
  const onChange = (options) => {
    setSelectedOptions(
      options.map((option) => {
        return {
          ...option,
          isSelected: true,
        };
      })
    );
  };
  let items = ((data && data[field]) || [])?.map((ele) => {
    let query = {
      label: ele.name,
      value: ele._id,
    };
    if (customFields) {
      Object.entries(customFields).forEach((cField) => {
        if (ele[cField[0]]) {
          query[cField[0]] = ele[cField[0]];
        }
      });
    }
    return query;
  });
  const onSubmitBtn = () => {
    onSubmit(selectedOptions);
  };
  if (isLoading) return <Loader />;
  return (
    <div className="w-full">
      <div className="flex flex-col w-full items-start justify-start">
        <Select
          isMulti
          defaultValue={initialValues}
          value={selectedOptions}
          components={{
            DropdownIndicator: CustomDropdownIndicator,
            MultiValueContainer,
          }}
          onInputChange={(e) => setSearchTerm(e)}
          options={items}
          placeholder={title}
          styles={selectCustomStyle}
          onChange={onChange}
          className="basic-multi-select bg-primary-700 rounded-2xl text-secondary-600 outline-none cursor-pointer w-full"
        />{" "}
        <ValueDisplay
          selectedOptions={selectedOptions}
          onRemoveItem={onRemoveItem}
          field={field}
        />
      </div>
      <div>
        <button
          onClick={onSubmitBtn}
          className={`${
            btnClass ? btnClass : "w-full h-11"
          } bg-secondary-300 mt-4 rounded-md font-bold hover:bg-secondary-500`}
          type="button"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default MultiSelect;
