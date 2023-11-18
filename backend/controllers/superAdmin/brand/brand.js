const {
  addImageToS3,
  deleteImageFromS3,
} = require("../../../aws-services/s3-service/aws-s3");
var mongoose = require("mongoose");
var Brand = require("../../../models/brand");
var User = require("../../../models/user");
const HttpError = require("../../../models/http-error");
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
var { v4: uuidv4 } = require("uuid");
var mongoose = require("mongoose");
var async = require("async");
var itemsPerPage = 9;

exports.getBrands = function (req, res, next) {
  if (req.query.page) req.query.page = +req.query.page;
  var skip =
    req.query.page && req.query.page != "undefined"
      ? (parseInt(req.query.page) - 1) * itemsPerPage
      : 0;
  async.parallel(
    [
      function (cb) {
        Brand.aggregate(
          [
            { $match: { superAdminId: req.user.id } },
            { $skip: skip },
            { $limit: itemsPerPage },
            {
              $group: {
                _id: "$superAdminId",
                brands: {
                  $push: "$$ROOT",
                },
              },
            },
          ],
          function (err, data) {
            cb(null, {
              brands: data.length == 0 ? [] : data[0].brands,
            });
          }
        );
      },
      function (cb) {
        Brand.aggregate(
          [{ $match: { superAdminId: req.user.id } }, { $count: "totalItems" }],
          function (err, data) {
            cb(null, {
              totalItems: data.length == 0 ? 0 : data[0].totalItems,
            });
          }
        );
      },
    ],
    function (err, data) {
      console.log(data);
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
    superAdminId: req.user.id,
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
  console.log(req.body);
  Brand.findOne({ name: req.body.name }).then(function (brand) {
    if (brand) {
      var error = new HttpError("Brand already exists", 401);
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
    var p = [];
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
        superAdminId: req.user.id,
      });
      brand
        .save()
        .then(function (brand) {
          var admins = [];
          if (req.body.admins) {
            req.body.admins = JSON.parse(req.body.admins);
            admins = req.body.admins.map(function (admin) {
              User.findOne({ email: admin.email }).then(function (user) {
                if (!user) {
                  var error = new HttpError("Admin Not found", 401);
                  return next(error);
                }
                user.entityDetails.push({
                  entityId: brand.id,
                  entityName: brand.name,
                  entityImage: brand.image,
                });
                user
                  .save()
                  .then(function (user) {
                    console.log(user);
                    return user;
                  })
                  .catch(function (err) {
                    console.log(err);
                    next(err);
                  });
              });
            });
          }
          Promise.all(admins)
            .then(function () {
              res
                .status(200)
                .json({ message: "Brand created successfully", brand: brand });
            })
            .catch(function (err) {
              console.log(err);
              next(err);
            });
        })
        .catch(function (err) {
          console.log(err);
          next(err);
        });
    });
  });
};

exports.updateBrand = function (req, res, next) {
  Brand.findOne({
    _id: mongoose.Types.ObjectId(req.query.brandId),
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
            oldbrand.isdeleted = req.body.isdeleted
              ? req.body.isdeleted
              : oldbrand.isdeleted;

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
            var oldusers=[]
            User.find({
              "role.roleName": { $ne: "superAdmin" },
              "entityDetails.entityId": req.query.brandId,
            }).then(function (users) {
              users.forEach(function (user) {
                var idx = user.entityDetails.findIndex(function (entity) {
                  return entity.entityId == req.query.brandId;
                });
                if (idx !== -1) {
                  user.entityDetails[idx].entityName = req.body.name
                    ? req.body.name
                    : oldbrand.name;
                  user.entityDetails[idx].entityId = req.query.brandId;
                  user.entityDetails[idx].entityImage = fileName;
                  user
                    .save()
                    .then(function (newUser) {
                      oldusers.push(newUser);
                    })
                    .catch(function (err) {});
                }
              });
            });
            Promise.all(oldusers)
              .then(function () {
                cb(null);
              })
              .catch(function (err) {});
          },
        ],
        function (err, data) {
          res.status(200).json({
            message: "Brand Updated",
            brand: data[0].brand,
          });
        }
      );
    });
  });
};
