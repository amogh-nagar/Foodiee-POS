var mongoose = require("mongoose");
var Order = require("../../models/order");
const { handleError } = require("../../common");

exports.getTenantsSalesReport = function (req, res, next) {
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  var cursor = Order.collection.aggregate(
    [
      {
        $match: {
          "tenantDetails.id": {
            $in: req.body.tenantIds,
          },
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$tenantDetails.id",
          sale: {
            $sum: "$price",
          },
        },
      },
      {
        $project: {
          tenantId: "$_id",
          sale: "$sale",
        },
      },
    ],
    {
      allowDiskUse: true,
      cursor: { batchSize: 1000 },
    }
  );
  cursor.on("error", (err) => {
    handleError(res, {
      message: "Some error occurred",
      error: err,
      statusCode: 500,
    });
  });
  let result = [];
  cursor.on("data", function (doc) {
    result.push(doc);
  });
  cursor.on("end", function () {
    res.status(200).json({
      message: "Tenants Report",
      report: result,
    });
  });
};

exports.getTenantsHourlySalesReport = function (req, res, next) {
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  var cursor = Order.collection.aggregate([
    {
      $match: {
        "tenantDetails.id": {
          $in: req.body.tenantIds,
        },
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $project: {
        orderDate: {
          $dateToString: {
            format: "%H",
            timezone: "+0530",
            date: "$date",
          },
        },
        tenantDetails: 1,
        _id: 1,
        price: 1,
      },
    },
    {
      $group: {
        _id: { orderDate: "$orderDate", tenantId: "$tenantDetails.id" },
        tenantId: { $first: "$tenantDetails.id" },
        sale: {
          $sum: "$price",
        },
      },
    },
    {
      $group: {
        _id: "$_id.tenantId",
        sales: {
          $push: { hour: { $toInt: "$_id.orderDate" }, sale: "$sale" },
        },
      },
    },
    {
      $project: {
        tenantId: "$_id",
        sales: 1
      },
    },
  ]);
  cursor.on("error", (err) => {
    handleError(res, {
      message: "Some error occurred",
      error: err,
      statusCode: 500,
    });
  });
  let result = [];
  cursor.on("data", function (doc) {
    result.push(doc);
  });
  cursor.on("end", function () {
    res.status(200).json({
      message: "Tenants Report",
      report: result,
    });
  });
};

exports.getTop3ItemsOfTenants = function (req, res, next) {
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  var cursor = Order.collection.aggregate(
    [
      {
        $match: {
          "tenantDetails.id": {
            $in: req.body.tenantIds,
          },
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $project: {
          dishes: "$dishes",
          _id: 1,
          tenantDetails: 1,
        },
      },
      {
        $unwind: "$dishes",
      },
      {
        $group: {
          _id: { dishId: "$dishes.dishId._id", tenantId: "$tenantDetails.id" },
          dishName: { $first: "$dishes.dishId.name" },
          price: { $sum: "$dishes.price" },
          quantity: { $sum: "$dishes.quantity" },
        },
      },
      {
        $sort: { price: -1, quantity: -1 },
      },
      {
        $group: {
          _id: "$_id.tenantId",
          dishes: {
            $push: {
              price: "$price",
              quantity: "$quantity",
              dishId: "$_id.dishId",
            },
          },
        },
      },
      {
        $project: {
          tenantId: "$_id",
          dishes: { $slice: ["$dishes", 3] },
        },
      },
    ],
    {
      cursor: { batchSize: 1000 },
      allowDiskUse: true,
    }
  );
  let result = [];
  cursor.on("data", function (doc) {
    result.push(doc);
  });
  cursor.on("error", function (err) {
    handleError(res, {
      message: "Some error occurred",
      statusCode: 500,
    });
  });
  cursor.on("end", function () {
    res.status(200).json(result);
  });
};

exports.getTop3ItemsofTenantsHourlyWise = function (req, res, next) {
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  var cursor = Order.collection.aggregate([
    {
      $match: {
        "tenantDetails.id": {
          $in: req.body.tenantIds,
        },
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $project: {
        dishes: "$dishes",
        _id: 1,
        tenantDetails: 1,
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
        _id: {
          orderDate: "$orderDate",
          tenantId: "$tenantDetails.id",
          dishId: "$dishes.dishId._id",
        },
        dishName: { $first: "$dishes.dishId.name" },
        price: { $sum: "$dishes.price" },
        quantity: { $sum: "$dishes.quantity" },
      },
    },
    {
      $sort: { price: -1, quantity: -1, "$_id.orderDate": 1 },
    },
    {
      $group: {
        _id: { tenantId: "$_id.tenantId", orderDate: "$_id.orderDate" },
        dishes: {
          $push: {
            dishName: "$dishName",
            price: "$price",
            dishQuantity: "$quantity",
            dishId: "$_id.dishId",
          },
        },
      },
    },
    {
      $project: {
        orderDate: "$_id.orderDate",
        tenantId: "$_id.tenantId",
        dishes: { $slice: ["$dishes", 3] },
      },
    },
    {
      $group: {
        _id: "$tenantId",
        dishes: {
          $push: {
            orderDate: "$orderDate",
            dishes: "$dishes",
          },
        },
      },
    },
    {
      $project: {
        tenantId: "$_id",
        dishes: 1
      }
    }
  ]);
  cursor.on("error", (err) => {
    handleError(res, {
      message: "Some error occurred",
      error: err,
      statusCode: 500,
    });
  });
  let result = [];
  cursor.on("data", function (doc) {
    result.push(doc);
  });
  cursor.on("end", () => {
    res.status(200).json({
      message: "Tenants Report",
      report: result,
    });
  });
};
