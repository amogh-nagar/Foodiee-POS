var User = require("../../../models/user");
var Brand = require("../../../models/brand");
const { v4: uuidv4 } = require("uuid");
const sendGridMail = require("@sendgrid/mail");
const { hashSync } = require("bcrypt");
const HttpError = require("../../../models/http-error");
const redis = require("redis");
var mongoose = require("mongoose");
const client = redis.createClient();
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
var itemsPerPage = 9;
var async = require("async");
exports.getRolesOfABrand = function (req, res, next) {
  if (req.query.page) req.query.page = +req.query.page;
  var skip =
    req.query.page && req.query.page != "undefined"
      ? (parseInt(req.query.page) - 1) * itemsPerPage
      : 0;
  User.aggregate(
    [
      { $unwind: "$entityDetails" },
      {
        $match: {
          "entityDetails.entityId": req.params.brandId,
          "role.roleName": { $ne: "Admin" },
        },
      },
      {
        $group: {
          _id: "$role.roleName",
          role: {
            $first: "$role.roleName",
          },
        },
      },
      {
        $sort: {
          role: 1,
        },
      },
      {
        $group: {
          _id: null,
          roles: {
            $push: "$$ROOT",
          },
        },
      },
    ],
    function (err, data) {
      res.status(200).json({
        message: "Roles Fetched",
        roles: data.length == 0 ? [] : data[0].roles,
      });
    }
  );
};

exports.getAllBrandsOfAdmin = function (req, res, next) {
  var brandIds = [];
  req.user.entityDetails.forEach((element) => {
    brandIds.push(mongoose.Types.ObjectId(element.entityId));
  });
  if (req.query.page) req.query.page = +req.query.page;
  var skip =
    req.query.page && req.query.page != "undefined"
      ? (parseInt(req.query.page) - 1) * itemsPerPage
      : 0;
  var brands=req.user.entityDetails.splice(skip,itemsPerPage);
  var newBrands=brands.map(function(brand){
    return {
      name:brand.entityName,
      _id:brand.entityId,
      image:brand.entityImage
    }
  })    
  var totalItems=req.user.entityDetails.length;
  return res.status(200).json({
    message: "Brands Fetched",
    brands: newBrands,
    totalItems: totalItems,
  });
  // async.parallel(
  //   [
  //     function (cb) {
  //       Brand.aggregate(
  //         [
  //           { $match: { _id: { $in: brandIds } } },
  //           { $skip: skip },
  //           { $limit: itemsPerPage },
  //         ],
  //         function (err, data) {
  //           cb(null, {
  //             brands: data,
  //           });
  //         }
  //       );
  //     },
  //     function (cb) {
  //       Brand.aggregate(
  //         [{ $match: { id: { $in: brandIds } } }, { $count: "totalItems" }],
  //         function (err, data) {
  //           cb(null, {
  //             totalItems: data.length == 0 ? 0 : data[0].totalItems,
  //           });
  //         }
  //       );
  //     },
  //   ],
  //   function (err, brands) {
  //     if (err) {
  //       return next(new HttpError("Something went wrong", 500));
  //     }
  //     res.status(200).json({
  //       message: "Brands Fetched",
  //       brands: brands[0].brands,
  //       totalItems: brands[1].totalItems,
  //     });
  //   }
  // );
};



exports.getBrand = function (req, res, next) {
  Brand.findOne({ _id: mongoose.Types.ObjectId(req.params.brandId) })
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