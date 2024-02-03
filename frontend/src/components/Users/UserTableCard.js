import React from "react";
import { checkForSame, getColor, showToast } from "../../utils/constants";
import ActiveBtn from "../Buttons/ActiveBtn";
import InActiveBtn from "../Buttons/InActiveBtn";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import MultiStepModal from "../Modals/MultiStepModal";
import { useGetAllRolesQuery } from "../../services/role";
const UserCard = ({ user, entityId, onEditBtnClick }) => {
  let image = user.image,
    name = user.name,
    email = user.email,
    mobile = user.mobile,
    status = user.isActive,
    roles = user.roles;
  let styleObj;
  if (image && image.length) styleObj = getColor(image, name);
  const newRoles = roles.map((role) => {
    return {
      value: role.roleId,
      label: role.roleName,
      isSelected: true
    };
  })
  let initialValues = {
    name: name,
    email: email,
    mobile: mobile,
    roles: newRoles,
    permissions: [],
    image: image,
  };
  return (
    <tr className="">
      <td className="py-3">
        <div className="flex items-center justify-center">
          {image && image.length ? (
            <div
              className="w-12 h-12 rounded-full bg-secondary-500"
              style={styleObj}
            ></div>
          ) : (
            <FaUserAlt />
          )}
        </div>
      </td>
      <td className="py-3">
        <div className="flex items-center justify-center">
          <p>{name}</p>
        </div>
      </td>
      <td className="py-3">
        <div className="flex items-center justify-center">
          <p>{email}</p>
        </div>
      </td>
      <td className="py-3">
        <div className="flex items-center justify-center">
          <p>{mobile}</p>
        </div>
      </td>
      <td className="py-3">
        <div className="flex items-center justify-center">
          {status ? <ActiveBtn /> : <InActiveBtn />}
        </div>
      </td>
      <td className="py-3">
        <div className="flex items-center justify-center gap-3 text-secondary-200">
          <MultiStepModal
            steps={[
              {
                isForm: true,
                initialValues: {
                  name,
                  email,
                  mobile,
                },
                fields: [
                  {
                    type: "text",
                    name: "name",
                    label: "Name",
                    placeholder: "User Name",
                  },
                  {
                    type: "email",
                    name: "email",
                    label: "Email",
                    placeholder: "User Email",
                  },
                  {
                    type: "mobile",
                    name: "mobile",
                    label: "Mobile",
                    placeholder: "User Mobile",
                  },
                ],
              },
              {
                isMultiSelect: true,
                customFields: { permissions: 1 },
                useOptionsQuery: useGetAllRolesQuery,
                inputQuery: {
                  entityId: entityId,
                  page: 1,
                },
                initialValues: newRoles,
                key: "roles",
                skipIfNull: entityId,
              },
            ]}
            initialValues={initialValues}
            HeaderText={() => "Update User"}
            onSubmitForm={(values) => {
              if (!checkForSame(values, initialValues))
                onEditBtnClick({
                  userId: user._id,
                  entityId,
                  ...values,
                });
              else showToast("Nothing to Update", "info");
            }}
            PopUpButton={
              <button className="outline-none">
                <MdOutlineEdit className="w-6 h-6" />
              </button>
            }
          />

          <button>
            <MdDeleteOutline className="w-6 h-6" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserCard;
