import React, { useState } from "react";
import RoleCard from "./RoleCard";
const Roles = ({ roles }) => {
  const onEditBtnClick = () => {};
  const onDeleteHandler = () => {};
  const validateUpdate = () => {};
  return (
    <div className="flex bg-primary-700 w-full items-center justify-around flex-wrap gap-x-2 gap-y-5 mt-4">
      {roles && roles.length ? (
        roles.map((role) => (
          <RoleCard
            role={role}
            onDeleteHandler={onDeleteHandler}
            onEditBtnClick={onEditBtnClick}
            validateUpdate={validateUpdate}
          />
        ))
      ) : (
        <div className="h-full p-10 flex item-center justify-center">
          <h3>No Roles Found</h3>
        </div>
      )}
    </div>
  );
};

export default Roles;
