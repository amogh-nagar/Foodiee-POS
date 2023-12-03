"/api/analysis";
const express = require("express");
const router = express.Router();
const { check, query } = require("express-validator");
var passport = require("passport");
var checkRole = require("../middleware/check-role");
var checkPermission = require("../middleware/check-permission");

router.get(
  "/getAllTenantsSales",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  checkRole(["superAdmin", "tenantAdmin"])
);
router.get(
  "/getAllBrandsSales",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  checkRole(["tenantAdmin", "brandAdmin"])
);

router.get(
  "/getAllOutletsSales",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  checkRole(["brandAdmin", "outletAdmin"])
);

router.get(
  "/getTenantHourlySales",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  checkRole(["superAdmin", "tenantAdmin"])
);

router.get(
  "/getBrandHourlySales",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  checkRole(["tenantAdmin", "brandAdmin"])
);

router.get(
  "/getOutletHourlySales",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  checkRole(["brandAdmin", "outletAdmin"])
);

router.get(
  "/getDishSales",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  checkRole(["brandAdmin", "outletAdmin"])
);

router.get(
  "/getTop3Dishes",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  checkRole(["brandAdmin", "outletAdmin"])
);

router.get(
  "/getTop3Brands",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  checkRole(["tenantAdmin"])
);

router.get(
  "/getTop3Outlets",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  checkRole(["brandAdmin"])
);

router.get(
  "/getTop3Tenants",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitAnalysisPage"),
  checkRole(["superAdmin"])
);


module.exports = router;