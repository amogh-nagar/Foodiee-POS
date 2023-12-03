import { useDispatch } from "react-redux";
import { useGetAllBrandsSalesQuery, useGetAllOutletsSalesQuery, useGetAllTenantsSalesQuery, useGetBrandHourlySalesQuery, useGetDishSalesQuery, useGetOutletHourlySalesQuery, useGetTenantHourlySalesQuery, useGetTop3BrandsQuery, useGetTop3DishesQuery, useGetTop3OutletsQuery } from "../services/analysis";
import { useReloginMutation } from "../services/auth";
import { useGetAllBrandsDetailsQuery, useGetAllOutletsDetailsQuery, useGetAllTenantsDetailsQuery } from "../services/dashboard";
import { login, logout } from "../store/authSlice";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

export const currencyMap = {
    "USD": "$", 
    "EUR": "€", 
    "JPY": "¥", 
    "GBP": "£", 
    "AUD": "A$", 
    "CAD": "C$", 
    "CHF": "CHF", 
    "CNY": "¥", 
    "SEK": "kr",
    "NZD": "NZ$",
    "MXN": "MX$", 
    "SGD": "S$", 
    "HKD": "HK$",
    "NOK": "kr", 
    "KRW": "₩",
    "TRY": "₺", 
    "RUB": "₽",
    "INR": "₹", 
    "BRL": "R$", 
    "ZAR": "R", 
  };



export const getRandomColors = function getRandomLightColor() {
  const red = Math.floor(Math.random() * 155) + 100; 
  const green = Math.floor(Math.random() * 155) + 100;
  const blue = Math.floor(Math.random() * 155) + 100;
  const color = `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
  return color;
};

export const getColor = function(img){
  let styleObj = {};
  if (img) {
    styleObj.backgroundImage =
      "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)), url(" + img + ")";
    styleObj.backgroundSize = "cover";
    styleObj.color = "white";
    styleObj.backgroundPosition = "center";
  } else {
    styleObj.backgroundImage =
      "linear-gradient(" + getRandomColors() + "," + getRandomColors() + ")";
  }
  return styleObj;
}

export const permissionToRoleBasedAPIs = {
  'isVisitAnalysisPage': {
    'tenantAdmin': [useGetBrandHourlySalesQuery, useGetTop3BrandsQuery],
    'brandAdmin': [useGetBrandHourlySalesQuery, useGetDishSalesQuery, useGetTop3DishesQuery, useGetTop3OutletsQuery],
    'superAdmin': [useGetTenantHourlySalesQuery],
    'outletAdmin': [useGetOutletHourlySalesQuery, useGetDishSalesQuery, useGetTop3DishesQuery],
  },
  'isVisitDashboardPage': {
    'tenantAdmin': [useGetAllBrandsDetailsQuery, useGetAllBrandsSalesQuery],
    'brandAdmin': [useGetAllBrandsDetailsQuery, useGetAllBrandsSalesQuery],
    'superAdmin': [useGetAllTenantsDetailsQuery, useGetAllTenantsSalesQuery],
    'outletAdmin': [useGetAllOutletsDetailsQuery, useGetAllOutletsSalesQuery],
  },
  'isVisitUsersPage': {
    'tenantAdmin': [],
    'brandAdmin': [],
    'superAdmin': [],
    'outletAdmin': [],
  },
  'isVisitTenantsPage': {
    'superAdmin': [],
  },
  'isVisitOutletsPage': {
    'brandAdmin': [],
  },
  'isVisitDishesPage': {
    'brandAdmin': [],
  },
  'isVisitBrandsPage': {
    'tenantAdmin': [],
  },
}

export const permissionOnlyAPIS = {
  'isVisitBillingPage': []
}

var superAdminPermissions = [
  "isCreateTenants",
  "isUpdateTenants",
  "isDeleteTenants",
  "isVisitTenantsPage",
  "isCreatedUser",
  "isUpdateUser",
]

var commonPermissions = [
  "isVisitUsersPage",
  "isVisitAnalysisPage",
  "isVisitDashboardPage",
  "isViewProfile"
]

var tenantAdminPermissions = [ 
  "isCreateBrands",
  "isUpdateBrands",
  "isDeleteBrands",
  "isVisitBrandsPage",
  "isCreatedUser",
  "isUpdateUser",
]

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
  "isUpdateUser"
]

var outletAdminPermissions = [
  "isVisitBillingPage",
  "isCreatedUser",
  "isUpdateUser"
]


export const rolesMappedToPermissions = {
  'superAdmin' : superAdminPermissions.concat(commonPermissions),
  'tenantAdmin' : tenantAdminPermissions.concat(commonPermissions),
  'outletAdmin' : outletAdminPermissions.concat(commonPermissions),
  'brandAdmin' : brandAdminPermissions.concat(commonPermissions)
}