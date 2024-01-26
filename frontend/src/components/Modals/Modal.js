import React from "react";
import Popup from "reactjs-popup";
import CustomForm from "../forms/Form";
import { checkForSame, showToast, validateForm } from "../../utils/constants";
const Modal = ({
  PopUpButton,
  HeaderText,
  fields,
  isForm,
  initialValues,
  onSubmit,
  validate,
  buttonText,
}) => {
  const validateFunc =
    validate ?? ((values) => validateForm(values, initialValues));
  return (
    <Popup
      trigger={PopUpButton}
      modal
      nested
      overlayStyle={{ backgroundColor: "rgba(0,0,0,0.2)" }}
    >
      {(close) => (
        <div className="modal bg-slate-900 text-white w-full">
          <div className="header px-5 py-3">
            <HeaderText />
          </div>
          <div className="content px-5 py-3 flex justify-center items-center overflow-y-auto h-[30rem] w-[55vw] hide-scrollbar">
            {isForm && (
              <CustomForm
                initialValues={initialValues}
                onSubmit={(values) => {
                  if (!checkForSame(values, initialValues)) {
                    onSubmit(values);
                    close();
                  } else showToast("Nothing to Update", "info");
                }}
                validate={validateFunc}
                btnClass="w-40 h-10"
                validator={() => {}}
                fields={fields}
                buttonText={buttonText}
              />
            )}
          </div>
          <div className="actions px-5 py-3">
            <button
              className="button w-14 h-8 bg-secondary-500 hover:bg-secondary-700"
              onClick={() => {
                close();
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default Modal;
