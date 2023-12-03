"/api/dashboard";
const express = require("express");
const router = express.Router();
const { check, query } = require("express-validator");
var passport = require("passport");
var checkRole = require("../middleware/check-role");
var checkPermission = require("../middleware/check-permission");

router.get(
  "/getAllTenantsDetails",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitDashboardPage")
);

router.get(
  "/getAllOutletsDetails",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitDashboardPage")
);

router.get(
  "/getAllBrandsDetails",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitDashboardPage")
);


module.exports = router;