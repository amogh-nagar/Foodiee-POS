import React, { useEffect, useState } from "react";
import { useLazyGetAllTenantsQuery } from "../../../services/tenant";
import { useLazyGetAllBrandsQuery } from "../../../services/brand";
import { useLazyGetAllOutletsQuery } from "../../../services/outlet";
import { useSelector } from "react-redux";
import EntityBreadCrumbsWrapper from "./EntityBreadCrumbsWrapper";
import useRTKMutation from "../../../hooks/useRTKMutation";

const EntityBreadCrumbs = ({ setEntity }) => {
  const auth = useSelector((state) => state.auth);
  const { trigger: getTenants, data: tenants } = useRTKMutation(
    useLazyGetAllTenantsQuery
  );
  const { trigger: getBrands, data: brands } = useRTKMutation(
    useLazyGetAllBrandsQuery
  );
  const { trigger: getOutlets, data: outlets } = useRTKMutation(
    useLazyGetAllTenantsQuery
  );
  const accessibleEntities = auth.accessibleEntities;
  const [activeEntity, setActiveEntity] = useState("");
  let entities = [];
  if (activeEntity == "Tenant") entities = tenants?.tenants || [];
  if (activeEntity == "Brand") entities = brands?.brands || [];
  if (activeEntity == "Outlet") entities = outlets?.outlets || [];
  const breadcrumbItems = [
    { title: "Entity Type" },
    {
      title: "Entity",
      values: accessibleEntities,
      type: "array",
      onChange: (value) => {
        setActiveEntity(value.value);
        let query = {
          notIncludeTotal: true,
          page: 1,
          name: "",
        };
        if (auth.tenantIds) {
          query["tenantIds"] = auth.tenantIds;
        }
        if (auth.brandIds) {
          query["brandIds"] = auth.brandIds;
        }
        if (auth.outletIds) {
          query["outletIds"] = auth.outletIds;
        }
        if (value.value === "Tenant") {
          getTenants(query);
        }
        if (value.value === "Brand") {
          getBrands(query);
        }
        if (value.value === "Outlet") {
          getOutlets(query);
        }
      },
    },
  ];
  if (entities && entities.length > 0) {
    breadcrumbItems.push({
      title: `Select ${activeEntity}`,
      values: entities.map((entity) => {
        return {
          label: entity.name,
          value: entity._id,
        };
      }),
      type: "array",
      onChange: (value) => {
        setEntity({
          value: value.value,
          label: activeEntity,
        });
      },
    });
  }
  return (
    <div>
      <EntityBreadCrumbsWrapper options={breadcrumbItems} />
    </div>
  );
};

export default EntityBreadCrumbs;
