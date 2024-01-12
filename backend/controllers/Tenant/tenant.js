const {
  addImageToS3,
  deleteImageFromS3,
} = require("../../../aws-services/s3-service/aws-s3");
var mongoose = require("mongoose");
var Tenant = require("../../models/tenant");
var User = require("../../models/user");
const HttpError = require("../../models/http-error");
var { v4: uuidv4 } = require("uuid");
var mongoose = require("mongoose");
var async = require("async");
const { MIME_TYPE_MAP } = require("../../common");
var itemsPerPage = 10;

exports.getTenants = function (req, res, next) {
  var skip = req.query.skip;
  async.parallel(
    [
      function (cb) {
        Tenant.aggregate(
          [
            { $match: { superAdminId: req.user.id } },
            { $skip: skip },
            { $limit: itemsPerPage },
          ],
          function (err, data) {
            if (err) return cb(err);
            cb(null, {
              tenants: data.length == 0 ? [] : data,
            });
          }
        );
      },
      function (cb) {
        Tenant.aggregate(
          [{ $match: { superAdminId: req.user.id } }, { $count: "totalItems" }],
          function (err, data) {
            if (err) return cb(err);
            cb(null, {
              totalItems: data.length == 0 ? 0 : data[0].totalItems,
            });
          }
        );
      },
    ],
    function (err, data) {
      if (err)
        return handleError(res, {
          message: "Some error occurred",
          statusCode: 500,
          error: err,
        });
      res.status(200).json({
        message: "Tenants Fetched",
        tenants: data[0].tenants,
        totalItems: data[1].totalItems,
      });
    }
  );
};

exports.getTenant = function (req, res, next) {
  Tenant.findOne({
    _id: mongoose.Types.ObjectId(req.params.tenantId),
  })
    .then(function (tenant) {
      if (!tenant) {
        var error = new HttpError("Tenant not found", 400);
        return next(error);
      }
      res.status(200).json({
        message: "Tenant Fetched",
        tenant: tenant,
      });
    })
    .catch(function (err) {
      console.log(err);
      next(err);
    });
};

exports.createTenant = function (req, res, next) {
  Tenant.findOne({
    superAdminId: req.user.id,
    name: req.body.name,
  }).then(function (tenant) {
    if (tenant) {
      var error = new HttpError("Duplicate Tenant found", 400);
      return next(error);
    }
    var fileName = "";

    if (req.files) {
      if (!MIME_TYPE_MAP[req.files.image.mimetype]) {
        var error = new HttpError("Invalid image type", 401);
        return next(error);
      }
      fileName = uuidv4() + "." + MIME_TYPE_MAP[req.files.image.mimetype];
    }
    addImageToS3(req, {
      fileName: fileName,
      data: req.files ? req.files.image.data : "",
    }).then(function () {
      let name = req.body.name;
      let description = req.body.description;
      var tenant = new Tenant({
        name: name,
        image: fileName,
        description: description,
        superAdminId: req.user.id,
      });
      tenant
        .save()
        .then(function (tenant) {
          res
            .status(200)
            .json({ message: "Tenant created successfully", tenant: tenant });
        })
        .catch(function (err) {
          console.log(err);
          next(err);
        });
    });
  });
};

exports.updateTenant = function (req, res, next) {
  Tenant.findOne({
    _id: req.query.tenantId,
  }).then(function (oldTenant) {
    if (!oldTenant) {
      var error = new HttpError("Tenant not found", 400);
      return next(error);
    }
    var fileName = "";
    if (req.files) {
      if (!MIME_TYPE_MAP[req.files.image.mimetype]) {
        var error = new HttpError("Invalid image type", 401);
        return next(error);
      }
      fileName = uuidv4() + "." + MIME_TYPE_MAP[req.files.image.mimetype];
      deleteImageFromS3({
        fileName: oldTenant.image,
      });
      oldTenant.image = fileName;
    }
    addImageToS3(req, {
      fileName: fileName,
      data: req.files ? req.files.image.data : "",
    }).then(function () {
      oldTenant.name = req.body.name ? req.body.name : oldTenant.name;
      oldTenant.description = req.body.description
        ? req.body.description
        : oldTenant.description;
      oldTenant.isDeleted = req.body.isDeleted
        ? req.body.isDeleted
        : oldTenant.isDeleted;
      oldTenant.isActive = req.body.isActive
        ? req.body.isActive
        : oldTenant.isActive;
      oldTenant
        .save()
        .then(function (newTenant) {
          res.status(200).json({
            message: "Tenant Updated",
            tenant: newTenant,
          });
        })
        .catch(function (err) {
          console.log(err);
          next(err);
        });
    });
  });
};
