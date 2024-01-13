"/api/tenants";
const express = require("express");
const router = express.Router();
const { check, query } = require("express-validator");
var passport = require("passport");
var checkRole = require("../middleware/check-role");
var checkPermission = require("../middleware/check-permission");
const { createTenant, getTenants, searchTenants } = require("../controllers/Tenant/tenant");
const { checkAndValidateReq } = require("../common");

router.get(
  "/getTenants",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitTenantsPage"),
  checkAndValidateReq(),
  getTenants
);

router.post(
  "/createTenant",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateTenants"),
  createTenant
);

router.patch(
  "/updateTenant",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateTenants")
);

router.delete(
  "/deleteTenant",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isDeleteTenants")
);

module.exports = router;
