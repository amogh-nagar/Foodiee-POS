import React, { useEffect, useState } from "react";
import PageNameWithDate from "../components/PageNameWithDate";
import Roles from "../components/Roles/Roles";
import User from "../components/Users/Users";
import { IoMdAdd } from "react-icons/io";
import Breadcrumbs from "../components/Wrappers/BreadCrmbs";
import { useSelector } from "react-redux";
import { useLazyGetAllTenantsQuery } from "../services/tenant";
import { useLazyGetAllBrandsQuery } from "../services/brand";
import { useLazyGetAllOutletsQuery } from "../services/outlet";
import { useLazyGetUsersQuery } from "../services/user";
import { useLazyGetAllRolesQuery } from "../services/role";
import Loader from "../UI/Loaders/Loader";
const Users = () => {
  const [activeTab, setActiveTab] = useState("Users");
  const [entityArr, setEntityArr] = useState([]);
  const [activeEntity, setActiveEntity] = useState("");
  const [activeEntityItem, setActiveEntityItem] = useState("");
  const [getTenants, { data: tenants, isLoadingTenants, isErrorTenants }] =
    useLazyGetAllTenantsQuery();
  const [getBrands, { data: brands, isLoadingBrands, isErrorBrands }] =
    useLazyGetAllBrandsQuery();
  const [getOutlets, { data: outlets, isLoadingOutlets, isErrorOutlets }] =
    useLazyGetAllOutletsQuery();
  const [getUsers, { data: users, isLoadingUsers, isErrorUsers }] =
    useLazyGetUsersQuery();
  const [getRoles, { data: roles, isLoadingRoles, isErrorRoles }] =
    useLazyGetAllRolesQuery();
  const isLoadingEntity =
    isLoadingBrands ||
    isLoadingOutlets ||
    isLoadingTenants ||
    isLoadingUsers ||
    isLoadingRoles;
  let entities = [];
  if (activeEntity == "Tenant") entities = tenants?.tenants || [];
  if (activeEntity == "Brand") entities = brands?.brands || [];
  if (activeEntity == "Outlet") entities = outlets?.outlets || [];
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    const newEntityArr = [];
    if (auth.permissions.includes("isVisitTenantsPage")) {
      newEntityArr.push({
        label: "Tenant",
        value: "Tenant",
      });
    }

    if (auth.permissions.includes("isVisitBrandsPage")) {
      newEntityArr.push({
        label: "Brand",
        value: "Brand",
      });
    }

    if (auth.permissions.includes("isVisitOutletsPage")) {
      newEntityArr.push({
        label: "Outlet",
        value: "Outlet",
      });
    }
    setEntityArr(newEntityArr);
  }, [auth.entityDetails]);
  const breadcrumbItems = [
    { title: "Entity Type" },
    {
      title: "Entity",
      values: entityArr,
      type: "array",
      onChange: (value) => {
        setActiveEntity(value.value);
        let query = {
          notIncludeTotal: true,
          getAll: true,
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
  let displayUser = activeTab === "Users";
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
        setActiveEntityItem(value.value);
      },
    });
  }
  useEffect(() => {
    if (!activeEntityItem) return;
    let query = {
      entityIds: [activeEntityItem],
      page: 1,
    };
    activeTab === "Users" ? getUsers(query) : getRoles(query);
  }, [activeEntityItem, activeTab]);
  return (
    <div>
      <PageNameWithDate name="Users" />
      <div className="w-full mb-4 px-4 mt-4">
        <ul className="flex h-10 w-full py-2 px-5 bg-primary-700 rounded-2xl">
          <li
            onClick={() => setActiveTab("Users")}
            className="w-[40px] h-9 mr-4 cursor-pointer"
          >
            <p
              className={`${displayUser ? "active-dish-btn" : "text-gray-300"}`}
            >
              Users
            </p>
          </li>
          <li
            onClick={() => setActiveTab("Roles")}
            className="w-[40px] h-9 mr-4 cursor-pointer"
          >
            <p
              className={`${
                !displayUser ? "active-dish-btn" : "text-gray-300"
              }`}
            >
              Roles
            </p>
          </li>
        </ul>
        <div className="py-4 px-5 flex flex-wrap gap-x-4 gap-y-3">
          {isLoadingEntity ? (
            <Loader />
          ) : (
            <>
              <div className="flex justify-between items-center w-full gap-4">
                <div>
                  <Breadcrumbs options={breadcrumbItems} />
                </div>
                <div className="flex justify-end items-center gap-4">
                  <input
                    className="bg-gray-600 w-2/3 text-white font-sans p-2 rounded-lg outline-none"
                    placeholder={`Search ${displayUser ? "User" : "Role"}`}
                  />
                  <button className="flex items-center justify-between w-28 rounded-md hover:bg-secondary-600 bg-secondary-500 text-white px-3 py-2">
                    <IoMdAdd />
                    <p>Add {displayUser ? "User" : "Role"}</p>
                  </button>
                </div>
              </div>
              {displayUser ? (
                <User users={users?.users ?? []} />
              ) : (
                <Roles roles={roles?.roles ?? []} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
