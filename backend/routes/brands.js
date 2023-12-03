"/api/brands";
const express = require("express");
const router = express.Router();
const { check, query } = require("express-validator");
var passport = require("passport");
var checkRole = require("../middleware/check-role");
var checkPermission = require("../middleware/check-permission");

router.get(
  "/getAllBrands",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisistBrandsPage")
);

router.get(
  "/getBrand/:brandId",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisistBrandsPage")
);

router.post(
  "/createBrand",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateBrands")
);

router.patch(
  "/updateBrand",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateBrands")
);

router.delete(
  "/deleteBrand",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isDeleteBrands")
);

module.exports = router;
