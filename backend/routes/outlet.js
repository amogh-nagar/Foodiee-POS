"/api/outlets";
const express = require("express");
const router = express.Router();
const { check, query } = require("express-validator");
var passport = require("passport");
var checkRole = require("../middleware/check-role");
var checkPermission = require("../middleware/check-permission");

router.get(
  "/getAllOutlets",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitOutletsPage")
);

router.get(
  "/getAllOutlet/:outletId",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitOutletsPage")
);

router.post(
  "/createOutlet",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateOutlets")
);

router.patch(
  "/updateOutlet",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateOutlets")
);

router.delete(
  "/deleteOutlet",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isDeleteOutlets")
);

module.exports = router;