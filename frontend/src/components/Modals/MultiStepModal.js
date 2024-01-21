import React, { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import CustomForm from "../forms/Form";
import { checkForSame, showToast, validateForm } from "../../utils/constants";
import MultiSelect from "../Select/MultiSelect";
const MultiStepModal = ({
  PopUpButton,
  HeaderText,
  steps,
  onSubmitForm,
  initialValues,
}) => {
  const [allFields, setAllFields] = useState(initialValues);
  const [stepIndex, setStepIndex] = useState(0);
  const [reachedIndex, setReachedIndex] = useState(0);
  const resetState = (close) => {
    setStepIndex(0);
    setAllFields(initialValues);
    setReachedIndex(0);
    close();
  };
  const onMultiSelectChange = (options, key) => {
    setAllFields((prev) => {
      return {
        ...prev,
        [key]: options.map((option) => {
          return {
            ...option,
            isSelected: true,
          };
        }),
      };
    });
  };
  const onRemoveItem = (option, key) => {
    setAllFields((prev) => {
      return {
        ...prev,
        [key]: prev[key].filter((opt) => opt.value != option.value),
      };
    });
  };
  return (
    <Popup
      trigger={PopUpButton}
      modal
      nested
      overlayStyle={{ backgroundColor: "rgba(0,0,0,0.2)" }}
    >
      {(close) => (
        <div className="modal bg-slate-900 text-white max-w-4xl">
          <div className="header px-5 py-3">
            <HeaderText />
          </div>
          <div className="content px-5 py-3 flex justify-between items-center gap-x-3">
            <div
              onClick={() => {
                setStepIndex((prev) => (prev === 0 ? 0 : prev - 1));
              }}
              className={`w-7 h-7 flex justify-center items-center ${
                stepIndex === 0 ? "disableEntity" : ""
              }`}
            >
              <button className="text-secondary-700">
                <GrCaretPrevious className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center items-center overflow-y-auto h-[30rem] w-[50rem] hide-scrollbar">
              {steps.map(
                (Step, index) =>
                  stepIndex === index && (
                    <>
                      {Step.isForm && (
                        <CustomForm
                          onSubmit={(values) => {
                            if (
                              !checkForSame(
                                values,
                                Step.initialValues,
                                allFields
                              )
                            ) {
                              if (reachedIndex >= steps.length - 1) {
                                resetState(close);
                                onSubmitForm({
                                  ...allFields,
                                  ...values,
                                });
                              } else {
                                setAllFields((prev) => {
                                  return {
                                    ...prev,
                                    ...values,
                                  };
                                });
                                setStepIndex((prev) => prev + 1);
                                setReachedIndex((prev) => prev + 1);
                              }
                            } else showToast("Nothing to Create", "info");
                          }}
                          key={index}
                          initialValues={allFields}
                          onRender={Step.onRender}
                          fields={Step.fields}
                          validate={(values) =>
                            validateForm(values, Step.initialValues)
                          }
                          btnClass="w-40 h-10"
                          validator={() => {}}
                          buttonText={
                            reachedIndex === steps.length - 1
                              ? "Submit"
                              : "Next"
                          }
                        />
                      )}
                      {Step.isMultiSelect && (
                        <MultiSelect
                          initialValues={allFields[Step.key]}
                          onChange={(options) =>
                            onMultiSelectChange(options, Step.key)
                          }
                          btnClass="w-40 h-10"
                          buttonText={
                            reachedIndex === steps.length - 1
                              ? "Submit"
                              : "Next"
                          }
                          onSubmit={(options) => {
                            if (!checkForSame(options, Step.initialValues)) {
                              if (reachedIndex >= steps.length - 1) {
                                resetState(close);
                                onSubmitForm({
                                  ...allFields,
                                  [Step.key]: [...options],
                                });
                              } else {
                                setAllFields((prev) => {
                                  return {
                                    ...prev,
                                    [Step.key]: [...options],
                                  };
                                });
                                setStepIndex((prev) => prev + 1);
                                setReachedIndex((prev) => prev + 1);
                              }
                            } else
                              showToast("Please Select " + Step.key, "info");
                          }}
                          onRemoveItem={onRemoveItem}
                          skipIfNull={Step.skipIfNull}
                          title={`Search ${Step.key}`}
                          key={index}
                          field={Step.key}
                          inputQuery={Step.inputQuery}
                          useOptionsQuery={Step.useOptionsQuery}
                          value={allFields[Step.key]}
                        />
                      )}
                    </>
                  )
              )}
            </div>
            <div
              onClick={() => {
                setStepIndex((prev) =>
                  prev == steps.length - 1 ? steps.length - 1 : prev + 1
                );
              }}
              className={`w-7 h-7 flex justify-center items-center ${
                stepIndex < reachedIndex ? "" : "disableEntity"
              }`}
            >
              <button className="text-secondary-700">
                <GrCaretNext className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="w-full flex items-center justify-center gap-x-2 mb-2">
            {steps.map((Step, index) => (
              <span
                key={index}
                className={`h-3 w-3 block rounded-full ${
                  reachedIndex >= index ? "bg-secondary-600" : "bg-gray-700"
                }`}
              ></span>
            ))}
          </div>
          <div className="actions px-5 py-3">
            <button
              className="button bg-secondary-500 hover:bg-secondary-700"
              onClick={() => {
                resetState(close);
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

export default MultiStepModal;
