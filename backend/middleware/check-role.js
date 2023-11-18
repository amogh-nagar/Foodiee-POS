const HttpError = require("../models/http-error");

var ROLES = ["Brand", "Outlet", "admin"];
module.exports =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(new HttpError("You must be logged in", 401));
    }

    const hasRole = roles.find(
      (role) => (req.user.role.entity + req.user.role.roleName) === role
    );
    console.log(hasRole)
    if (!hasRole) {
      return next(
        new HttpError("You are not authorized to access this route", 401)
      );
    }
    return next();
  };
