import { BsCashStack } from "react-icons/bs";
import { FaCcMastercard } from "react-icons/fa";
import { IoWalletOutline } from "react-icons/io5";
import {
  useGetAllBrandsSalesQuery,
  useGetAllOutletsSalesQuery,
  useGetAllTenantsSalesQuery,
  useGetBrandHourlySalesQuery,
  useGetDishSalesQuery,
  useGetOutletHourlySalesQuery,
  useGetTenantHourlySalesQuery,
  useGetTop3BrandsQuery,
  useGetTop3DishesQuery,
  useGetTop3OutletsQuery,
} from "../services/analysis";
import {
  useGetAllBrandsDetailsQuery,
  useGetAllOutletsDetailsQuery,
  useGetAllTenantsDetailsQuery,
} from "../services/dashboard";
import toast from "react-hot-toast";
export const currencyMap = {
  USD: "$",
  EUR: "€",
  JPY: "¥",
  GBP: "£",
  AUD: "A$",
  CAD: "C$",
  CHF: "CHF",
  CNY: "¥",
  SEK: "kr",
  NZD: "NZ$",
  MXN: "MX$",
  SGD: "S$",
  HKD: "HK$",
  NOK: "kr",
  KRW: "₩",
  TRY: "₺",
  RUB: "₽",
  INR: "₹",
  BRL: "R$",
  ZAR: "R",
};

export function truncate(input, length) {
  if (input.length > length) {
    return input.substring(0, length) + "...";
  }
  return input;
}

