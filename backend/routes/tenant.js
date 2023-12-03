"/api/tenants";
const express = require("express");
const router = express.Router();
const { check, query } = require("express-validator");
var passport = require("passport");
var checkRole = require("../middleware/check-role");
var checkPermission = require("../middleware/check-permission");

router.get(
  "/getAllTenants",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisistTenantsPage")
);

router.post(
  "/createTenant",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateTenants")
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
