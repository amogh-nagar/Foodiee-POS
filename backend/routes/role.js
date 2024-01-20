"/api/roles";
const express = require("express");
const router = express.Router();
const { check, query } = require("express-validator");
var passport = require("passport");
var checkPermission = require("../middleware/check-permission");
const { checkAndValidateReq } = require("../common");
const { getRoles, getRole, createRole, updateRole, deleteRole } = require("../controllers/user/role");

router.get(
  "/getRoles",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitRolesPage"),
  checkAndValidateReq,
  getRoles
);

router.get(
  "/getRole/:roleId",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitRolesPage"),
  checkAndValidateReq,
  getRole
);

router.post(
  "/createRole",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateRoles"),
  checkAndValidateReq,
  createRole
);

router.patch(
  "/updateRole",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateRoles"),
  checkAndValidateReq,
  updateRole
);

router.delete(
  "/deleteRole",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isDeleteRoles"),
  checkAndValidateReq,
  deleteRole
);
module.exports = router;
