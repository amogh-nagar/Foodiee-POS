import React from "react";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import Modal from "../Modals/Modal";
import CustomForm from "../forms/Form";
import { checkForSame, showToast } from "../../utils/constants";
const RoleCard = ({
  role: { name, description, permissions },
  onEditBtnClick,
  onDeleteHandler,
  validateUpdate,
  allPermissions,
  ...args
}) => {
  const initialValues = {
    name,
    description,
    permissions,
  };
  return (
    <div className="h-52 w-96 rounded-md bg-primary-600 flex flex-col justify-between items-start">
      <div className="w-full">
        <div className="border-b-2 w-full flex items-center justify-between border-b-secondary-600 p-3">
          <h3>{name}</h3>
          <div className="flex items-center gap-2 text-secondary-200">
            <Modal
              PopUpButton={
                <button>
                  <MdOutlineEdit className="w-5 h-5" />
                </button>
              }
              isJSX={true}
              HeaderText={"Update Role"}
              BodyContent={
                <CustomForm
                  initialValues={initialValues}
                  onSubmit={(values) => {
                    if (!checkForSame(values, initialValues))
                      onEditBtnClick({
                        _id: args?._id,
                        entityId: args?.entityId,
                        ...values,
                      });
                    else showToast("Nothing to Update", "info");
                  }}
                  validate={validateUpdate}
                  btnClass="w-40 h-10"
                  validator={() => {}}
                  fields={[
                    {
                      type: "text",
                      name: "name",
                      label: "Name",
                      placeholder: "Brand Name",
                    },
                    {
                      type: "textarea",
                      name: "description",
                      label: "Description",
                      placeholder: "Brand Description",
                    },
                    {
                      type: "array",
                      name: "permissions",
                      value: permissions,
                    },
                  ]}
                  buttonText="Update"
                />
              }
            />

            <button onClick={() => onDeleteHandler(args?._id, args?.entityId)}>
              <MdDeleteOutline className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-3 font-mono truncate">
          <p className="truncate">{description}</p>
        </div>
        <div className="flex items-center flex-wrap gap-2 px-2 overflow-hidden h-24">
          {permissions?.slice(0, 4)?.map((permission) => {
            let value = allPermissions.find((ele) => ele.value === permission);
            return (
              <div key={permission} className="border-2 border-secondary-25 w-fit px-2 py-1 rounded-lg">
                <p className="truncate">{value?.label ?? ""}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoleCard;
