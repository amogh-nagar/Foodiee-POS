import React from "react";
import { IoMdAdd } from "react-icons/io";
import UserCard from "./UserTableCard";
const User = () => {
  return (
    <div className="py-4 px-5 flex flex-wrap gap-x-4 gap-y-3">
      <div className="flex justify-end items-center w-full gap-4">
          <input
            className="bg-gray-600 w-2/3 text-white font-sans p-2 rounded-lg outline-none"
            placeholder="Search Users"
          />
        <button className="flex items-center justify-between w-28 rounded-md hover:bg-secondary-600 bg-secondary-500 text-white px-3 py-2">
          <IoMdAdd />
          <p>Add User</p>
        </button>
      </div>
      <div className="w-full mt-3 bg-primary-700 rounded-md">
        <table className="w-full">
          <thead className="border-b-2 border-secondary-600">
            <tr>
              <th className="py-4">Photo</th>
              <th className="py-4">User Name</th>
              <th className="py-4">Email</th>
              <th className="py-4">Mobile</th>
              <th className="py-4">Status</th>
              <th className="py-4">Operations</th>
            </tr>
          </thead>
          <tbody className="">
            <UserCard/>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
