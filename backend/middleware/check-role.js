const HttpError = require("../models/http-error");
module.exports =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(new HttpError("You must be logged in", 401));
    }

    const hasRole = req.user?.roles?.some((role) =>
      roles.includes(role.roleName)
    );
    if (!hasRole) {
      return next(
        new HttpError("You are not authorized to access this route", 401)
      );
    }
    return next();
  };
