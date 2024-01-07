var express = require("express");
var router = express.Router();
const { check, header } = require("express-validator");
var passport = require("passport");
const {
  userProfile,
  updateUser,
  createUser,
} = require("../controllers/user/user");
var checkPermission = require("../middleware/check-permission");
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userProfile
);

router.get(
  "/updateUser",
  passport.authenticate("jwt", { session: false }),
  updateUser
);

router.post(
  "/createUser",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateUser"),
  [
    check("email").isEmail().withMessage("Please enter a valid email."),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ],
  createUser
);
router.patch(
  "/updateUser",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isUpdateUser"),
  updateUser
);

router.get(
  "/getUsers",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isReadBrandUser"),
  getUser
);

router.get(
  "/getRoles",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateUser"),
  getUser
);

router.post(
  "/createRole",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateUser"),
);

router.get(
  "/users/:role",
  passport.authenticate("jwt", { session: false }),
  checkPermission("isCreateUser"),
  getUsersOfARole
);

module.exports = router;
