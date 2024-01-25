import React, { useState } from "react";
import RoleCard from "./RoleCard";
const Roles = ({ roles, allPermissions }) => {
  const onEditBtnClick = () => {};
  const onDeleteHandler = () => {};
  const validateUpdate = () => {};
  return (
    <div className="flex bg-primary-700 w-full items-center justify-start flex-wrap gap-5 mt-4 p-7 rounded-lg">
      {roles && roles.length ? (
        roles.map((role) => (
          <RoleCard
            key={role}
            role={role}
            onDeleteHandler={onDeleteHandler}
            onEditBtnClick={onEditBtnClick}
            validateUpdate={validateUpdate}
            allPermissions={allPermissions}
          />
        ))
      ) : (
        <div className="h-full w-full p-10 flex item-center justify-center">
          <h3>No Roles Found</h3>
        </div>
      )}
    </div>
  );
};

export default Roles;
