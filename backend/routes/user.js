var express = require("express");
const {
  loginUser,
  registerUser,
  logoutUser,
  reLoginUser,
} = require("../controllers/user/userAuth");
var router = express.Router();
const { check, header } = require("express-validator");
var passport = require("passport");
const {
  userProfile,
  updateUserProfile,
} = require("../controllers/user/userProfile");

router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Please enter a valid email."),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ],
  loginUser
);

router.post("/reLogin", [
  header("Authorization", "Authroization header is required")
    .exists()
    .notEmpty()
    .matches(/^Bearer\s[\w-\.]+$/),
], reLoginUser);

router.post(
  "/register",
  [
    check("email").isEmail().withMessage("Please enter a valid email."),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ],
  registerUser
);

router.delete(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  logoutUser
);

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userProfile
);

router.get(
  "/updateProfile",
  passport.authenticate("jwt", { session: false }),
  updateUserProfile
);

module.exports = router;
