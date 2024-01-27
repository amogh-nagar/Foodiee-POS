import React from "react";
import { checkForSame, getColor, showToast } from "../../utils/constants";
import { FaAngleRight } from "react-icons/fa";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import Modal from "../Modals/Modal";
const SuperCategoryCard = ({ image, name, description, _id, onSubmit, onClick }) => {
  let styleObj = getColor(image, name);
  const initialValues = {
    name,
    description,
  };
  return (
    <div className="w-full shadow-lg shadow-primary-700 flex items-center gap-x-6 bg-primary-300 hover:bg-secondary-light cursor-pointer p-3 rounded-md">
      <div
        onClick={onClick}
        style={styleObj}
        className="h-12 w-12 rounded-full"
      ></div>
      <div className="w-[77%] h-full flex justify-between items-center">
        <div className="flex items-center justify-center gap-x-5">
          <p>{name}</p>
          <div className="flex items-center gap-x-1 text-secondary-200">
            <Modal
              PopUpButton={
                <button className="outline-none">
                  <MdOutlineEdit className="w-5 h-5" />
                </button>
              }
              isForm={true}
              HeaderText={() => "Update Super Category"}
              initialValues={initialValues}
              onSubmit={(values) => {
                if (!checkForSame(values, initialValues)) {
                  onSubmit({
                    ...values,
                    superCategoryId: _id,
                  });
                } else showToast("Nothing to Update", "info");
              }}
              fields={[
                {
                  type: "text",
                  name: "name",
                  label: "Name",
                  placeholder: "Super Category Name",
                },
                {
                  type: "textarea",
                  name: "description",
                  label: "Description",
                  placeholder: "Super Category Description",
                },
                {
                  type: "file",
                  name: "image",
                  label: "Image",
                  placeholder: "Super Category Image",
                },
              ]}
              buttonText="Update"
            />
          </div>
        </div>
        <div onClick={onClick} className="h-full flex items-center">
          <FaAngleRight />
        </div>
      </div>
    </div>
  );
};

export default SuperCategoryCard;
