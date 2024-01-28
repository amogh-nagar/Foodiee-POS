import { components } from "react-select";
import { RiExpandUpDownLine } from "react-icons/ri";
const CustomDropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <RiExpandUpDownLine style={{ color: "white" }} />
    </components.DropdownIndicator>
  );
};

export default CustomDropdownIndicator;
