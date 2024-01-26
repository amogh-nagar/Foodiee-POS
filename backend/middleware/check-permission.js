const HttpError = require("../models/http-error");

module.exports =
  (...permissions) =>
  (req, res, next) => {
    if (!req.user) {
      return next(new HttpError("You must be logged in", 401));
    }
    if (req?.user?.roles[0]?.roleName === "superAdmin") {
      return next();
    }
    var hasPermission = false;
    permissions.forEach(function (permission) {
      if (req.user.permissions.includes(permission)) {
        hasPermission = true;
      }
    });
    if (!hasPermission) {
      return next(
        new HttpError("You are not authorized to access this route", 401)
      );
    }
    return next();
  };
