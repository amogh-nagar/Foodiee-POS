var mongoose = require("mongoose");
var Tenant = require("../../models/tenant");
const HttpError = require("../../models/http-error");
var { v4: uuidv4 } = require("uuid");
var mongoose = require("mongoose");
var async = require("async");
const {
  MIME_TYPE_MAP,
  addImageToS3,
  deleteImageFromS3,
  handleError,
} = require("../../common");
var itemsPerPage = 20;

exports.getTenants = function (req, res, next) {
  var skip = (req.query.page - 1) * itemsPerPage;
  let query = { superAdminId: req.user._id };
  if (req.query.name) query["$text"] = { $search: req.query.name };
  let aggPipeline = [
    { $match: query },
    { $project: { _id: 1, name: 1, description: 1, image: 1, isActive: 1 } },
    { $skip: skip },
    { $limit: itemsPerPage },
  ];
  if (req.query.getAll) {
    aggPipeline = aggPipeline.slice(0, 2);
    aggPipeline[1]["$project"] = { name: 1 };
  }
  async.parallel(
    [
      function (cb) {
        Tenant.aggregate(aggPipeline, function (err, data) {
          if (err) return cb(err);
          cb(null, {
            tenants: data.length == 0 ? [] : data,
          });
        });
      },
      function (cb) {
        Tenant.aggregate(
          [{ $match: query }, { $count: "totalItems" }],
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
    _id: mongoose.Types.ObjectId(req.params.entityId),
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
    superAdminId: req.user._id,
    name: req.body.name,
  }).then(function (tenant) {
    if (tenant) {
      const error = new HttpError("Duplicate Tenant Found", 400);
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
        superAdminId: req.user._id,
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
    superAdminId: req.user._id,
    name: req.body.name,
    _id: {
      $ne: req.body.entityId,
    },
  }).then(function (tenant) {
    if (tenant) {
      const error = new HttpError("Duplicate Tenant Found", 400);
      return next(error);
    }
    Tenant.findOne({
      _id: req.body.entityId,
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
        oldTenant.name = req.body.name ?? oldTenant.name;
        oldTenant.description = req.body.description ?? oldTenant.description;
        oldTenant.isDeleted = req.body.isDeleted ?? oldTenant.isDeleted;
        oldTenant.isActive = req.body.isActive ?? oldTenant.isActive;
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
  });
};
