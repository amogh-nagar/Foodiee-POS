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
