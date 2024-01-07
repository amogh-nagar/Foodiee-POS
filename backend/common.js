const HttpError = require("./models/http-error");
var s3 = require("./aws-services/aws");
require("dotenv").config();
exports.handleError = (res, err) => {
  return res.status(500).json(new HttpError(err.message, err.statusCode));
};

exports.redis_channels = {
  user_update: "USER_UPDATE",
};

exports.allPagePermissions = [
  "isVisitDashboardPage",
  "isVisitBillingPage",
  "isVisitAnalysisPage",
  "isVisitTenantsPage",
  "isVisitBrandsPage",
  "isVisitDishesPage",
  "isVisitOutletsPage",
  "isVisitUsersPage",
];

exports.rolesMappedToPermissions = [
  "isCreateTenants",
  "isUpdateTenants",
  "isDeleteTenants",
  "isCreatedUser",
  "isUpdateUser",
  "isCreateBrands",
  "isUpdateBrands",
  "isDeleteBrands",
  "isCreateOutlets",
  "isCreateDishes",
  "isCreateTax",
  "isUpdateOutlets",
  "isDeleteOutlets",
  "isUpdateDishes",
  "isDeleteDishes",
  "isUpdateTax",
  "isDeleteTax",
];

exports.deleteImageFromS3 = function (data) {
  if (!data.fileName || data.fileName.length == 0) return;
  var params = { Bucket: process.env.AWS_BUCKET_NAME, Key: data.fileName };
  s3.deleteObject(params, function (err, data) {
    console.log("data", data);
    if (err) {
      console.log(err, err.stack);
      return;
    }
    console.log("Successfully deleted image from s3");
  });
};

exports.addImageToS3 = function (req, details) {
  return new Promise(function (resolve, reject) {
    if (!req.files) {
      resolve();
      return;
    }

    var params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: details.fileName,
      Body: details.data,
    };
    s3.upload(params, function (error, data) {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
};

exports.commaSeparatedString = function (arr, field) {
  return arr.map((val) => val[field]).join(",");
};

exports.projectUser = (user) => {
  user = Object.assign({}, user);
  delete user.password;
  return user;
};

exports.emailTemplates = {
  BLOCK_USER: {
    subject: "User Blocked!",
    text: "User Blocked Successfully",
    html: (user) => {
      return `<div><h1>User Details</h1></div>
            <div><p>Name: ${user.name}</p></div>
            <div><p>Email: ${user.email}</p></div>
            <div><p>Role: ${user.role.entity}-${user.role.roleName}</p></div>
            `;
    },
  },
  "DELETE_USER": {
    subject: "User Deleted!",
    text: "User Deleted Successfully",
    html: (user) => {
      return `<div><h1>User Details</h1></div>
            <div><p>Name: ${user.name}</p></div>
            <div><p>Email: ${user.email}</p></div>
            <div><p>Role: ${user.role.entity}-${user.role.roleName}</p></div>
            `;
    },
  }
};
