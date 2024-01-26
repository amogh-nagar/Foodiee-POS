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
const Users = () => {
  const [activeTab, setActiveTab] = useState("Users");
  const [accessibleEntities, setAccessibleEntities] = useState([]);
  const [activeEntity, setActiveEntity] = useState("");
  const [activeEntityItem, setActiveEntityItem] = useState("");
  const [getTenants, { data: tenants, isLoadingTenants, isErrorTenants }] =
    useLazyGetAllTenantsQuery();
  const [
    createRole,
    { isLoading: isCreateRoleLoading, isError: isCreateRoleError },
  ] = useCreateRoleMutation();
  const [
    createUser,
    { isLoading: isCreateUserLoading, isError: isCreateUserError },
  ] = useCreateUserMutation();
  const [getBrands, { data: brands, isLoadingBrands, isErrorBrands }] =
    useLazyGetAllBrandsQuery();
  const [getOutlets, { data: outlets, isLoadingOutlets, isErrorOutlets }] =
    useLazyGetAllOutletsQuery();
  const {
    data: users,
    isLoadingUsers,
    isErrorUsers
  } = useGetUsersQuery(
    {
      entityIds: activeEntityItem,
      page: 1,
    },
    {
      skip: !activeEntityItem || activeTab !== "Users",
    }
  );
  const {
    data: roles,
    isLoadingRoles,
    isErrorRoles
  } = useGetAllRolesQuery(
    {
      entityId: activeEntityItem,
      page: 1,
    },
    {
      skip: !activeEntityItem || activeTab !== "Roles",
    }
  );
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
    if (auth.isSuperAdmin || auth.tenantIds) {
      newEntityArr.push({
        label: "Tenant",
        value: "Tenant",
      });
    }
    if (auth.brandIds) {
      newEntityArr.push({
        label: "Brand",
        value: "Brand",
      });
    }
    if (auth.outletIds) {
      newEntityArr.push({
        label: "Outlet",
        value: "Outlet",
      });
    }
    setAccessibleEntities(newEntityArr);
  }, [auth.entityDetails]);
  let permissionAvailableForUserCreation =
    (auth.isSuperAdmin && rolesMappedToPermissions.superAdmin) ||
    (auth.tenantIds && rolesMappedToPermissions.tenantUser) ||
    (auth.brandIds && rolesMappedToPermissions.brandUser) ||
    (auth.outletIds && rolesMappedToPermissions.outletUser) || [];
  const breadcrumbItems = [
    { title: "Entity Type" },
    {
      title: "Entity",
      values: accessibleEntities,
      type: "array",
      onChange: (value) => {
        setActiveEntity(value.value);
        setActiveEntityItem("");
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
  const addUser = async (values) => {};
  const addRole = async (values) => {
    try {
      let payload = {
        ...values,
        entityId: activeEntityItem
      }
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
          entityId: activeEntityItem,
          getAll: true,
        },
        initialValues: [],
        key: "roles",
        skipIfNull: activeEntityItem,
      },
    ];
  } else {
    initialValues = {
      name: "",
      description: "",
      permissions: [],
    };
    Component = Modal;
    attributes["isJSX"] = true;
    attributes["BodyContent"] = (
      <CustomForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        validate={(values) => validateForm(values, initialValues)}
        btnClass="w-40 h-10"
        validator={() => {}}
        fields={[
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
        ]}
        buttonText="Create"
      />
    );
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
                <div>
                  <Breadcrumbs options={breadcrumbItems} />
                </div>
                <div className="flex justify-end items-center gap-4">
                  <input
                    className="bg-gray-600 w-2/3 text-white font-sans p-2 rounded-lg outline-none"
                    placeholder={`Search ${displayUser ? "User" : "Role"}`}
                  />
                  {activeEntityItem ? (
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
                <User entityId={activeEntityItem} users={users?.users ?? []} />
              ) : (
                <Roles entityId={activeEntityItem} allPermissions={permissionAvailableForUserCreation} roles={roles?.roles ?? []} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
