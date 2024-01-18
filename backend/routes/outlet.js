"/api/outlets";
const express = require("express");
const router = express.Router();
const { check, query } = require("express-validator");
var passport = require("passport");
var checkRole = require("../middleware/check-role");
var checkPermission = require("../middleware/check-permission");
const { getOutlets, createOutlet, updateOutlet, getOutlet } = require("../controllers/outlet/outlet");
const { checkAndValidateReq } = require("../common");

router.get(
  "/getOutlets",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitOutletsPage"),
  checkAndValidateReq,
  getOutlets
);

router.get(
  "/getOutlet/:outletId",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitOutletsPage"),
  checkAndValidateReq,
  getOutlet
);

router.post(
  "/createOutlet",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateOutlets"),
  checkAndValidateReq,
  createOutlet
);

router.patch(
  "/updateOutlet",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateOutlets"),
  checkAndValidateReq,
  updateOutlet
);

module.exports = router;