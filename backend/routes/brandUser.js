const express = require("express");
const router = express.Router();
const { check, query } = require("express-validator");
var passport = require("passport");
var checkRole = require("../middleware/check-role");
var checkPermission = require("../middleware/check-permission");
const {
  createOutlet,
  updateOutlet,
  getOutlets,
  getOutlet,
  getAdminsOfAOutlet,
  updateAdmin,
  createAdmin,
  getAdmin,
  getAllOutletAdmins,
} = require("../controllers/brand/brandUser/brandOutlet");
const {
  createUser,
  updateUser,
  getUser,
  getUsersOfARole,
} = require("../controllers/brand/brandAdmin/getUserOfARole");
const {
  getRolesOfABrand,
  getAllBrandsOfAdmin,
  getBrand,
} = require("../controllers/brand/brandAdmin/getAllRoles");
const {
  getDishes,
  getDish,
  getCategories,
  updateDish,
  createDish,
  createSuperCategory,
  createCategory,
  getSuperCategories,
  taxes,
  createTax,
  updateTax,
} = require("../controllers/brand/brandUser/brandDish");
const { updateBrand } = require("../controllers/superAdmin/brand/brand");

//Brand Admin
router.post(
  "/createBrandUser",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateBrandUser"),
  [
    check("email").isEmail().withMessage("Please enter a valid email."),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ],
  createUser
);
router.patch(
  "/updateBrandUser",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateBrandUser"),
  updateUser
);
router.get(
  "/users/:brandId/:role",
  [query("brandId").not().isEmpty().withMessage("BrandId is required")],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadBrandUser"),
  getUsersOfARole
);
router.get(
  "/user/:userId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadBrandUser"),
  getUser
);
router.get(
  "/allRoles/:brandId",
  passport.authenticate("jwt", { session: false }),
  checkRole("BrandAdmin"),
  getRolesOfABrand
);
router.get(
  "/allBrands",
  passport.authenticate("jwt", { session: false }),
  checkRole("BrandAdmin"),
  getAllBrandsOfAdmin
);
router.patch(
  "/updateBrand",
  passport.authenticate("jwt", { session: false }),
  checkRole("BrandAdmin"),
  updateBrand
);
router.get(
  "/brand/:brandId",
  [query("brandId").not().isEmpty().withMessage("BrandId is required")],
  passport.authenticate("jwt", { session: false }),
  checkRole("BrandAdmin"),
  getBrand
);
//Outlet Manager
router.post(
  "/createOutletAdmin",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateOutletAdmin"),
  createAdmin
);
router.patch(
  "/updateOutletAdmin",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateOutletAdmin"),
  updateAdmin
);
router.get(
  "/admins/:outletId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadOutletAdmin"),
  getAdminsOfAOutlet
);
router.get(
  "/admin/:adminId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadOutletAdmin"),
  getAdmin
);
router.post(
  "/createOutlet",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateOutlet"),
  createOutlet
);
router.patch(
  "/updateOutlet",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateOutlet"),
  updateOutlet
);

router.get(
  "/outlets/:brandId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadOutlet"),
  getOutlets
);
router.get(
  "/outlet/:outletId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadOutlet"),
  getOutlet
);

//Dish Manager
router.get(
  "/dishes/:brandId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadDish"),
  getDishes
);
router.get(
  "/dish/:dishId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadDish"),
  getDish
);
router.get(
  "/getCategories/:superCategoryId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadDish"),
  getCategories
);
router.get(
  "/getSuperCategories/:brandId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadDish"),
  getSuperCategories
);
router.patch(
  "/updateDish",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateDish"),
  updateDish
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
  checkPermission("isCreateDish"),
  createDish
);
router.get(
  "/taxes/:brandId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadTax"),
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
router.post(
  "/createSuperCategory",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateSuperCategory"),
  createSuperCategory
);
router.get(
  "/allOutletAdmins/:brandId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateOutletAdmin"),
  getAllOutletAdmins
);
router.post(
  "/createCategory",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateCategory"),
  createCategory
);
module.exports = router;
