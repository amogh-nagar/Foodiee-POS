import React, { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import RoleCard from "./RoleCard";
const tags = [
  {
    name: "Tenant Admin",
  },
  {
    name: "Tenant Analyst",
  },
];
const Roles = () => {
  const [activeTagIndex, setActiveTagIndex] = useState(null);
  const clickHandlerForTags = function () {};
  return (
    <div className="py-4 px-5 flex flex-wrap gap-x-4 gap-y-3">
      <div className="flex justify-end items-center w-full gap-4">
        <input
          className="bg-gray-600 w-2/3 text-white font-sans p-2 rounded-lg outline-none"
          placeholder="Search Roles"
        />
        <button className="flex items-center justify-between w-28 rounded-md hover:bg-secondary-600 bg-secondary-500 text-white px-3 py-2">
          <IoMdAdd />
          <p>New Role</p>
        </button>
      </div>
      <div className="w-full mb-4 px-4 mt-4 bg-primary-600 py-3 rounded-lg">
        <ul className="flex h-10 overflow-x-auto w-full hide-scrollbar">
          {tags.map((item, index) => {
            return (
              <li className="w-fit h-9 mr-4" key={index}>
                <button
                  onClick={() => {
                    setActiveTagIndex(index);
                    clickHandlerForTags();
                  }}
                  className={`font-sans px-2 w-fit h-10 rounded-lg ${
                    activeTagIndex === index
                      ? "border-b-secondary-500 bg-gray-600 text-secondary-400 border-b-2"
                      : "text-white"
                  }`}
                >
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex items-center justify-around flex-wrap gap-x-2 gap-y-5">
        <RoleCard />
        <RoleCard />
        <RoleCard />
        <RoleCard />
        <RoleCard />
        <RoleCard />
        <RoleCard />
      </div>
    </div>
  );
};

export default Roles;
