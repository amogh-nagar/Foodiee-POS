import React from "react";
import { getColor } from "../../utils/constants";
import ActiveBtn from "../Buttons/ActiveBtn";
import InActiveBtn from "../Buttons/InActiveBtn";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
const UserCard = ({ user }) => {
  let img = user.img,
    name = user.name,
    email = user.email,
    mobile = user.mobile,
    status = user.isActive;
  let styleObj;
  if (img && img.length) styleObj = getColor(img, name);
  return (
    <tr className="">
      <td className="py-3">
        <div className="flex items-center justify-center">
          {img && img.length ? (
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
          <button>
            <MdOutlineEdit className="w-6 h-6" />
          </button>
          <button>
            <MdDeleteOutline className="w-6 h-6" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserCard;
