var Outlet = require("../../models/outlet");
var User = require("../../models/user");
var Dish = require("../../models/dish");
var Brand = require("../../models/brand");
var s3 = require("../../aws-services/aws");
const { v4: uuidv4 } = require("uuid");
const sendGridMail = require("@sendgrid/mail");
const { hashSync } = require("bcrypt");
const HttpError = require("../../models/http-error");
const redis = require("redis");
// const client = redis.createClient();
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
  var skip = req.query.skip;
  async.parallel(
    [
      function (cb) {
        Outlet.aggregate(
          [
            { $match: { "brandDetails.id": req.params.brandId } },
            { $skip: skip },
            { $limit: itemsPerPage },
          ],
          function (err, data) {
            if (err) return cb(err);
            cb(null, {
              outlets: data.length == 0 ? [] : data,
            });
          }
        );
      },
      function (cb) {
        Outlet.aggregate(
          [
            { $match: { "brandDetails.id": req.params.brandId } },
            { $count: "totalItems" },
          ],
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
        message: "Outlets Fetched",
        outlets: data[0].outlets,
        totalItems: data[1].totalItems,
      });
    }
  );
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
  var { name, address } = req.body;
  Outlet.findOne({
    "brandDetails.id": req.body.brandDetails.id,
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
          id: req.body.brandDetails.id,
          name: req.body.brandDetails.name,
        },
        tenantDetails: {
          id: req.body.tenantDetails.id,
          name: req.body.tenantDetails.name,
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
  Outlet.findById(req.query.outletId)
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
          oldoutlet.isActive = req.body.isActive
            ? req.body.isActive
            : oldoutlet.isActive;
          oldoutlet.isDeleted = req.body.isDeleted
            ? req.body.isDeleted
            : oldoutlet.isDeleted;
          oldoutlet.name = req.body.name ? req.body.name : oldoutlet.name;
          oldoutlet.address = req.body.address
            ? req.body.address
            : oldoutlet.address;

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
};
