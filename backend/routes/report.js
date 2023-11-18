const express = require("express");
const {
  getBrandsReport,
  getBrandsHourlyReport,
  getBrandsReportWithDates,
  getBrandsHourlyReportWithDates,
  getTop3ItemsofBrandsWithoutDates,
  getTop3ItemsofBrandsWithDatesHourly,
} = require("../controllers/brand/brandAdmin/AdminBrandReport");
const {
  getAllItemsWithDateReport,
  getSpeceficItemsWithDatesReport,
  getSpeceficItemsWithDatesReportQuantity,
} = require("../controllers/brand/brandUser/brandDishReport");
const router = express.Router();
var passport = require("passport");
var checkRole = require("../middleware/check-role");
const checkPermission = require("../middleware/check-permission");
const {
  getOutletsTotalReportWithoutDates,
  getOutletsTotalReportWithDates,
  getOutletsHourlyReportWithoutDate,
  getOutletsHourlyReportWithDates,
} = require("../controllers/brand/brandUser/brandOutletReport");

router.post(
  "/brand/itemsReport",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isGenerateDishReport"),
  getAllItemsWithDateReport
);
router.post(
  "/brand/itemsReportWithDishes",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isGenerateDishReport"),
  getSpeceficItemsWithDatesReport
);
router.post(
  "/brand/itemsReportWithDishes/quantity",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isGenerateDishReport"),
  getSpeceficItemsWithDatesReportQuantity
);

//Outlets
router.post(
  "/brand/outlet/total",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isGenerateOutletReport"),
  getOutletsTotalReportWithoutDates
);
router.post(
  "/brand/outlet/total/dates",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isGenerateOutletReport"),
  getOutletsTotalReportWithDates
);
router.post(
  "/brand/outlet/hourly",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isGenerateOutletReport"),
  getOutletsHourlyReportWithoutDate
);

router.post(
  "/brand/outlet/hourly/dates",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isGenerateOutletReport"),
  getOutletsHourlyReportWithDates
);

router.post(
  "/admin/brandReport",
  passport.authenticate("jwt", { session: false }),
  checkRole("BrandAdmin"),
  getBrandsReport
);
router.post(
  "/admin/brandReport/hourly",
  passport.authenticate("jwt", { session: false }),
  checkRole("BrandAdmin"),
  getBrandsHourlyReport
);
router.post(
  "/admin/brandReport/dates",
  passport.authenticate("jwt", { session: false }),
  checkRole("BrandAdmin"),
  getBrandsReportWithDates
);
router.post(
  "/admin/brandReport/dates/hourly",
  passport.authenticate("jwt", { session: false }),
  checkRole("BrandAdmin"),
  getBrandsHourlyReportWithDates
);
router.post(
  "/admin/brandReport/top3items/dates/hourly",
  passport.authenticate("jwt", { session: false }),
  checkRole("BrandAdmin"),
  getTop3ItemsofBrandsWithDatesHourly
);
router.post(
  "/admin/brandReport/top3items",
  passport.authenticate("jwt", { session: false }),
  checkRole("BrandAdmin"),
  getTop3ItemsofBrandsWithoutDates
);

//SuperAdmin

router.post(
  "/superAdmin/brandReport",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isGenerateBrandReport"),
  getBrandsReport
);
router.post(
  "/superAdmin/brandReport/hourly",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isGenerateBrandReport"),
  getBrandsHourlyReport
);
router.post(
  "/superAdmin/brandReport/dates",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isGenerateBrandReport"),
  getBrandsReportWithDates
);
router.post(
  "/superAdmin/brandReport/dates/hourly",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isGenerateBrandReport"),
  getBrandsHourlyReportWithDates
);
router.post(
  "/superAdmin/brandReport/top3items/dates/hourly",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isGenerateBrandReport"),
  getTop3ItemsofBrandsWithDatesHourly
);
router.post(
  "/superAdmin/brandReport/top3items",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isGenerateBrandReport"),
  getTop3ItemsofBrandsWithoutDates
);

module.exports = router;
