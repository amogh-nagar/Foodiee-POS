var Outlet = require("../../models/outlet");
const { v4: uuidv4 } = require("uuid");
const sendGridMail = require("@sendgrid/mail");
const { hashSync } = require("bcrypt");
const HttpError = require("../../models/http-error");
const redis = require("redis");
const { addToQueue } = require("../../aws-services/email-service/aws-sqs");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
var async = require("async");
const mongoose = require("mongoose");
const { addImageToS3 } = require("../../common");
var itemsPerPage = 9;
exports.getOutlets = function (req, res, next) {
  var skip = (req.query.page - 1) * itemsPerPage;
  let query = {};
  if (req.query.brandId)
    query = {
      "brandDetails.id": req.query.brandId,
    };
  if (req.query.tenantId)
    query = {
      "tenantDetails.id": req.query.tenantId,
    };
  if (req.query.brandIds)
    query = {
      "brandDetails.id": {
        $in: req.query.brandIds,
      },
    };
  if (req.query.tenantIds)
    query = {
      "tenantDetails.id": {
        $in: req.query.tenantIds,
      },
    };
  if (req.query.name) query["$text"] = { $search: req.query.name };
  let aggPipeline = [
    { $match: query },
    {
      $project: {
        _id: 1,
        name: 1,
        address: 1,
        image: 1,
        isActive: 1,
        brandDetails: 1,
        tenantDetails: 1,
      },
    },
    { $skip: skip },
    { $limit: itemsPerPage },
  ];
  if (req.query.getAll) {
    aggPipeline = aggPipeline.slice(0, 2);
    aggPipeline[1]["$project"] = { name: 1 };
  }
  var parallelArr = [
    function (cb) {
      Outlet.aggregate(aggPipeline, function (err, data) {
        if (err) return cb(err);
        cb(null, {
          outlets: data.length == 0 ? [] : data,
        });
      });
    },
  ];
  if (!req.query.notIncludeTotal) {
    parallelArr.push(function (cb) {
      Outlet.aggregate(
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
      message: "Outlets Fetched",
      outlets: data[0].outlets,
      totalItems: data[1]?.totalItems,
    });
  });
};

exports.getOutlet = function (req, res, next) {
  Outlet.findById(req.params.outletId)
    .then(function (outlet) {
      if (!outlet) {
        var error = new HttpError("Outlet not found", 404);
        return next(error);
      }
      res.status(200).json({
        message: "Outlet Fetched",
        outlet: outlet,
      });
    })
    .catch(function (err) {
      console.log(err);
      next(err);
    });
};

exports.createOutlet = function (req, res, next) {
  var { name, address, brandId, tenantId } = req.body;
  Outlet.findOne({
    "brandDetails.id": brandId,
    name: name,
  }).then(function (outlet) {
    if (outlet) {
      var error = new HttpError("Duplicate Outlet found", 400);
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
      var newoutlet = new Outlet({
        name: name,
        image: fileName,
        address: address,
        brandDetails: {
          id: brandId,
        },
        tenantDetails: {
          id: tenantId,
        },
      });
      newoutlet
        .save()
        .then(function (outlet) {
          res.status(200).json({
            message: "Outlet Created!",
            outlet: outlet,
          });
        })
        .catch(function (err) {
          console.log(err);
          next(err);
        });
    });
  });
};

exports.updateOutlet = function (req, res, next) {
  Outlet.findOne({
    name: req.body.name,
    _id: {
      $ne: req.body.entityId,
    },
    "brandDetails.id": req.body.brandId,
  }).then(function (oldOutlet) {
    if (oldOutlet) {
      var error = new HttpError("Duplicate Outlet Name Found", 404);
      return next(error);
    }
    Outlet.findById(req.body.entityId)
      .then(function (oldoutlet) {
        if (!oldoutlet) {
          var error = new HttpError("Outlet not found", 404);
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
            fileName: oldoutlet.outletImage,
          });
        }
        addImageToS3(req, {
          fileName: fileName,
          data: req.files ? req.files.image.data : "",
        })
          .then(function () {
            oldoutlet.image = fileName;
            oldoutlet.isActive = req.body.isActive ?? oldoutlet.isActive;
            oldoutlet.isDeleted = req.body.isDeleted ?? oldoutlet.isDeleted;
            oldoutlet.name = req.body.name ?? oldoutlet.name;
            oldoutlet.address = req.body.address ?? oldoutlet.address;

            oldoutlet
              .save()
              .then(function (newOutlet) {
                res.status(200).json({
                  message: "Outlet updated successfully!",
                  outlet: newOutlet,
                });
              })
              .catch(function (err) {
                next(err);
              });
          })
          .catch(function (err) {
            next(err);
          });
      })
      .catch(function (err) {
        next(err);
      });
  });
};
