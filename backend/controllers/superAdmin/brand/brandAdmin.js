var User = require("../../../models/user");
var Brand = require("../../../models/brand");
var s3 = require("../../../aws-services/aws");
const { v4: uuidv4 } = require("uuid");
const sendGridMail = require("@sendgrid/mail");
const { hashSync } = require("bcrypt");
var mongoose = require("mongoose");
const HttpError = require("../../../models/http-error");
const { addToQueue } = require("../../../aws-services/email-service/aws-sqs");
const redis = require("redis");
// const client = redis.createClient();
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
exports.getAdminsOfABrand = function (req, res, next) {
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
          "role.roleName": "Admin",
          "role.entity": "Brand",
          "entityDetails.entityId": req.params.brandId,
        },
      },
      {
        $group: {
          _id: "$role.roleName",
          admins: {
            $push: "$$ROOT",
          },
        },
      },
    ],
    function (err, data) {
      res.status(200).json({
        message: "Admins Fetched",
        admins: data.length == 0 ? [] : data[0].admins,
      });
    }
  );
};

exports.getAdmin = function (req, res, next) {
  User.findById(req.params.adminId)
    .then(function (user) {
      if (!user) {
        var error = new HttpError("User not found", 404);
        return next(error);
      }
      res.status(200).json({
        message: "User Fetched",
        user: user,
      });
    })
    .catch(function (err) {
      console.log(err);
      next(err);
    });
};

exports.createAdmin = function (req, res, next) {
  User.findOne({
    email: req.body.email,
  }).then(function (user) {
    if (user) {
      var error = new HttpError("User already exists", 401);
      return next(error);
    }
    var entity,
      roleName,
      fileName = "";
    entity = "Brand";
    roleName = "Admin";
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
    })
      .then(function () {
        var newUser = new User({
          name: req.body.name,
          image: fileName,
          email: req.body.email,
          password: hashSync(req.body.password, 10),
          role: {
            entity: entity,
            roleName: roleName,
          },
          entityDetails: [
            {
              entityId: req.body.entityId,
              entityName: req.body.entityName,
              entityImage:req.body.entityImage
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
            message: "Admin Registered",
            user: newUser,
          });
        });
      })
      .catch(function (err) {
        console.log(err);
        next(err);
      });
  });
};

exports.updateAdmin = function (req, res, next) {
  User.findOne({
    _id: mongoose.Types.ObjectId(req.body.adminId),
  }).then(function (admin) {
    if (!admin) {
      var error = new HttpError("Admin not found", 404);
      return next(error);
    }
    req.body.entityDetails = JSON.parse(req.body.entityDetails);
    req.body.permissions = JSON.parse(req.body.permissions);
    var fileName = "";
    if (req.files) {
      if (!MIME_TYPE_MAP[req.files.image.mimetype]) {
        var error = new HttpError("Invalid image type", 401);
        return next(error);
      }
      fileName = uuidv4() + "." + MIME_TYPE_MAP[req.files.image.mimetype];
      deleteImageFromS3({
        fileName: admin.image,
      });

      admin.image = fileName;
    }
    addImageToS3(req, {
      fileName: fileName,
      data: req.files ? req.files.image.data : "",
    }).then(function () {
      admin.status = req.body.status ? req.body.status : admin.status;
      admin.isdeleted = req.body.isdeleted
        ? req.body.isdeleted
        : admin.isdeleted;
      if (req.body.permissions) {
        admin.permissions = req.body.permissions;
      }
      var details = [];
      if (req.body.entityDetails && req.body.entityDetails.length > 0)
        req.body.entityDetails.forEach(function (entity) {
          details.push({
            entityId: entity._id,
            entityName: entity.name,
            entityImage:entity.image
          });
        });
      admin.entityDetails = details;
      admin
        .save()
        .then(function (newAdmin) {
          res.status(200).json({
            message: "Admin Updated",
            admin: newAdmin,
          });
        })
        .catch(function (err) {
          console.log(err);
          next(err);
        });
    });
  });
};

exports.getAllAdmins = function (req, res, next) {
  Brand.find({ superAdminId: req.user.id }).then(function (brands) {
    if (!brands) {
      var error = new HttpError("Super Admin not found", 404);
      return next(error);
    }
    var ids = [];
    brands.forEach(function (brand) {
      ids.push(brand.id);
    });

    User.aggregate(
      [
        { $unwind: "$entityDetails" },
        {
          $match: {
            "role.roleName": "Admin",
            "role.entity": "Brand",
            "entityDetails.entityId": {
              $in: ids,
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            email: {
              $first: "$email",
            },
            name: {
              $first: "$name",
            },
          },
        },
      ],
      function (err, data) {
        console.log(data);
        res.status(200).json({
          message: "All Admins Fetched",
          admins: data.length == 0 ? [] : data,
        });
      }
    );
  });
};
