var User = require("../../../models/user");
var Brand = require("../../../models/brand");
var s3 = require("../../../aws-services/aws");
const { v4: uuidv4 } = require("uuid");
const sendGridMail = require("@sendgrid/mail");
const { hashSync } = require("bcrypt");
const HttpError = require("../../../models/http-error");
const { addToQueue } = require("../../../aws-services/email-service/aws-sqs");
const redis = require("redis");
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

exports.createUser = function (req, res, next) {
  console.log(req.body);
  User.findOne({
    email: req.body.email,
  }).then(function (user) {
    if (user) {
      var error = new HttpError("User already exists", 401);
      return next(error);
    }
    var entity, roleName;
    entity = "Brand";
    roleName = req.body.roleName;
    var newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashSync(req.body.password, 10),
      role: {
        entity: entity,
        roleName: roleName,
      },
      entityDetails: [
        {
          entityId: req.body.entityId,
          entityImage:req.body.entityImage,
          entityName: req.body.entityName,
        },
      ],
      permissions: JSON.parse(req.body.permissions),
    });
    newUser.save().then(function (user) {
      addToQueue({
        email: req.body.email,
        name: req.body.name,
        subject: "Signup success",
        text: "Successfully signed up",
        html: `<div><h1>Welcome to the food Ordering App</h1></div>
            <h3>Here are you credentials</h3>
            <div><p>Name: ${req.body.name}</p></div>
            <div><p>Email: ${req.body.email}</p></div>
            <div><p>Role: ${newUser.role.entity}-${newUser.role.roleName}</p></div>
            <div><p>Thank you for signing up</p></div>
            `,
      });

      res.status(200).json({
        message: "User Registered",
        user: newUser,
      });
    });
  });
};

exports.updateUser = function (req, res, next) {
  User.findOne({
    _id: req.body.userId,
  }).then(function (user) {
    if (!user) {
      var error = new HttpError("User not found", 404);
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
        fileName: user.image,
      });

      user.image = fileName;
    }
    addImageToS3(req, {
      fileName: fileName,
      data: req.files ? req.files.image.data : "",
    }).then(function () {
      user.status = req.body.status ? req.body.status : user.status;
      user.isdeleted = req.body.isdeleted ? req.body.isdeleted : user.isdeleted;
      if (req.body.permissions) {
        user.permissions = req.body.permissions;
      }
      user
        .save()
        .then(function (newUser) {
          client.hset("users", newUser.id, JSON.stringify(newUser));

          res.status(200).json({
            message: "User Updated",
            user: newUser,
          });
        })
        .catch(function (err) {
          console.log(err);
          next(err);
        });
    });
  });
};
