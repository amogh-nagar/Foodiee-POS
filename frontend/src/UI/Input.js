import React from "react";

const Input = ({ field, form: { touched, errors }, ...props }) => {
  const isError = touched[field.name] && errors[field.name];
  return (
    <div className="my-4">
      <label className="block mb-1 text-gray-400" htmlFor={field.name}>
        {props.label}
      </label>
      <input
        {...field}
        {...props}
        className="border-2 rounded-xl border-primary-700 p-2 w-full focus:outline-none focus:border-neutral-400 bg-slate-600 relative right-1"
      />
      {isError && <div className="text-warning-500 text-sm mt-1">{errors[field.name]}</div>}
    </div>
  );
};

export default Input;
