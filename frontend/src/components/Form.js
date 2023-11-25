import { Field, Form, Formik } from "formik";
import React from "react";
import Input from "../UI/Input";

const CustomForm = ({
  initialValues,
  onSubmit,
  validate,
  validator,
  fields,
  buttonText
}) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      validator={validator}
    >
      <Form>
        {fields.map((field, index) => {
          return (
            <Field
              key={index}
              type={field.type}
              name={field.name}
              id={field.name}
              label={field.label}
              placeholder={field.placeholder}
              component={Input}
            />
          );
        })}
        <button
          className="bg-secondary-300 w-full mt-4 rounded-md h-11 font-bold hover:bg-secondary-500"
          type="submit"
        >
          {buttonText}
        </button>
      </Form>
    </Formik>
  );
};

export default CustomForm;
