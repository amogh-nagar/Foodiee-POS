import React, { useState } from "react";
import RoleCard from "./RoleCard";
const Roles = () => {
  const onEditBtnClick = () => {};
  const onDeleteHandler = () => {};
  const validateUpdate = () => {};
  const breadcrumbItems = [
    { title: "Entity Type" },
    {
      title: "Entity",
      values: [
        {
          label: "Tenant",
          value: "Tenant",
        },
        {
          label: "Brand",
          value: "Brand",
        },
        {
          label: "Outlet",
          value: "Outlet",
        },
      ],
      type: "array",
    },
  ];
  return (
    <div className="flex items-center justify-around flex-wrap gap-x-2 gap-y-5 mt-4">
      <RoleCard
        role={{
          name: "Tenant Admin",
          description: "Tenant Admin",
          permissions: [
            "isCreateBrands",
            "isUpdateBrands",
            "isDeleteBrands",
            "isVisitBrandsPage",
            "isVisitBrandsPage",
            "isVisitBrandsPage",
            "isVisitBrandsPage",
          ],
        }}
        onDeleteHandler={onDeleteHandler}
        onEditBtnClick={onEditBtnClick}
        validateUpdate={validateUpdate}
      />
    </div>
  );
};

export default Roles;
