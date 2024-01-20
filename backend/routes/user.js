"/api/users"
var express = require("express");
var router = express.Router();
const { check, header } = require("express-validator");
var passport = require("passport");
const {
  updateUser,
  createUser,
  getUsers,
} = require("../controllers/user/user");
var checkPermission = require("../middleware/check-permission");
const { getUser } = require("../controllers/user/user");
const { checkAndValidateReq } = require("../common");


router.get(
  "/getUsers",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitUsersPage"),
  checkAndValidateReq,
  getUsers
);

router.get(
  "/getUser",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isVisitUsersPage"),
  checkAndValidateReq,
  getUser
);

router.post(
  "/createUser",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateUsers"),
  [
    check("email").isEmail().withMessage("Please enter a valid email."),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ],
  checkAndValidateReq,
  createUser
);
router.patch(
  "/updateUser",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateUsers"),
  checkAndValidateReq,
  updateUser
);

module.exports = router;
