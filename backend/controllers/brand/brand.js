var mongoose = require("mongoose");
var Brand = require("../../models/brand");
var User = require("../../models/user");
const HttpError = require("../../models/http-error");
var { v4: uuidv4 } = require("uuid");
var mongoose = require("mongoose");
var async = require("async");
const {
  MIME_TYPE_MAP,
  deleteImageFromS3,
  addImageToS3,
  handleError,
} = require("../../common");
var itemsPerPage = 10;

exports.getBrands = function (req, res, next) {
  var skip = (req.query.page - 1) * itemsPerPage;
  let query = {};
  if (req.query.tenantId)
    query = {
      tenantId: req.query.tenantId,
    };
  if (req.query.name) query["$text"] = { $search: req.query.name };
  let aggPipeline = [
    { $match: query },
    { $project: { _id: 1, name: 1, description: 1, image: 1, isActive: 1 } },
    { $skip: skip },
    { $limit: itemsPerPage },
  ];
  if (req.query.getAll) {
    aggPipeline = aggPipeline.slice(0, 2);
    aggPipeline[1]["$project"] = { name: 1, tenantId: 1 };
  }
  async.parallel(
    [
      function (cb) {
        Brand.aggregate(aggPipeline, function (err, data) {
          if (err) return cb(err);
          cb(null, {
            brands: data.length == 0 ? [] : data,
          });
        });
      },
      function (cb) {
        Brand.aggregate(
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
  Brand.findOne({
    tenantId: req.body.tenantId,
    name: req.body.name,
  }).then(function (brand) {
    if (brand) {
      var error = new HttpError("Duplicate Brand found", 400);
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
      var brand = new Brand({
        name: name,
        image: fileName,
        description: description,
        tenantId: req.body.tenantId,
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
  });
};

exports.updateBrand = function (req, res, next) {
  console.log("req.body", req.body);
  Brand.findOne({
    tenantId: req.body.tenantId,
    name: req.body.name,
    _id: {
      $ne: req.body.entityId,
    },
  }).then(function (oldbrand) {
    if (oldbrand) {
      var error = new HttpError("Duplicate Brand Name Found", 404);
      return next(error);
    }
    Brand.findById(req.body.entityId).then(function (oldbrand) {
      if (!oldbrand) {
        var error = new HttpError("Brand not found", 404);
        return next(error);
      }
      var fileName = "";
      if (req.files) {
        if (!MIME_TYPE_MAP[req.files.image.mimetype]) {
          var error = new HttpError("Invalid image type", 400);
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
        oldbrand.name = req.body.name ?? oldbrand.name;
        oldbrand.description = req.body.description ?? oldbrand.description;
        oldbrand.isDeleted = req.body.isDeleted ?? oldbrand.isDeleted;
        oldbrand.isActive = req.body.isActive ?? oldbrand.isActive;
        oldbrand
          .save()
          .then(function (newBrand) {
            res.status(200).json({
              message: "Brand Updated",
              brand: newBrand,
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
