import PhoneInput from "react-phone-input-2";
import { getIn } from "formik";
import React, { useState } from 'react';
const CustomPhoneInput = (props) => {
  const {
    className,
    field: { name, value },
    form: { errors, setFieldValue, touched },
    label,
    country,
    disabled,
  } = props;
  console.log("value dgdfrdfr", value, name);
  const [isFocused, setFocused] = useState(false);
  const isError = getIn(touched, name) && getIn(errors, name);
  const errorStyle = isError ? "error" : "";
  const filledStyle = isFocused || value ? "filled" : "";
  const disabledStyle = disabled ? "disabled" : "";
  const onValueChange = (phoneNumber) => {
    setFieldValue(name, phoneNumber);
  };

  return (
    <div
      className={`${className} ${errorStyle} ${filledStyle} ${disabledStyle} text-input-group my-2`}
    >
      <label className="block mb-1 text-gray-400" htmlFor={name}>
        {label}
      </label>
      <PhoneInput
        placeholder="Enter phone number"
        name={name}
        value={value}
        onChange={onValueChange}
        country={country}
        containerClass="w-full"
        inputStyle={{
          backgroundColor: "rgb(71 85 105)",
          color: "rgb(156 163 175)",
          outline: "none",
          border: "1px solid rgb(26 30 48)",
          width: "100%",
        }}
      />
      {isError && (
        <div className="text-warning-500 text-sm mt-1">{errors[name]}</div>
      )}
    </div>
  );
};

export default CustomPhoneInput;
