import React from "react";
import "./EntityCard.css";
import { checkForSame, getColor, showToast } from "../../utils/constants";
import { Link } from "react-router-dom";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import CustomForm from "../forms/Form";
import Modal from "../Modals/Modal";
const EntityCard = React.forwardRef(
  (
    {
      image,
      name,
      isActive,
      description,
      onEditBtnClick,
      address,
      validateUpdate,
      updateFields,
      updateHeaderText,
      entityIdType,
      cardOnClickURL,
      showEditBtn = false,
      ...args
    },
    ref
  ) => {
    let styleObj = getColor(image, name, !isActive);
    let initialValues = {
      name: name,
      image: image
        ? `https://${process.env.REACT_APP_AWS_BUCKET}.s3.ap-south-1.amazonaws.com/${image}`
        : "",
      isActive: isActive,
    };
    if (description) initialValues.description = description;
    if (address) initialValues.address = address;
    return (
      <div
        ref={ref}
        style={styleObj}
        className={`h-72 max-h-96 w-56 rounded-lg flex items-end flex-col ${
          isActive && "cursor-pointer"
        }`}
      >
        {showEditBtn && (
          <>
            <div className="flex py-1 px-2 items-center justify-end gap-x-3 text-slate-100">
              <Modal
                PopUpButton={
                  <button>
                    <MdOutlineEdit className="w-6 h-6" />
                  </button>
                }
                isJSX={true}
                HeaderText={updateHeaderText}
                BodyContent={
                  <CustomForm
                    initialValues={initialValues}
                    onSubmit={(values) => {
                      if (!checkForSame(values, initialValues))
                        onEditBtnClick({ entityId: args?._id, ...values });
                      else showToast("Nothing to Update", "info");
                    }}
                    validate={validateUpdate}
                    btnClass="w-40 h-10"
                    validator={() => {}}
                    fields={updateFields}
                    buttonText="Update"
                  />
                }
              />
            </div>
          </>
        )}
        <div
          className={`${isActive ? "cursor-pointer" : "pointer-events-none"}`}
        >
          <Link
            onClick={(e) => {
              if (!cardOnClickURL) e.preventDefault();
            }}
            to={{
              pathname: cardOnClickURL,
              state: {
                selectedEntity: {
                  _id: args?._id,
                  name: name,
                  entityId: args[entityIdType],
                },
              },
            }}
          >
            <div className={`h-64 max-h-96 w-56 rounded-lg flex items-end `}>
              <div className="inner-div rounded-lg before:rounded-lg w-full h-32 max-h-80 px-2 py-3">
                <h4 className="text-xl">{name}</h4>
                <p className="text-md">{description}</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  }
);

export default EntityCard;
