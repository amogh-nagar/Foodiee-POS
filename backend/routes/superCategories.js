const express = require("express");
const router = express.Router();
const { check, query } = require("express-validator");
var passport = require("passport");
var checkRole = require("../middleware/check-role");
var checkPermission = require("../middleware/check-permission");
const {
  createSuperCategory,
  getSuperCategories,
  updateSuperCategory,
  getOutletSuperCategories,
} = require("../controllers/Dish/dish");
const { checkAndValidateReq } = require("../common");

router.get(
  "/getSuperCategories/:brandId/:page",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitDishesPage"),
  checkAndValidateReq,
  getSuperCategories
);

router.get(
  "/getOutletSuperCategories/:outletId/:page",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitBillingPage"),
  checkAndValidateReq,
  getOutletSuperCategories
);

router.post(
  "/createSuperCategory",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateDishes"),
  checkAndValidateReq,
  createSuperCategory
);

router.patch(
  "/updateSuperCategory",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateDishes"),
  checkAndValidateReq,
  updateSuperCategory
);

module.exports = router;
