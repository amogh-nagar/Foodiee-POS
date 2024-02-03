import { Field, Form, Formik, FieldArray } from "formik";
import Input from "../CustomInputs/Input";
import TextArea from "../CustomInputs/TextArea";
import ImageUpload from "../CustomInputs/ImageUpload";
import ToggleBtn from "../Buttons/ToggleBtn";
import { IoIosCheckmark } from "react-icons/io";
import CustomPhoneInput from "../CustomInputs/CustomPhoneInput";

const CustomForm = ({
  initialValues,
  onSubmit,
  validate,
  validator,
  fields,
  buttonText,
  btnClass,
}) => {
  let fieldsType = {
    textarea: TextArea,
    file: ImageUpload,
    toggle: ToggleBtn,
    mobile: CustomPhoneInput,
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validate}
      validator={validator}
      validateOnChange={true}
      render={(props) => {
        const { values } = props;
        return (
          <Form className="w-full px-5">
            {fields.map((field, index) => {
              let Component = fieldsType[field.type] ?? Input;
              if (field.type === "checkbox") {
                return (
                  <label
                    key={index}
                    className="label cursor-pointer inline-flex items-center"
                  >
                    <Field
                      type={field.type}
                      name={field.name}
                      id={field.name}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-400">{field.label}</span>
                  </label>
                );
              }
              if (field.type === "array") {
                return (
                  <div key={index}>
                    <label className="block mb-1 text-gray-400">
                      {field.label}
                    </label>
                    <FieldArray
                      name={field.name}
                      render={(arrayHelpers) => (
                        <div className="flex flex-wrap justify-start items-center gap-x-3">
                          {field.allValues.map((tag) => {
                            let isChecked = values[field.name].includes(
                              tag.value
                            );
                            return (
                              <div
                                key={tag.value}
                                className="my-2 flex cursor-pointer items-center justify-start gap-1"
                              >
                                <label
                                  className="block flex items-center mb-1 cursor-pointer text-gray-300 text-sm"
                                  htmlFor={tag.label}
                                >
                                  <input
                                    id={tag.label}
                                    name={field.name}
                                    type="checkbox"
                                    value={tag}
                                    className="hidden"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        arrayHelpers.push(tag.value);
                                      } else {
                                        const idx = values[field.name].indexOf(
                                          tag.value
                                        );
                                        arrayHelpers.remove(idx);
                                      }
                                    }}
                                  />
                                  <span
                                    className={`w-4 h-4 flex items-center justify-center mr-2 rounded border ${
                                      isChecked
                                        ? "bg-secondary-500 border-secondary-500 text-primary-600"
                                        : "border-gray-400 text-secondary-500"
                                    }`}
                                  >
                                    <IoIosCheckmark className="w-3 h-3" />
                                  </span>

                                  {tag.label}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    />
                  </div>
                );
              }
              return (
                <Field
                  key={index}
                  {...field}
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  component={Component}
                />
              );
            })}
            <button
              className={`${
                btnClass ? btnClass : "w-full h-11"
              } bg-secondary-300 mt-4 rounded-md font-bold hover:bg-secondary-500`}
              type="submit"
            >
              {buttonText}
            </button>
          </Form>
        );
      }}
    ></Formik>
  );
};

export default CustomForm;
