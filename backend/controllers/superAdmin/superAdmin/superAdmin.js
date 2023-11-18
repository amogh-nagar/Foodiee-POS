const { hashSync } = require("bcrypt");
const { addToQueue } = require("../../../aws-services/email-service/aws-sqs");
const {
  deleteImageFromS3,
  addImageToS3,
} = require("../../../aws-services/s3-service/aws-s3");
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
var {v4:uuidv4}=require("uuid")
const HttpError = require("../../../models/http-error");
var User = require("../../../models/user");

exports.createSuperAdmin = function (req, res, next) {
  User.findOne({ email: req.body.email }).then(function (user) {
    if (user) {
      var error = new HttpError("User already exists", 401);
      return next(error);
    }
    var entity, roleName;
    entity = "";
    roleName = "superAdmin";
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
          entityId: "superAdmin",
          entityName: "superAdmin",
        },
      ],
      permissions: [
        "createAdmin",
        "createBrand",
        "updateBrand",
        "readBrand",
        "updateAdmin",
        "readAdmin",
      ],
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
        message: "User Created",
        user: newUser,
      });
    });
  });
};

exports.updateSuperAdmin = function (req, res, next) {
  User.findOne({
    id: req.body.superAdminId,
  }).then(function (superAdmin) {
    if (!superAdmin) {
      var error = new HttpError("SuperAdmin not found", 404);
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
        fileName: superAdmin.image,
      });

      superAdmin.image = fileName;
    }
    addImageToS3(req, {
      fileName: fileName,
      data: req.files ? req.files.image.data : "",
    }).then(function () {
      superAdmin.status = req.body.status ? req.body.status : superAdmin.status;
      superAdmin.isdeleted = req.body.isdeleted
        ? req.body.isdeleted
        : superAdmin.isdeleted;
      if (req.body.permissions) {
        superAdmin.permissions = req.body.permissions;
      }
      superAdmin
        .save()
        .then(function (newSuperAdmin) {
          res.status(200).json({
            message: "Super Admin Updated",
           user: newSuperAdmin,
          });
        })
        .catch(function (err) {
          console.log(err);
          next(err);
        });
    });
  });
};
