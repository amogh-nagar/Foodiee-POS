const express = require("express");
const router = express.Router();
const passport = require("passport");
const { check } = require("express-validator");
var checkRole = require("../middleware/check-role");
const {
  createUser,
  updateUser,
  getUsersOfARole,
  getUser,
} = require("../controllers/outlet/outletAdmin/getUserOfARole");
const {
  getRolesOfAOutlet,
  getAllOutletsOfAdmin,
} = require("../controllers/outlet/outletAdmin/getAllRoles");
const {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  getOrder,
  getRecommendedDishes,
} = require("../controllers/outlet/outletUser/outletOrder");
const checkPermission = require("../middleware/check-permission");
const {
  getDishes,
  getCategories,
} = require("../controllers/outlet/outletUser/outletDish");
const {
  getOutlet,
  updateOutlet,
} = require("../controllers/brand/brandUser/brandOutlet");
//Outlet Admin
router.post(
  "/createOutletUser",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateOutletUser"),
  [
    check("email").isEmail().withMessage("Please enter a valid email."),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ],
  createUser
);
router.patch(
  "/updateOutletUser",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateOutletUser"),
  updateUser
);
router.get(
  "/users/:outletId/:roleName",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadOutletUser"),
  getUsersOfARole
);
router.get(
  "/user/:userId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadOutletUser"),
  getUser
);
router.get(
  "/allRoles/:outletId",
  passport.authenticate("jwt", { session: false }),
  checkRole("OutletAdmin"),
  getRolesOfAOutlet
);
router.get(
  "/allOutlets",
  passport.authenticate("jwt", { session: false }),
  checkRole("OutletAdmin"),
  getAllOutletsOfAdmin
);
router.get(
  "/outlet/:outletId",
  passport.authenticate("jwt", { session: false }),
  checkRole("OutletAdmin"),
  getOutlet
);
router.patch(
  "/updateOutlet",
  passport.authenticate("jwt", { session: false }),
  checkRole("OutletAdmin"),
  updateOutlet
);

router.get(
  "/dishes/:outletId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadOutletDishes"),
  getDishes
);
router.get(
  "/getCategories/:superCategoryId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadOutletDishes"),
  getCategories
);

//Order
router.post(
  "/createOrder",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateOrder"),
  createOrder
);
router.get(
  "/getOrders/:outletId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadOrder"),
  getOrders
);
router.get(
  "/getOrder/:outletId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadOrder"),
  getOrder
);
router.patch(
  "/updateOrder",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateOrder"),
  updateOrder
);
router.delete(
  "/deleteOrder",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isDeleteOrder"),
  deleteOrder
);
router.post(
  "/recommend",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadOutletDishes"),
  getRecommendedDishes
);
module.exports = router;
