var Dish = require("../../../models/dish");
var Brand = require("../../../models/brand");
var Outlet = require("../../../models/outlet");
const HttpError = require("../../../models/http-error");
var io = require("../../../socket");
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const redis = require("redis");
// const client = redis.createClient();
var itemsPerPage = 9;
var async = require("async");
var mongoose = require("mongoose");
exports.getDishes = function (req, res, next) {
  if (req.query.page) req.query.page = +req.query.page;
  Outlet.find({ _id: mongoose.Types.ObjectId(req.params.outletId) }).then(
    function (outlet) {
      if (!outlet) {
        var error = new HttpError("Outlet not found", 404);
        return next(error);
      }
      var brandId = outlet[0].brandDetails.id;

      if (!req.query.page && req.query.page == "undefined") {
        req.query.page = 0;
      }
      var skip = req.query.page
        ? (parseInt(req.query.page) - 1) * itemsPerPage
        : 0;
      async.parallel(
        [
          function (callback) {
            Dish.aggregate(
              [
                { $match: { brandId: brandId } },
                { $skip: skip },
                { $limit: itemsPerPage },
                {
                  $group: {
                    _id: "$brandId",
                    dishes: { $push: "$$ROOT" },
                  },
                },
              ],
              function (err, data) {
                console.log(data);
                callback(null, {
                  dishes: data.length == 0 ? [] : data[0].dishes,
                });
              }
            );
          },
          function (callback) {
            Dish.aggregate(
              [
                { $match: { brandId: brandId } },
                {
                  $group: {
                    _id: "$superCategory.id",
                    superCategory: { $first: "$superCategory.name" },
                    categories: {
                      $push: { name: "$category.name", id: "$category.id" },
                    },
                  },
                },
              ],
              function (err, data) {
                callback(null, { categories: data });
              }
            );
          },
          function (callback) {
            Dish.aggregate(
              [{ $match: { brandId: brandId } }, { $count: "totalItems" }],
              function (err, data) {
                console.log(data);
                callback(null, {
                  totalItems: data[0].totalItems,
                });
              }
            );
          },
        ],
        function (err, data) {
          
          res.status(200).json({
            message: "Dishes Fetched",
            dishes: data[0].dishes,
            brandCategories: data[1].categories,
            totalItems: data[2].totalItems,
          });
        }
      );
    }
  );
};

exports.getCategories = function (req, res, next) {
  Dish.aggregate(
    [
      {
        $match: {
          "superCategory.id": req.params.superCategoryId,
        },
      },
      {
        $group: {
          _id: "$category.id",
          category: { $first: "$categoryId.name" },
        },
      },
    ],
    function (err, data) {
      res.status(200).json({
        message: "Categories Fetched",
        categories: data,
      });
    }
  );
};
