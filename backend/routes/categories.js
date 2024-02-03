const express = require("express");
const router = express.Router();
const { check, query } = require("express-validator");
var passport = require("passport");
var checkRole = require("../middleware/check-role");
var checkPermission = require("../middleware/check-permission");
const { createCategory, getCategories, updateCategory } = require("../controllers/Dish/dish");
const { checkAndValidateReq } = require("../common");
router.get(
  "/getCategories/:superCategoryId/:page",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitDishesPage", "isVisitBillingPage"),
  checkAndValidateReq,
  getCategories
);

router.post(
  "/createCategory",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateDishes"),
  checkAndValidateReq,
  createCategory
);

router.patch(
  "/updateCategory",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateDishes"),
  checkAndValidateReq,
  updateCategory
);

module.exports = router;
