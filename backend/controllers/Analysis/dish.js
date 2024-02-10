exports.getTop3Dishes = async (req, res, next) => {};

exports.getAllDishesTotalSales = async (req, res, next) => {};

exports.getDishHourlySales = async (req, res, next) => {};
var mongoose = require("mongoose");
var Outlet = require("../../models/outlet");
var Order = require("../../models/order");
exports.getTotalSaleDishWise = function (req, res, next) {
  let query = {};
  if (req.user.entityDetails) {
    query["brandDetails.id"] = {
      $in: req.user.entityDetails.map((entity) => {
        return entity.entityId;
      }),
    };
  }
  query["date"] = {
    $gte: req.body.startDate,
    $lte: req.body.endDate,
  };
  if (req.body.dishIds) {
    query["dishes.dishId._id"] = {
      $in: req.body.dishIds,
    };
  }
  Order.aggregate(
    [
      {
        $match: query,
      },
      {
        $project: {
          dishes: 1,
        },
      },
      {
        $unwind: "$dishes",
      },
      {
        $group: {
          _id: "$dishes.dishId._id",
          quantity: { $sum: "$dishes.quantity" },
          price: { $sum: "$dishes.price" },
        },
      },
      {
        $project: {
          dishId: "$_id",
          quantity: "$quantity",
          price: "$price",
        },
      },
    ],
    function (err, data) {
      if (err) return next(err);
      res.status(200).json({
        message: "Dish Wise Total Sale Report",
        report: data,
      });
    }
  );
};

exports.getTotalSaleDishWiseHourly = async (req, res, next) => {
  let query = {};
  if (req.user.entityDetails) {
    query["brandDetails.id"] = {
      $in: req.user.entityDetails.map((entity) => {
        return entity.entityId;
      }),
    };
  }
  query["date"] = {
    $gte: req.body.startDate,
    $lte: req.body.endDate,
  };
  if (req.body.dishIds) {
    query["dishes.dishId._id"] = {
      $in: req.body.dishIds,
    };
  }
  Order.aggregate(
    [
      {
        $match: query,
      },
      {
        $project: {
          dishes: 1,
          _id: 1,
          orderDate: {
            $dateToString: {
              format: "%H",
              timezone: "+0530",
              date: "$date",
            },
          },
        },
      },
      {
        $unwind: "$dishes",
      },
      {
        $group: {
          _id: { dishId: "$dishes.dishId._id", hour: "$orderDate" },
          quantity: { $sum: "$dishes.quantity" },
          price: { $sum: "$dishes.price" },
        },
      },
      {
        $group: {
          _id: "$_id.hour",
          dishes: {
            $push: {
              quantity: "$quantity",
              price: "$price",
              dishId: "$_id.dishId",
            },
          },
        },
      },
      {
        $project: {
          hour: "$_id",
          dishes: 1,
        },
      },
    ],
    function (err, data) {
      if (err) return next(err);
      res.status(200).json({
        message: "Dish Wise Hourly Total Sale Report",
        report: data,
      });
    }
  );
};
