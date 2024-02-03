const jwt = require("jsonwebtoken");
require("dotenv").config();
const HttpError = require("../../models/http-error");
var User = require("../../models/user");
const sendGridMail = require("@sendgrid/mail");
const { handleError } = require("../../common");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
exports.loginUser = function (req, res, next) {
  User.findOne({ email: req.body.email }).then(function (user) {
    if (!user) {
      var error = new HttpError("Invalid email or password", 401);
      return next(error);
    }
    if (!user.isValidPassword(req.body.password)) {
      var error = new HttpError("Invalid email or password", 401);
      return next(error);
    }
    req.login(user, { session: false }, function (err) {
      if (err) {
        return next(err);
      }
      let payload = {
        roles: user.roles,
        name: user.name,
        userId: user._id,
        entityDetails: user.entityDetails,
        permissions: user.permissions,
      };
      var token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({
        message: "Logged In!",
        user: payload,
        token: token,
      });
    });
  });
};
exports.reLoginUser = function (req, res, next) {
  let token = req.headers?.authorization?.split(" ")[1];
  let payload = jwt.decode(token);
  User.findById(payload.userId)
    .then(function (user) {
      if (!user || user.isDeleted || !user.isActive) {
        console.log("user logged out");
        return res.status(401).json({
          message: "User Logged Out",
        });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({
          message: "ReLogged In!",
          user: decoded,
          token: token,
        });
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          payload = {
            roles: user.roles,
            name: user.name,
            entityDetails: user.entityDetails,
            userId: user._id,
            permissions: user.permissions,
          };
          token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
          });
          return res.status(200).json({
            message: "ReLogged In!",
            user: payload,
            token: token,
          });
        } else handleError(res, err);
      }
    })
    .catch(function (err) {
      next(err);
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
