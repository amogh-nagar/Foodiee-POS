const express = require("express");
const router = express.Router();
const { check, query } = require("express-validator");
var passport = require("passport");
var checkRole = require("../middleware/check-role");
var checkPermission = require("../middleware/check-permission");

router.get(
  "/dishes/:brandId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitDishesPage"),
  getDishes
);
router.get(
  "/dish/:dishId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitDishesPage"),
  getDish
);
router.get(
  "/getCategories/:superCategoryId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitDishesPage"),
  getCategories
);
router.get(
  "/getSuperCategories/:brandId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitDishesPage"),
  getSuperCategories
);
router.patch(
  "/updateDish",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateDishes"),
  updateDish
);
router.delete(
  "/deleteDish",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isDeleteDishes")
);
router.post(
  "/createDish",
  [
    check("name").not().isEmpty().withMessage("Name is required."),
    check("price").not().isEmpty().withMessage("Price is required."),
    check("category").not().isEmpty().withMessage("Category is required."),
    check("superCategory")
      .not()
      .isEmpty()
      .withMessage("superCategory is required."),
  ],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateDishes"),
  createDish
);
router.get(
  "/taxes/:brandId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitTaxPage"),
  taxes
);
router.post(
  "/createTax",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateTax"),
  createTax
);

router.post(
  "/updateTax",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateTax"),
  updateTax
);

router.delete(
  "/deleteTax",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isDeleteTax")
);

router.post(
  "/createSuperCategory",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateDishes"),
  createSuperCategory
);

router.post(
  "/createCategory",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateDishes"),
  createCategory
);

module.exports = router;
