var mongoose = require("mongoose");
var Outlet = require("../../../models/outlet");
var Order = require("../../../models/order");
exports.getAllItemsWithDateReport = function (req, res, next) {
  Order.aggregate(
    [
      {
        $match: {
          "brandDetails.id": req.user.entityDetails[0].entityId,
        },
      },
      {
        $project: {
          dishes: 1,
          _id: 1,
          orderDate: {
            $substr: ["$date", 0, 10],
          },
        },
      },
      {
        $match: {
          orderDate: {
            $gte: req.body.startDate,
            $lte: req.body.endDate,
          },
        },
      },
      {
        $unwind: "$dishes",
      },
      {
        $match: {
          "dishes.dishId._id": {
            $in: req.body.dishIds,
          },
        },
      },
      {
        $group: {
          _id: "$dishes.dishId._id",
          dishName: { $first: "$dishes.dishId.name" },
          count: { $sum: 1 },
        },
      },
    ],
    function (err, data) {
      if (err) console.log(err);

      res.status(200).json({
        message: "Items Report",
        report: data,
      });
      console.log(data);
    }
  );
};

exports.getSpeceficItemsWithDatesReport = function (req, res, next) {
  Order.aggregate(
    [
      {
        $match: {
          "brandDetails.id": req.user.entityDetails[0].entityId,
        },
      },
      {
        $project: {
          dishes: 1,
          _id: 1,
          date: {
            $substr: ["$date", 0, 10],
          },
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
        $match: {
          date: {
            $gte: req.body.startDate,
            $lte: req.body.endDate,
          },
        },
      },
      {
        $unwind: "$dishes",
      },

      {
        $match: {
          "dishes.dishId._id": {
            $in: req.body.dishIds,
          },
        },
      },
      {
        $group: {
          _id: { dishId: "$dishes.dishId._id", hour: "$orderDate" },
          count: { $sum: 1 },
          dish: { $first: "$dishes" },
        },
      },
      {
        $group: {
          _id: "$_id.dishId",
          dish: { $first: "$dish.dishId.name" },
          hours: { $push: { hour: "$_id.hour", count: "$count" } },
        },
      },
      {
        $project: {
          _id: 1,
          dish: 1,
          "hours.hour": 1,
          "hours.count": 1,
        },
      },
    ],
    function (err, data) {
      if (err) console.log(err);
      console.log(data)
      res.status(200).json({
        message: "Items Report",
        report: data,
      });
    }
  );
};

exports.getSpeceficItemsWithDatesReportQuantity = function (req, res, next) {
  Order.aggregate(
    [
      {
        $match: {
          "brandDetails.id": req.user.entityDetails[0].entityId,
        },
      },
      {
        $project: {
          dishes: 1,
          _id: 1,
          date: {
            $substr: ["$date", 0, 10],
          },
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
        $match: {
          date: {
            $gte: req.body.startDate,
            $lte: req.body.endDate,
          },
        },
      },
      {
        $unwind: "$dishes",
      },

      {
        $match: {
          "dishes.dishId._id": {
            $in: req.body.dishIds,
          },
        },
      },
      {
        $group: {
          _id: { dishId: "$dishes.dishId._id", hour: "$orderDate" },
          count: { $sum: "$dishes.quantity" },
          dish: { $first: "$dishes" },
        },
      },
      {
        $group: {
          _id: "$_id.dishId",
          dish: { $first: "$dish.dishId.name" },
          hours: { $push: { hour: "$_id.hour", count: "$count" } },
        },
      },
      {
        $project: {
          _id: 1,
          dish: 1,
          "hours.hour": 1,
          "hours.count": 1,
        },
      },
    ],
    function (err, data) {
      if (err) console.log(err);
      console.log(data)
      res.status(200).json({
        message: "Items Report",
        report: data,
      });
      //   console.log(data);
    }
  );
};
