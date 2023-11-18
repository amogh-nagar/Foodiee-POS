var User = require("../../../models/user");
var Brand = require("../../../models/brand");
var Outlet = require("../../../models/outlet");
var s3 = require("../../../aws-services/aws");
const { v4: uuidv4 } = require("uuid");
const sendGridMail = require("@sendgrid/mail");
const { hashSync } = require("bcrypt");
const HttpError = require("../../../models/http-error");
const { addToQueue } = require("../../../aws-services/email-service/aws-sqs");
const redis = require("redis");
var mongoose = require("mongoose");
var async = require("async");
const client = redis.createClient();
const {
  deleteImageFromS3,
  addImageToS3,
} = require("../../../aws-services/s3-service/aws-s3");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
var itemsPerPage = 9;
exports.getRolesOfAOutlet = function (req, res, next) {
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
          "entityDetails.entityId": req.params.outletId,
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
        roles: data.length==0?[]:data[0].roles,
      });
    }
  );
};

exports.getAllOutletsOfAdmin = function (req, res, next) {
  var outletIds = [];
  req.user.entityDetails.forEach((element) => {
    outletIds.push(mongoose.Types.ObjectId(element.entityId));
  });
  if (req.query.page) req.query.page = +req.query.page;
  var skip =
    req.query.page && req.query.page != "undefined"
      ? (parseInt(req.query.page) - 1) * itemsPerPage
      : 0;

  var outlets = req.user.entityDetails.splice(skip, itemsPerPage);
  var newOutlets = outlets.map(function (outlet) {
    return {
      name: outlet.entityName,
      _id: outlet.entityId,
      image: outlet.entityImage,
    };
  });
  var totalItems = req.user.entityDetails.length;
  return res.status(200).json({
    message: "Outlets Fetched",
    outlets: newOutlets,
    totalItems: totalItems,
  });
  // async.parallel(
  //   [
  //     function (cb) {
  //       Outlet.aggregate(
  //         [
  //           { $match: { _id: { $in: outletIds } } },
  //           { $skip: skip },
  //           { $limit: itemsPerPage },
  //         ],
  //         function (err, data) {
  //           cb(null, {
  //             outlets: data,
  //           });
  //         }
  //       );
  //     },
  //     function (cb) {
  //       Outlet.aggregate(
  //         [{ $match: { id: { $in: outletIds } } }, { $count: "totalItems" }],
  //         function (err, data) {
  //           cb(null, {
  //             totalItems: data.length == 0 ? 0 : data[0].totalItems,
  //           });
  //         }
  //       );
  //     },
  //   ],
  //   function (err, outlets) {
  //     if (err) {
  //       return next(new HttpError("Something went wrong", 500));
  //     }
  //     res.status(200).json({
  //       message: "outlets Fetched",
  //       outlets: outlets[0].outlets,
  //       totalItems: outlets[1].totalItems,
  //     });
  //   }
  // );
};
