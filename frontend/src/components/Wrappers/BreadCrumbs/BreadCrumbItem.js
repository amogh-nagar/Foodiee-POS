import { useState } from "react";
import Select from "react-select";
import CustomDropdownIndicator from "../../Select/CustomDropdownIndicator";
import { selectCustomStyle } from "../../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import useDebouncer from "../../../hooks/useDebouncer";
import useRTKQuery from "../../../hooks/useRTKQuery";
const BreadCrumbItem = ({ item }) => {
  const fieldSubscribed = useSelector(
    (state) => state.ui.filters[item.fieldToSubscribe]
  );
  const optionField = useSelector(
    (state) => state.ui.filters[item.detailsToDispatch.args.name]
  );
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const setSearchTerm = useDebouncer(setDebouncedTerm)[1];
  const dispatch = useDispatch();
  const { data } = useRTKQuery(
    item.useGetOptionsQuery,
    {
      name: debouncedTerm,
      page: 1,
      [item.fieldToPassInQuery]: fieldSubscribed?.value,
    },
    {
      skip: !fieldSubscribed || !fieldSubscribed.value,
    }
  );
  const dropdownOptions =
    data && data[item.fieldinResponse]
      ? data[item.fieldinResponse].map((ele) => {
          return {
            ...ele,
            label: ele.name,
            value: ele._id,
          };
        })
      : [];
  const handleSelectChange = (option) => {
    dispatch(
      item.detailsToDispatch.func({
        ...item.detailsToDispatch.args,
        value: option,
      })
    );
  };
  return (
    <div>
      <Select
        defaultValue={optionField ?? null}
        components={{ DropdownIndicator: CustomDropdownIndicator }}
        options={dropdownOptions}
        placeholder={item.title}
        onInputChange={(e) => setSearchTerm(e)}
        styles={selectCustomStyle}
        onChange={handleSelectChange}
        className="basic-multi-select bg-primary-700 rounded-2xl text-secondary-600 outline-none cursor-pointer"
      />
    </div>
  );
};

export default BreadCrumbItem;
