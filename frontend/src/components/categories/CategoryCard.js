import React from "react";
import { checkForSame, getColor, showToast } from "../../utils/constants";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import Modal from "../Modals/Modal";
const CategoryCard = ({ image, name, _id, description, onSubmit }) => {
  const initialValues = {
    name,
    description
  };
  let styleObj = getColor(image, name);
  return (
    <div className="w-full shadow-lg shadow-primary-700 flex items-center gap-x-6 bg-primary-200 hover:bg-secondary-light cursor-pointer p-3 rounded-md">
      <div style={styleObj} className="h-12 w-12 rounded-full"></div>
      <div className="flex w-full items-center justify-between gap-x-5">
        <p>{name}</p>
        <div className="flex items-center gap-x-1 text-secondary-200">
          <Modal
            PopUpButton={
              <button className="outline-none">
                <MdOutlineEdit className="w-6 h-6" />
              </button>
            }
            isForm={true}
            HeaderText={() => "Update Category"}
            initialValues={initialValues}
            onSubmit={(values) => {
              if (!checkForSame(values, initialValues)) {
                onSubmit({
                  ...values,
                  categoryId: _id,
                });
              } else showToast("Nothing to Update", "info");
            }}
            fields={[
              {
                type: "text",
                name: "name",
                label: "Name",
                placeholder: "Category Name",
              },
              {
                type: "textarea",
                name: "description",
                label: "Description",
                placeholder: "Category Description",
              },
              {
                type: "file",
                name: "image",
                label: "Image",
                placeholder: "Category Image",
              },
            ]}
            buttonText="Update"
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
