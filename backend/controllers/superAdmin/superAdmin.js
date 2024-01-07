const { hashSync } = require("bcrypt");
const { addToQueue } = require("../../aws-services/email-service/aws-sqs");
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
var {v4:uuidv4}=require("uuid")
const HttpError = require("../../models/http-error");
var User = require("../../models/user");
const { deleteImageFromS3, addImageToS3, commaSeparatedString, projectUser } = require("../../common");


exports.createSuperAdmin = function (req, res, next) {
  let { name, email, password } = req.body;
  User.findOne({ email: req.body.email }).then(function (user) {
    if (user) {
      var error = new HttpError("User already exists", 401);
      return next(error);
    }
    var newUser = new User({
      name: name,
      email: email,
      password: hashSync(password, 10),
      roles: [
        {
          entity: "",
          roleName: "superAdmin",
        },
      ],
      entityDetails: [
        {
          entityId: null,
          entityName: "",
        },
      ],
      permissions: [
        "isVisitUsersPage",
        "isVisitBrandsPage",
        "isVisitDashboardPage",
        "isVisitAnalysisPage",
        "isCreateTenants",
        "isUpdateTenants",
        "isDeleteTenants",
        "isCreatedUser",
        "isUpdateUser",
      ],
    });
    newUser.save().then(function (user) {
      console.log("user is", user);
      addToQueue({
        email: email,
        name: name,
        subject: "Signup success",
        text: "Successfully signed up",
        html: `<div><h1>Welcome to the food Ordering App</h1></div>
              <h3>Here are you credentials</h3>
              <div><p>Name: ${name}</p></div>
              <div><p>Email: ${email}</p></div>
              <div><p>Role: ${commaSeparatedString(
                user.roles,
                "roleName"
              )}</p></div>
              <div><p>Thank you for signing up</p></div>
              `,
      });
      res.status(200).json({
        message: "User Created",
        user: projectUser(user),
      });
    });
  });
};