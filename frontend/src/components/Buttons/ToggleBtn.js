import React from "react";
import "./ToggleBtn.css";
const ToggleBtn = ({ field, form, ...props }) => {
  return (
    <div className="my-2">
      <label className="block mb-1 text-gray-400" htmlFor={field.name}>
        {props.label}
      </label>
      <label className="switch">
        {field.value && <input {...field} {...props} type="checkbox" checked />}
        {!field.value && <input {...field} {...props} type="checkbox" />}
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default ToggleBtn;
