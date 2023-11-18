const jwt = require("jsonwebtoken");
require("dotenv").config();
const { compareSync, hashSync } = require("bcrypt");
const HttpError = require("../../models/http-error");
var User = require("../../models/user");
var fs = require("fs");
var s3 = require("../../aws-services/aws");
const { v4: uuidv4 } = require("uuid");
var path = require("path");
var { addToQueue } = require("../../aws-services/email-service/aws-sqs");
const redis = require("redis");
// const client = redis.createClient();

const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
exports.loginUser = function (req, res, next) {
  console.log('login')
  User.findOne({ email: req.body.email }).then(function (user) {
    if (!user) {
      var error = new HttpError("Invalid email or password", 401);
      return next(error);
    }
    if (!compareSync(req.body.password, user.password)) {
      var error = new HttpError("Invalid email or password", 401);
      return next(error);
    }
    req.login(user, { session: false }, function (err) {
      if (err) {
        return next(err);
      }
      var token = jwt.sign(
        {
          role: user.role,
          id: user._id,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.status(200).json({
        message: "Logged In!",
        token: "Bearer " + token,
        user: user,
      });
    });
  });
};

exports.registerUser = function (req, res, next) {
  User.findOne({ email: req.body.email }).then(function (user) {
    if (user) {
      var error = new HttpError("User already exists", 401);
      return next(error);
    }
    var entity, roleName;
    if (req.user.role.roleName == "superAdmin") {
      entity = "Brand";
      roleName = "Admin";
    } else if (
      req.user.role.entity == "Brand" &&
      req.user.role.roleName == "Admin"
    ) {
      entity = "Brand";
      roleName = req.body.roleName;
    } else {
      entity = "Outlet";
      roleName = req.body.roleName;
    }
    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashSync(req.body.password, 10),
      role: {
        entity: entity,
        roleName: roleName,
      },
      entityDetails: [
        {
          entityId: req.body.entityId,
          entityName: req.body.entityName,
        },
      ],
      permissions: req.body.permissions,
    });
    newUser.save().then(function (user) {
      addToQueue({
        email: req.body.email,
        name: req.body.name,
        subject: "Signup success",
        text: "Successfully signed up",
        html: `<div><h1>Welcome to the food Ordering App</h1></div>
          <h3>Here are you credentials</h3>
          <div><p>Name: ${req.body.name}</p></div>
          <div><p>Email: ${req.body.email}</p></div>
          <div><p>Role: ${newUser.role.entity}-${newUser.role.roleName}</p></div>
          <div><p>Thank you for signing up</p></div>
          `,
      });

      res.status(200).json({
        message: "User Registered",
        user: newUser,
      });
    });
  });
};
exports.logoutUser = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.status(200).json({
    message: "Logged Out!",
  });
};