export const getRandomColors = function getRandomLightColor() {
  const red = Math.floor(Math.random() * 155) + 100;
  const green = Math.floor(Math.random() * 155) + 100;
  const blue = Math.floor(Math.random() * 155) + 100;
  const color = `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
  return color;
};

function stringToHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}

function hashToRGBA(hash, isDisabled) {
  const red = (hash & 0xff0000) >> 16;
  const green = (hash & 0x00ff00) >> 8;
  const blue = hash & 0x0000ff;
  const alpha = ((hash & 0xff) / 255).toFixed(2);

  return isDisabled
    ? "rgba(0,0,0,0.9)"
    : `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export const itemsPerPage = 20;

export const checkForSame = (objectToCompare, ObjectWithCompare, allFields) => {
  let isSame = true;
  if (Array.isArray(ObjectWithCompare)) {
    return objectToCompare.every((v, i) => v === ObjectWithCompare[i]);
  }
  Object.keys(ObjectWithCompare).forEach((key) => {
    if (
      allFields
        ? objectToCompare[key] != allFields[key]
        : objectToCompare[key] != ObjectWithCompare[key]
    )
      isSame = false;
  });
  return isSame;
};

export const getColor = function (img, name, isDisabled) {
  let styleObj = {};
  if (img && img.length > 0) {
    styleObj.backgroundImage =
      `linear-gradient(rgba(0,0,0,${isDisabled ? 0.9 : 0}), rgba(0,0,0,${
        isDisabled ? 0.9 : 0
      })), url(` +
      `https://${process.env.REACT_APP_AWS_BUCKET}.s3.ap-south-1.amazonaws.com/${img}` +
      ")";
    styleObj.backgroundSize = "cover";
    styleObj.color = "white";
    styleObj.backgroundPosition = "center";
  } else {
    const hash = stringToHash(name);
    const color1 = hashToRGBA(hash, isDisabled);
    const color2 = hashToRGBA(~hash, isDisabled);
    styleObj.backgroundImage = `linear-gradient(${color1}, ${color2})`;
  }
  return styleObj;
};

export const showToast = (message, type = "error") => {
  toast[type](message, {
    duration: 3000,
    position: "top-center",
    style: {},
    className: "",
    ariaProps: {
      role: "status",
      "aria-live": "polite",
    },
  });
};

export const permissionToRoleBasedAPIs = {
  isVisitAnalysisPage: {
    tenantAdmin: [useGetBrandHourlySalesQuery, useGetTop3BrandsQuery],
    brandAdmin: [
      useGetBrandHourlySalesQuery,
      useGetDishSalesQuery,
      useGetTop3DishesQuery,
      useGetTop3OutletsQuery,
    ],
    superAdmin: [useGetTenantHourlySalesQuery],
    outletAdmin: [
      useGetOutletHourlySalesQuery,
      useGetDishSalesQuery,
      useGetTop3DishesQuery,
    ],
  },
  isVisitDashboardPage: {
    tenantAdmin: [useGetAllBrandsDetailsQuery, useGetAllBrandsSalesQuery],
    brandAdmin: [useGetAllBrandsDetailsQuery, useGetAllBrandsSalesQuery],
    superAdmin: [useGetAllTenantsDetailsQuery, useGetAllTenantsSalesQuery],
    outletAdmin: [useGetAllOutletsDetailsQuery, useGetAllOutletsSalesQuery],
  },
};

var superAdminPermissions = [
  { label: "Create Tenants", value: "isCreateTenants" },
  { label: "Update Tenants", value: "isUpdateTenants" },
  { label: "Delete Tenants", value: "isDeleteTenants" },
  { label: "Visit Tenants Page", value: "isVisitTenantsPage" },
];

var commonPermissions = [
  { label: "Visit Users Page", value: "isVisitUsersPage" },
  { label: "Visit Roles Page", value: "isVisitRolesPage" },
  { label: "Create Users", value: "isCreateUsers" },
  { label: "Create Roles", value: "isCreateRoles" },
  { label: "Update Users", value: "isUpdateUsers" },
  { label: "Update Roles", value: "isUpdateRoles" },
  { label: "Delete Users", value: "isDeleteUsers" },
  { label: "Delete Roles", value: "isDeleteRoles" },
  { label: "Visit Analysis Page", value: "isVisitAnalysisPage" },
  { label: "Visit Dashboard Page", value: "isVisitDashboardPage" },
];

var tenantUserPermissions = [
  { label: "Create Brands", value: "isCreateBrands" },
  { label: "Update Brands", value: "isUpdateBrands" },
  { label: "Delete Brands", value: "isDeleteBrands" },
  { label: "Visit Brands Page", value: "isVisitBrandsPage" },
];

var brandUserPermissions = [
  { label: "Create Outlets", value: "isCreateOutlets" },
  { label: "Create Dishes", value: "isCreateDishes" },
  { label: "Create Taxes", value: "isCreateTax" },
  { label: "Update Outlets", value: "isUpdateOutlets" },
  { label: "Delete Outlets", value: "isDeleteOutlets" },
  { label: "Visit Outlets Page", value: "isVisitOutletsPage" },
  { label: "Update Dishes", value: "isUpdateDishes" },
  { label: "Delete Dishes", value: "isDeleteDishes" },
  { label: "Visit Dishes Page", value: "isVisitDishesPage" },
  { label: "Update Taxes", value: "isUpdateTax" },
  { label: "Delete Taxes", value: "isDeleteTax" },
  { label: "Visit Taxes Page", value: "isVisitTaxesPage" },
];

var outletUserPermissions = [
  { label: "Visit Billing Page", value: "isVisitBillingPage" },
];

export const rolesMappedToPermissions = {
  superAdmin: superAdminPermissions.concat(commonPermissions),
  tenantUser: tenantUserPermissions.concat(commonPermissions),
  brandUser: brandUserPermissions.concat(commonPermissions),
  outletUser: outletUserPermissions.concat(commonPermissions),
};

export const selectCustomStyle = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "rgba(31, 41, 55)",
    borderColor: "rgba(31, 41, 55)",
    outlineWidth: 0,
    outerHeight: 0,
    outerWidth: 0,
    cursor: "pointer",
    border: state.isFocused ? 0 : 0,
    boxShadow: state.isFocused ? 0 : 0,
    "&:hover": {
      border: state.isFocused ? 0 : 0,
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    height: "100%",
    cursor: "pointer",
    color: "white",
    paddingTop: "3px",
  }),
  menuList: (provided) => ({
    ...provided,
    backgroundColor: "rgba(31, 41, 55)",
  }),
  option: (styles, { isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor:
        (isSelected && "#e85f48") || (isFocused && "#673b34") || "#1f222e",
      color: "white",
      cursor: "pointer",
    };
  },
};

Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

export const validateForm = (values, initialValues) => {
  const errors = {};
  for (var key in initialValues) {
    if (!values[key]) {
      errors[key] = `${key.capitalize()} is required`;
    }
  }
  return errors;
};

export const checkoutMethods = [
  {
    name: "Cash",
    icon: <BsCashStack className="w-6 h-6" />,
  },
  {
    name: "Others",
    icon: <IoWalletOutline className="w-6 h-6" />,
  },
];
