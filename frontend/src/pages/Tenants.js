import React, { useState } from "react";
import PageNameWithDate from "../components/PageNameWithDate";
import { IoMdAdd } from "react-icons/io";
import EntityCard from "../components/Entity/EntityCard";
import CustomMasonry from "../components/Wrappers/Masonry";
import FlexDiv from "../components/Wrappers/FlexDiv";
import Modal from "../components/Modals/Modal";
import CustomForm from "../components/forms/Form";
const Tenants = () => {
  const initialValues = {
    name: "",
    description: "",
  };
  const onSubmit = async (values) => {};
  const validate = (values) => {
    const errors = {};

    if (!values.name || !values.name.length) {
      errors.name = "Name is required";
    }
    if (!values.description || !values.description.length) {
      errors.description = "Description is required";
    }

    return errors;
  };
  return (
    <div>
      <PageNameWithDate
        name="Tenants"
      />
      <div>
        <div className=" items-center gap-x-3 mx-3 my-5 flex h-fit">
          <input
            className="bg-gray-600 text-white font-sans p-2 rounded-lg outline-none w-[80%]"
            placeholder="Search Tenants"
          />
          <Modal
            PopUpButton={
              <button className="flex gap-x-1 items-center bg-secondary-500 p-3 rounded-lg">
                <IoMdAdd />
                <p>Tenant</p>
              </button>
            }
            isJSX={true}
            HeaderText={() => <h3>Add New Tenant</h3>}
            BodyContent={
              <CustomForm
                initialValues={initialValues}
                onSubmit={onSubmit}
                validate={validate}
                btnClass="w-40 h-10"
                validator={() => {}}
                fields={[
                  {
                    type: "text",
                    name: "name",
                    label: "Name",
                    placeholder: "Tenant Name",
                  },
                  {
                    type: "textarea",
                    name: "description",
                    label: "Description",
                    placeholder: "Tenant Description",
                  },
                  {
                    type: "imageupload",
                    name: "image",
                    label: "Image",
                    placeholder: "Tenant Image",
                  },
                ]}
                buttonText="Create"
                isTrusted={true}
              />
            }
          />
        </div>
        <div className="mx-3">
          <FlexDiv
            className="gap-y-4"
            Component={EntityCard}
            items={[
              {
                name: "Subway",
                description: "Subway India",
                img: "https://cdn.pixabay.com/photo/2017/12/10/14/47/pizza-3010062_1280.jpg",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Tenants;
