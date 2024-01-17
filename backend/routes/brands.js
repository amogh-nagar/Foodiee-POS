"/api/brands";
const express = require("express");
const router = express.Router();
const { check, query } = require("express-validator");
var passport = require("passport");
var checkRole = require("../middleware/check-role");
var checkPermission = require("../middleware/check-permission");
const { checkAndValidateReq } = require("../common");
const { getBrands, createBrand, updateBrand } = require("../controllers/brand/brand");

router.get(
  "/getBrands",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitBrandsPage"),
  checkAndValidateReq(),
  getBrands
);

router.get(
  "/getBrand/:brandId",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitBrandsPage")
);

router.post(
  "/createBrand",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateBrands"),
  checkAndValidateReq(),
  createBrand
);

router.patch(
  "/updateBrand",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateBrands"),
  checkAndValidateReq(),
  updateBrand
);

router.delete(
  "/deleteBrand",
  [],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isDeleteBrands")
);

module.exports = router;
