const express = require("express");
const router = express.Router();
const { check, query } = require("express-validator");
var passport = require("passport");
var checkRole = require("../middleware/check-role");
var checkPermission = require("../middleware/check-permission");
const { getDishes, getDish, updateDish, createDish, createCategory, createSuperCategory, getCategories, getSuperCategories } = require("../controllers/Dish/dish");
const { checkAndValidateReq } = require("../common");

router.get(
  "/getDishes",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitDishesPage", "isVisitBillingPage"),
  checkAndValidateReq,
  getDishes
);
router.get(
  "/getDish/:dishId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitDishesPage"),
  getDish
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
    check("rate").not().isEmpty().withMessage("rate is required."),
    check("category").not().isEmpty().withMessage("Category is required."),
    check("superCategory")
      .not()
      .isEmpty()
      .withMessage("superCategory is required."),
  ],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateDishes"),
  checkAndValidateReq,
  createDish
);
// router.get(
//   "/taxes/:brandId",
//   passport.authenticate("jwt", { session: false }),
//   checkPermission("isVisitTaxPage"),
//   taxes
// );
// router.post(
//   "/createTax",
//   passport.authenticate("jwt", { session: false }),
//   checkPermission("isCreateTax"),
//   createTax
// );

// router.post(
//   "/updateTax",
//   passport.authenticate("jwt", { session: false }),
//   checkPermission("isUpdateTax"),
//   updateTax
// );

router.delete(
  "/deleteTax",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isDeleteTax")
);

module.exports = router;
