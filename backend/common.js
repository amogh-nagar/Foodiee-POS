const HttpError = require("./models/http-error");
var s3 = require("./aws-services/aws");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
exports.handleError = (res, err) => {
  return res
    .status(500)
    .json(
      new HttpError(err?.message, err?.statusCode, JSON.stringify(err?.error))
    );
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
  DELETE_USER: {
    subject: "User Deleted!",
    text: "User Deleted Successfully",
    html: (user) => {
      return `<div><h1>User Details</h1></div>
            <div><p>Name: ${user.name}</p></div>
            <div><p>Email: ${user.email}</p></div>
            <div><p>Role: ${user.role.entity}-${user.role.roleName}</p></div>
            `;
    },
  },
  ORDER_CREATED: {
    subject: "Order Created!",
    text: "Your Order has been Created",
    html: (order, orderDetails) => `<div><h1>Hi ${
      order.customerName
    },</h1></div>
              <h3>Here are your Order Details</h3>
              <div><p>Total Cost: ${order.price}</p></div>
              <div><p>Order Type: ${order.type}</p></div>
              <div><p>Order Date: ${order.date}</p></div>
              <div><p>Order Status: ${order.status}</p></div>
              <div>Dishes Ordered</div>
              <div>${orderDetails.join("<br>")}</div>
              <div><p>Thank You for using our Outlet</p></div>
              `,
  },
};

var mongooseIdFields = [
  "brandId",
  "tenantId",
  "dishId",
  "superCategoryId",
  "categoryId",
  "outletId",
  "entityId",
  "orderId",
];
var mongooseIdArrayFields = [
  "brandIds",
  "tenantIds",
  "dishIds",
  "outletIds",
  "entityIds",
  "orderIds",
];
let itemsPerPage = 10;
exports.itemsPerPage = itemsPerPage;
exports.checkAndValidateReq = (req, res, next) => {
  try {
    async.each(mongooseIdFields, (entry, cb) => {
      if (req.query[entry]) {
        req.query[entry] = new mongoose.Types.ObjectId(req.query[entry]);
      }
      if (req.params[entry]) {
        req.params[entry] = new mongoose.Types.ObjectId(req.params[entry]);
      }
      if (req.body[entry]) {
        req.body[entry] = new mongoose.Types.ObjectId(req.body[entry]);
      }
    });
    async.each(mongooseIdArrayFields, (entry, cb) => {
      if (req.query[entry]) {
        req.query[entry] = req.query[entry].map(
          (ele) => new mongoose.Types.ObjectId(ele)
        );
      }
      if (req.body[entry]) {
        req.body[entry] = req.body[entry].map(
          (ele) => new mongoose.Types.ObjectId(ele)
        );
      }
    });
    if (req.query.page) {
      req.query.page = +req.query.page;
      req.query.skip =
        req.query.page && req.query.page != "undefined"
          ? (parseInt(req.query.page) - 1) * itemsPerPage
          : 0;
    } else {
      req.query.page = 0;
      req.query.skip = 0;
    }
    next();
  } catch (err) {
    next(err);
  }
};

exports.validateDateFor1Day = (req, res, next) => {
  try {
    if (req.query.startDate) {
      req.query.startDate = req.body.startDate
        ? new Date(req.body.startDate)
        : new Date().setDate(new Date().getDate() - 1);
    }
    if (req.query.endDate) {
      req.query.startDate = req.body.endDate
        ? new Date(req.body.endDate)
        : new Date();
    }
    next();
  } catch (err) {
    next(err);
  }
};


exports.validateDateFor1Month = (req, res, next) => {
    try {
      if (req.query.startDate) {
        req.query.startDate = req.body.startDate
          ? new Date(req.body.startDate)
          : new Date().setMonth(new Date().getMonth() - 1);
      }
      if (req.query.endDate) {
        req.query.startDate = req.body.endDate
          ? new Date(req.body.endDate)
          : new Date();
      }
      next();
    } catch (err) {
      next(err);
    }
  };

exports.MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
