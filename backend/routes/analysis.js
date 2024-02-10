"/api/analysis";
const express = require("express");
const router = express.Router();
const { check, query } = require("express-validator");
var passport = require("passport");
var checkPermission = require("../middleware/check-permission");
const {
  getTop3Tenants,
  getTenantHourlySales,
  getAllTenantsTotalSales,
  getActiveInactiveRatioForTenants,
  getTop3ItemsOfTenants,
  getMonthWiseTop3TenantsSale,
  getHourWiseTop3TenantsSale,
} = require("../controllers/Analysis/tenants");
const {
  getTop3Outlets,
  getOutletHourlySales,
  getAllOutletsTotalSales,
} = require("../controllers/Analysis/outlets");
const {
  getTop3Brands,
  getBrandHourlySales,
  getAllBrandsTotalSales,
} = require("../controllers/Analysis/brands");
const {
  getTop3Dishes,
  getAllDishesTotalSales,
  getDishHourlySales,
} = require("../controllers/Analysis/dish");
const { checkAndValidateReq } = require("../common");

router.get(
  "/getAllTenantsSales",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  getAllTenantsTotalSales
);
router.get(
  "/getAllBrandsSales",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  getAllBrandsTotalSales
);

router.get(
  "/getAllOutletsTotalSales",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  getAllOutletsTotalSales
);

router.get(
  "/getTenantHourlySales",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  getTenantHourlySales
);

router.get(
  "/getBrandHourlySales",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  getBrandHourlySales
);

router.get(
  "/getOutletHourlySales",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  getOutletHourlySales
);

router.get(
  "/getDishHourlySales",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  getDishHourlySales
);

router.get(
  "/getAllDishesTotalSales",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  getAllDishesTotalSales
);

router.get(
  "/getTop3Dishes",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  getTop3Dishes
);

router.get(
  "/getTop3Brands",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  getTop3Brands
);

router.get(
  "/getTop3Outlets",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  getTop3Outlets
);

router.get(
  "/getTop3Tenants",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  checkAndValidateReq,
  getTop3Tenants
);

router.get(
  "/getActiveInactiveRatioForTenants",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  checkAndValidateReq,
  getActiveInactiveRatioForTenants
);

router.get(
  "/getTop3ItemsOfTenants",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  checkAndValidateReq,
  getTop3ItemsOfTenants
);

router.get(
  "/getMonthWiseTop3TenantsSale",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  checkAndValidateReq,
  getMonthWiseTop3TenantsSale
);

router.get(
  "/getHourWiseTop3TenantsSale",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  checkAndValidateReq,
  getHourWiseTop3TenantsSale
);

module.exports = router;
