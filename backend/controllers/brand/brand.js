const {
  addImageToS3,
  deleteImageFromS3,
} = require("../../../aws-services/s3-service/aws-s3");
var mongoose = require("mongoose");
var Brand = require("../../models/brand");
var User = require("../../models/user");
const HttpError = require("../../models/http-error");
var { v4: uuidv4 } = require("uuid");
var mongoose = require("mongoose");
var async = require("async");
const { MIME_TYPE_MAP } = require("../../common");
var itemsPerPage = 10;

exports.getBrands = function (req, res, next) {
  var skip = req.query.skip;
  async.parallel(
    [
      function (cb) {
        Brand.aggregate(
          [
            { $match: { tenantId: req.user.id } },
            { $skip: skip },
            { $limit: itemsPerPage },
          ],
          function (err, data) {
            if (err) return cb(err);
            cb(null, {
              brands: data.length == 0 ? [] : data,
            });
          }
        );
      },
      function (cb) {
        Brand.aggregate(
          [{ $match: { tenantId: req.user.id } }, { $count: "totalItems" }],
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
        message: "Brands Fetched",
        brands: data[0].brands,
        totalItems: data[1].totalItems,
      });
    }
  );
};

exports.getBrand = function (req, res, next) {
  Brand.findOne({
    _id: mongoose.Types.ObjectId(req.params.brandId),
    tenantId: req.user.id,
  })
    .then(function (brand) {
      if (!brand) {
        var error = new HttpError("Brand not found", 404);
        return next(error);
      }
      res.status(200).json({
        message: "Brand Fetched",
        brand: brand,
      });
    })
    .catch(function (err) {
      console.log(err);
      next(err);
    });
};

exports.createBrand = function (req, res, next) {
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
    var brand = new Brand({
      name: name,
      image: fileName,
      description: description,
      tenantId: req.user.id,
    });
    brand
      .save()
      .then(function (brand) {
        res
          .status(200)
          .json({ message: "Brand created successfully", brand: brand });
      })
      .catch(function (err) {
        console.log(err);
        next(err);
      });
  });
};

exports.updateBrand = function (req, res, next) {
  Brand.findOne({
    _id: req.query.brandId,
  }).then(function (oldbrand) {
    if (!oldbrand) {
      var error = new HttpError("Brand not found", 404);
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
        fileName: oldbrand.image,
      });
      oldbrand.image = fileName;
    }
    addImageToS3(req, {
      fileName: fileName,
      data: req.files ? req.files.image.data : "",
    }).then(function () {
      async.parallel(
        [
          function (cb) {
            oldbrand.name = req.body.name ? req.body.name : oldbrand.name;
            oldbrand.description = req.body.description
              ? req.body.description
              : oldbrand.description;
            oldbrand.status = req.body.status
              ? req.body.status
              : oldbrand.status;
            oldbrand.isDeleted = req.body.isDeleted
              ? req.body.isDeleted
              : oldbrand.isDeleted;
            oldbrand.isActive = req.body.isActive
              ? req.body.isActive
              : oldbrand.isActive;
            oldbrand
              .save()
              .then(function (newBrand) {
                cb(null, {
                  brand: newBrand,
                });
              })
              .catch(function (err) {
                console.log(err);
                next(err);
              });
          },
          function (cb) {
            var bulkOps = [
              {
                updateMany: {
                  filter: { "entityDetails.entityId": req.query.brandId },
                  update: { $set: updateObj },
                  arrayFilters: [{ "elem.entityId": req.query.brandId }],
                },
              },
            ];
            var updateObj = {};
            if (req.body.name) {
              updateObj["entityDetails.$[elem].entityName"] = req.body.name;
            }
            if (fileName?.length > 0) {
              updateObj["entityDetails.$[elem].entityImage"] = fileName;
            }
            User.bulkWrite(bulkOps)
              .then((result) => {
                console.log("Bulk Operation Done", result);
                cb(null);
              })
              .catch((err) => {
                cb(err);
              });
          },
        ],
        function (err, data) {
          if (err) {
            return handleError(res, {
              message: "Some error occurred",
              statusCode: 500,
            });
          }
          res.status(200).json({
            message: "Brand Updated",
            brand: data[0].brand,
          });
        }
      );
    });
  });
};
