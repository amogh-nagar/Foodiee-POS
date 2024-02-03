const express = require("express");
const router = express.Router();
const passport = require("passport");
const checkPermission = require("../middleware/check-permission");
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  getRazorPayOrderId,
  validateRazorPayOrder,
} = require("../controllers/Order/order");
const { checkAndValidateReq } = require("../common");
//Order
router.post(
  "/createOrder",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitBillingPage"),
  checkAndValidateReq,
  createOrder
);
router.post(
  "/getRazorPayOrderId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitBillingPage"),
  checkAndValidateReq,
  getRazorPayOrderId
);
router.post(
  "/validateRazorPayOrder",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitBillingPage"),
  checkAndValidateReq,
  validateRazorPayOrder
);
router.get(
  "/getOrders/:outletId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitBillingPage"),
  checkAndValidateReq,
  getOrders
);
router.get(
  "/getOrder/:outletId",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitBillingPage"),
  checkAndValidateReq,
  getOrder
);
router.patch(
  "/updateOrder",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitBillingPage"),
  checkAndValidateReq,
  updateOrder
);
// router.post(
//   "/recommend",
//   passport.authenticate("jwt", { session: false }),
//   checkPermission("isVisitBillingPage"),
//   getRecommendedDishes
// );
module.exports = router;
