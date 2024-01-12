const express = require("express");
const router = express.Router();
const { check, query, header } = require("express-validator");
var passport = require("passport");
const {
  loginUser,
  reLoginUser,
  logoutUser,
  registerUser,
} = require("../controllers/user/userAuth");
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

router.post(
  "/reLogin",
  [
    header("Authorization", "Authroization header is required")
      .exists()
      .notEmpty()
      .matches(/^Bearer\s[\w-\.]+$/),
  ],
  reLoginUser
);
module.exports = router;
