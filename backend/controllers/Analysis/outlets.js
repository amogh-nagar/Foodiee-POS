exports.getTop3Outlets = async (req, res, next) => {};

exports.getOutletHourlySales = async (req, res, next) => {};

exports.getAllOutletsTotalSales = async (req, res, next) => {};
var Order = require("../../models/order");
exports.getOutletsSalesReport = function (req, res, next) {
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  var cursor = Order.collection.aggregate(
    [
      {
        $match: {
          "outletDetails.id": {
            $in: req.body.outletIds,
          },
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$outletDetails.id",
          sale: {
            $sum: "$price",
          },
        },
      },
      {
        $project: {
          outletId: "$_id",
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
      message: "Outlets Report",
      report: result,
    });
  });
};

exports.getOutletsHourlySalesReport = function (req, res, next) {
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  var cursor = Order.collection.aggregate([
    {
      $match: {
        "outletDetails.id": {
          $in: req.body.outletIds,
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
        outletDetails: 1,
        _id: 1,
        price: 1,
      },
    },
    {
      $group: {
        _id: { orderDate: "$orderDate", outletId: "$outletDetails.id" },
        outletId: { $first: "$outletDetails.id" },
        sale: {
          $sum: "$price",
        },
      },
    },
    {
      $group: {
        _id: "$_id.outletId",
        sales: {
          $push: { hour: { $toInt: "$_id.orderDate" }, sale: "$sale" },
        },
      },
    },
    {
      $project: {
        outletId: "$_id",
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
      message: "Outlets Report",
      report: result,
    });
  });
};

exports.getTop3ItemsOfOutlets = function (req, res, next) {
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  var cursor = Order.collection.aggregate(
    [
      {
        $match: {
          "outletDetails.id": {
            $in: req.body.outletIds,
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
          outletDetails: 1,
        },
      },
      {
        $unwind: "$dishes",
      },
      {
        $group: {
          _id: { dishId: "$dishes.dishId._id", outletId: "$outletDetails.id" },
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
          _id: "$_id.outletId",
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
          outletId: "$_id",
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
  cursor.on("error", function (doc) {
    handleError(res, {
      message: "Some error occurred",
      statusCode: 500,
    });
  });
  cursor.on("end", function (doc) {
    res.status(200).json(result);
  });
};

exports.getTop3ItemsofOutletsHourlyWise = function (req, res, next) {
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  var cursor = Order.collection.aggregate([
    {
      $match: {
        "outletDetails.id": {
          $in: req.body.outletIds,
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
        outletDetails: 1,
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
          outletId: "$outletDetails.id",
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
        _id: { outletId: "$_id.outletId", orderDate: "$_id.orderDate" },
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
        outletId: "$_id.outletId",
        dishes: { $slice: ["$dishes", 3] },
      },
    },
    {
      $group: {
        _id: "$outletId",
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
        outletId: "$_id",
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
      message: "Brands Report",
      report: result,
    });
  });
};
