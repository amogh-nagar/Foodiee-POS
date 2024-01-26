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
import { useGetUsersQuery, useCreateUserMutation } from "../services/user";
import { useGetAllRolesQuery, useCreateRoleMutation } from "../services/role";
import Loader from "../UI/Loaders/Loader";
import CustomForm from "../components/forms/Form";
import Modal from "../components/Modals/Modal";
import {
  checkForSame,
  rolesMappedToPermissions,
  showToast,
  validateForm,
} from "../utils/constants";
import MultiStepModal from "../components/Modals/MultiStepModal";
import EntityBreadCrumbs from "../components/Containers/EntityBreadCrumbs";
const Users = () => {
  const [activeTab, setActiveTab] = useState("Users");
  const [activeEntityItem, setActiveEntityItem] = useState("");
  const [
    createRole,
    { isLoading: isCreateRoleLoading, isError: isCreateRoleError },
  ] = useCreateRoleMutation();
  const [
    createUser,
    { isLoading: isCreateUserLoading, isError: isCreateUserError },
  ] = useCreateUserMutation();

  const {
    data: users,
    isLoadingUsers,
    isErrorUsers,
  } = useGetUsersQuery(
    {
      entityIds: activeEntityItem.value,
      page: 1,
    },
    {
      skip: !activeEntityItem.value || activeTab !== "Users",
    }
  );
  const {
    data: roles,
    isLoadingRoles,
    isErrorRoles,
  } = useGetAllRolesQuery(
    {
      entityId: activeEntityItem.value,
      page: 1,
    },
    {
      skip: !activeEntityItem.value || activeTab !== "Roles",
    }
  );
  const isLoadingEntity = isLoadingUsers || isLoadingRoles;

  const auth = useSelector((state) => state.auth);
  let permissionAvailableForUserCreation =
    (activeEntityItem.label === "Tenant" &&
      (auth.isSuperAdmin
        ? Array.from(
            new Set(
              rolesMappedToPermissions.superAdmin.concat(
                rolesMappedToPermissions.tenantUser
              )
            )
          )
        : rolesMappedToPermissions.tenantUser)) ||
    (activeEntityItem.label === "Brand" &&
      rolesMappedToPermissions.brandUser) ||
    (activeEntityItem.label === "Outlet" &&
      rolesMappedToPermissions.outletUser) ||
    [];
  let displayUser = activeTab === "Users";
  const addUser = async (values) => {};
  const addRole = async (values) => {
    try {
      let payload = {
        ...values,
        entityId: activeEntityItem.value,
      };
      await createRole(payload);
      showToast("Role Created Succesfully", "success");
    } catch (err) {
      showToast(err?.data?.message || "Some error occurred!");
    }
  };
  const onSubmit = (values) => {
    displayUser ? addUser(values) : addRole(values);
  };
  let initialValues = {},
    attributes = {
      PopUpButton: (
        <button className="flex items-center justify-between w-28 rounded-md hover:bg-secondary-600 bg-secondary-500 text-white px-3 py-2">
          <IoMdAdd />
          <p>Add {displayUser ? "User" : "Role"}</p>
        </button>
      ),
      HeaderText: () => `Create ${displayUser ? "User" : "Role"}`,
    },
    Component = Modal;
  if (displayUser) {
    initialValues = {
      name: "",
      email: "",
      mobile: "",
      roles: [],
      permissions: [],
      image: "",
    };
    Component = MultiStepModal;
    attributes["initialValues"] = initialValues;
    attributes["onSubmitForm"] = onSubmit;
    attributes["steps"] = [
      {
        isForm: true,
        initialValues: {
          name: "",
          email: "",
          mobile: "",
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
            type: "number",
            name: "mobile",
            label: "Mobile",
            placeholder: "User Mobile",
          },
        ],
      },
      {
        isMultiSelect: true,
        useOptionsQuery: useGetAllRolesQuery,
        inputQuery: {
          entityId: activeEntityItem.value,
          getAll: true,
        },
        initialValues: [],
        key: "roles",
        skipIfNull: activeEntityItem.value,
      },
    ];
  } else {
    initialValues = {
      name: "",
      description: "",
      permissions: [],
    };
    Component = Modal;
    attributes["fields"] = [
      {
        type: "text",
        name: "name",
        label: "Name",
        placeholder: "Role Name",
      },
      {
        type: "textarea",
        name: "description",
        label: "Description",
        placeholder: "Role Description",
      },
      {
        type: "array",
        name: "permissions",
        label: "Permissions",
        allValues: permissionAvailableForUserCreation.map((permission) => {
          return {
            label: permission.label,
            value: permission.value,
          };
        }),
      },
    ];
    attributes.initialValues = initialValues;
    attributes.onSubmit = onSubmit;
    attributes.buttonText = "Create";
    attributes["isForm"] = true;
  }
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
                <EntityBreadCrumbs setEntity={setActiveEntityItem} />
                <div className="flex justify-end items-center gap-4">
                  <input
                    className="bg-gray-600 w-2/3 text-white font-sans p-2 rounded-lg outline-none"
                    placeholder={`Search ${displayUser ? "User" : "Role"}`}
                  />
                  {activeEntityItem.value ? (
                    <Component {...attributes} />
                  ) : (
                    <button
                      disabled
                      className="flex items-center justify-between w-28 rounded-md opacity-50 bg-secondary-500 text-white px-3 py-2"
                    >
                      <IoMdAdd />
                      <p>Add {displayUser ? "User" : "Role"}</p>
                    </button>
                  )}
                </div>
              </div>
              {displayUser ? (
                <User
                  entityId={activeEntityItem.value}
                  users={users?.users ?? []}
                />
              ) : (
                <Roles
                  entityId={activeEntityItem.value}
                  allPermissions={permissionAvailableForUserCreation}
                  roles={roles?.roles ?? []}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
