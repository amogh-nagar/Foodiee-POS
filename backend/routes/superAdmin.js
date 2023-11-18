var expres = require("express");
const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
} = require("../controllers/superAdmin/brand/brand");
var passport = require("passport");
const { query } = require("express-validator/check");
var checkRole = require("../middleware/check-role");
var checkPermission = require("../middleware/check-permission");
const {
  createAdmin,
  getAdminsOfABrand,
  getAdmin,
  updateAdmin,
  getAllAdmins,
} = require("../controllers/superAdmin/brand/brandAdmin");
const {
  createSuperAdmin,
  updateSuperAdmin,
} = require("../controllers/superAdmin/superAdmin/superAdmin");
var router = expres.Router();

router.get(
  "/brands",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadBrand"),
  getBrands
);

router.get(
  "/brand/:brandId",
  [query("brandId").not().isEmpty().withMessage("BrandId is required")],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadBrand"),
  getBrand
);

router.post(
  "/createBrand",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateBrand"),
  createBrand
);

router.patch(
  "/updateBrand",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateBrand"),
  updateBrand
);

router.post(
  "/createAdmin",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateBrandAdmin"),
  createAdmin
);

router.get(
  "/admins/:brandId",
  [query("brandId").not().isEmpty().withMessage("BrandId is required")],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadBrandAdmin"),
  getAdminsOfABrand
);

router.get(
  "/allAdmins",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateBrandAdmin"),
  getAllAdmins
);

router.get(
  "/admin/:adminId",
  [query("brandId").not().isEmpty().withMessage("AdminId is required")],
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadBrandAdmin"),
  getAdmin
);

router.patch(
  "/updateAdmin",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateBrandAdmin"),
  updateAdmin
);

//CRUD SuperAdmins
router.post(
  "/createSuperAdmin",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateSuperAdmin"),
  createSuperAdmin
);
router.post(
  "/updateSuperAdmin",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateSuperAdmin"),
  updateSuperAdmin
);

module.exports = router;
