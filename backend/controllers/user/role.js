var Role = require("../../models/role");
const HttpError = require("../../models/http-error");
var mongoose = require("mongoose");
var async = require("async");
const { handleError } = require("../../common");
var itemsPerPage = 20;

exports.getRoles = function (req, res, next) {
  var skip = (req.query.page - 1) * itemsPerPage;
  let query = { entityId: req.query.entityId };
  if (req.query.name) query["$text"] = { $search: req.query.name };
  let aggPipeline = [
    { $match: query },
    { $project: { _id: 1, name: 1, description: 1, isActive: 1 } },
    { $skip: skip },
    { $limit: itemsPerPage },
  ];
  if (req.query.getAll) {
    aggPipeline = aggPipeline.slice(0, 2);
    aggPipeline[1]["$project"] = { name: 1 };
  }
  let parallelArr = [
    function (cb) {
      Role.aggregate(aggPipeline, function (err, data) {
        if (err) return cb(err);
        cb(null, {
          roles: data.length == 0 ? [] : data,
        });
      });
    },
  ];
  if (!req.query.notIncludeTotal) {
    parallelArr.push(function (cb) {
      Role.aggregate(
        [{ $match: query }, { $count: "totalItems" }],
        function (err, data) {
          if (err) return cb(err);
          cb(null, {
            totalItems: data.length == 0 ? 0 : data[0].totalItems,
          });
        }
      );
    });
  }
  async.parallel(parallelArr, function (err, data) {
    if (err)
      return handleError(res, {
        message: "Some error occurred",
        statusCode: 500,
        error: err,
      });
    res.status(200).json({
      message: "Roles Fetched",
      roles: data[0].roles,
      totalItems: data[1].totalItems,
    });
  });
};

exports.getRole = function (req, res, next) {
  Role.findById(req.params.roleId)
    .then(function (role) {
      if (!role) {
        var error = new HttpError("Role not found", 400);
        return next(error);
      }
      res.status(200).json({
        message: "Role Fetched",
        role: role,
      });
    })
    .catch(function (err) {
      console.log(err);
      next(err);
    });
};

exports.createRole = function (req, res, next) {
  Role.findOne({
    entityId: req.body.entityId,
    name: req.body.name,
  }).then(function (role) {
    if (role) {
      const error = new HttpError("Duplicate Role Found", 400);
      return next(error);
    }
    let name = req.body.name;
    let description = req.body.description;
    var role = new Role({
      name: name,
      permissions: req.body.permissions,
      description: description,
      entityId: req.body.entityId,
    });
    role
      .save()
      .then(function (role) {
        res.status(200).json({ message: "Role created successfully", role });
      })
      .catch(function (err) {
        console.log(err);
        next(err);
      });
  });
};

exports.updateRole = function (req, res, next) {
  Role.findOne({
    entityId: req.body.entityId,
    name: req.body.name,
    _id: {
      $ne: req.body.roleId,
    },
  }).then(function (role) {
    if (role) {
      const error = new HttpError("Duplicate Role Name Found", 400);
      return next(error);
    }
    Role.findOne({
      _id: req.body.roleId,
    }).then(function (oldRole) {
      if (!oldRole) {
        var error = new HttpError("Role not found", 400);
        return next(error);
      }
      oldRole.name = req.body.name ?? oldRole.name;
      oldRole.description = req.body.description ?? oldRole.description;
      oldRole.permissions = req.body.permissions ?? oldRole.permissions;
      oldRole.isDeleted = req.body.isDeleted ?? oldRole.isDeleted;
      oldRole.isActive = req.body.isActive ?? oldRole.isActive;
      oldRole
        .save()
        .then(function (newRole) {
          res.status(200).json({
            message: "Role Updated",
            role: newRole,
          });
        })
        .catch(function (err) {
          console.log(err);
          next(err);
        });
    });
  });
};

exports.deleteRole = (req, res, next) => {
  Role.findByIdAndDelete(req.body.roleId, function (err) {
    if (err) {
      var error = new HttpError("Role not found", 400);
      return next(error);
    }
    res.status(200).send("Role deleted successfully");
  });
};
