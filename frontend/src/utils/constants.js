import { toast } from "react-toastify";
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
import { useReloginMutation } from "../services/auth";
import {
  useGetAllBrandsDetailsQuery,
  useGetAllOutletsDetailsQuery,
  useGetAllTenantsDetailsQuery,
} from "../services/dashboard";
import { login, logout } from "../store/authSlice";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

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

export const checkForSame = (objectToCompare, ObjectWithCompare) => {
  let isSame = true;
  Object.keys(ObjectWithCompare).forEach((key) => {
    if (objectToCompare[key] != ObjectWithCompare[key]) isSame = false;
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
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
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
  isVisitUsersPage: {
    tenantAdmin: [],
    brandAdmin: [],
    superAdmin: [],
    outletAdmin: [],
  },
  isVisitTenantsPage: {
    superAdmin: [],
  },
  isVisitOutletsPage: {
    brandAdmin: [],
  },
  isVisitDishesPage: {
    brandAdmin: [],
  },
  isVisitBrandsPage: {
    tenantAdmin: [],
  },
};

export const permissionOnlyAPIS = {
  isVisitBillingPage: [],
};

var superAdminPermissions = [
  "isCreateTenants",
  "isUpdateTenants",
  "isDeleteTenants",
  "isVisitTenantsPage",
  "isCreatedUser",
  "isUpdateUser",
];

var commonPermissions = [
  "isVisitUsersPage",
  "isVisitAnalysisPage",
  "isVisitDashboardPage",
  "isViewProfile",
];

var tenantAdminPermissions = [
  "isCreateBrands",
  "isUpdateBrands",
  "isDeleteBrands",
  "isVisitBrandsPage",
  "isCreatedUser",
  "isUpdateUser",
];

var brandAdminPermissions = [
  "isCreateOutlets",
  "isCreateDishes",
  "isCreateTax",
  "isUpdateOutlets",
  "isDeleteOutlets",
  "isVisitOutletsPage",
  "isUpdateDishes",
  "isDeleteDishes",
  "isVisitDishesPage",
  "isUpdateTax",
  "isDeleteTax",
  "isVisitTaxesPage",
  "isCreatedUser",
  "isUpdateUser",
];

var outletAdminPermissions = [
  "isVisitBillingPage",
  "isCreatedUser",
  "isUpdateUser",
];

export const rolesMappedToPermissions = {
  superAdmin: superAdminPermissions.concat(commonPermissions),
  tenantAdmin: tenantAdminPermissions.concat(commonPermissions),
  outletAdmin: outletAdminPermissions.concat(commonPermissions),
  brandAdmin: brandAdminPermissions.concat(commonPermissions),
};
