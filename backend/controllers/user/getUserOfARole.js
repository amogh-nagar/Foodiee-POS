var User = require("../../models/user");
var Brand = require("../../models/brand");
var s3 = require("../../aws-services/aws");
const { v4: uuidv4 } = require("uuid");
const sendGridMail = require("@sendgrid/mail");
const { hashSync } = require("bcrypt");
const HttpError = require("../../models/http-error");
const { addToQueue } = require("../../aws-services/email-service/aws-sqs");
const redis = require("redis");
const client = redis.createClient();
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
var itemsPerPage = 9;
var async = require("async");
exports.getUsersOfARole = function (req, res, next) {
  if (req.query.page) req.query.page = +req.query.page;
  var skip =
    req.query.page && req.query.page != "undefined"
      ? (parseInt(req.query.page) - 1) * itemsPerPage
      : 0;
  async.parallel(
    [
      function (cb) {
        User.aggregate(
          [
            { $unwind: "$entityDetails" },
            {
              $match: {
                "entityDetails.entityId": req.params.brandId,
                "role.roleName": req.params.role,
                _id: { $ne: req.user._id },
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: itemsPerPage,
            },
            {
              $group: {
                _id: "$role.roleName",
                users: {
                  $push: {
                    _id: "$_id",
                    name: "$name",
                    email: "$email",
                    role: "$role",
                    isdeleted: "$isdeleted",
                    status: "$status",
                    image: "$image",
                  },
                },
              },
            },
          ],
          function (err, data) {
            cb(null, {
              users: data.length > 0 ? data[0].users : [],
            });
          }
        );
      },
      function (cb) {
        User.aggregate(
          [
            { $unwind: "$entityDetails" },
            {
              $match: {
                "entityDetails.entityId": req.params.brandId,
                "role.roleName": req.params.role,
                _id: { $ne: req.user._id },
              },
            },
            { $count: "totalItems" },
          ],
          function (err, data) {
            cb(null, { totalItems: data.length == 0 ? 0 : data[0].totalItems });
          }
        );
      },
    ],
    function (err, results) {
      res.status(200).json({
        message: "Users Fetched",
        users: results[0].users,
        totalItems: results[1].totalItems,
      });
    }
  );
};

exports.getUser = function (req, res, next) {
  client.hget("users", req.params.userId, function (err, data) {
    data = JSON.parse(data);
    if (data) {
      console.log("Fetched from redis");
      res.status(200).json({
        message: "User fetched",
        user: data,
      });
    } else {
      User.findById(req.params.userId)
        .then(function (user) {
          if (!user) {
            var error = new HttpError("User not found", 404);
            return next(error);
          }
          client.hset("users", user.id, JSON.stringify(user));

          res.status(200).json({
            message: "User Fetched",
            user: user,
          });
        })
        .catch(function (err) {
          console.log(err);
          next(err);
        });
    }
  });
};
