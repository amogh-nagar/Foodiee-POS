var Order = require("../../models/order");
const { handleError } = require("../../common");
const Tenant = require("../../models/tenant");
exports.getTop3Tenants = async (req, res, next) => {
  try {
    let startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date(new Date().setDate(new Date().getMonth() - 3));
    let endDate = req.query.endDate ? req.query.endDate : new Date();
    let query = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };
    if (req.query.tenantIds) {
      query["tenantDetails.id"] = {
        $in: req.query.tenantIds ?? [],
      };
    }
    var cursor = Order.aggregate([
      {
        $match: query,
      },
      {
        $project: {
          tenantDetails: 1,
          price: 1,
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
        $lookup: {
          from: "tenants",
          let: { tenantId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$tenantId"] } } },
            { $project: { name: 1 } },
          ],
          as: "tenant",
        },
      },
      {
        $sort: {
          sale: -1,
        },
      },
      {
        $limit: 3,
      },
      {
        $project: {
          sale: 1,
          name: "$tenant.name",
          _id: 1,
        },
      },
    ]).cursor({ batchSize: 1000 });
    cursor.on("error", (err) => {
      console.log("err is", err);
      next(err);
    });
    let result = [];
    cursor.on("data", function (doc) {
      result.push(doc);
    });
    cursor.on("end", function () {
      res.status(200).json({
        message: "Tenants Report",
        tenants: result,
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.getActiveInactiveRatioForTenants = async (req, res, next) => {
  try {
    let query = {};
    if (req.query.tenantIds) {
      query["_id"] = {
        $in: req.query.tenantIds ?? [],
      };
    }
    const cursor = Tenant.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: "$isActive",
          count: {
            $sum: 1,
          },
        },
      },
    ]).cursor({ batchSize: 1000 });
    const result = [];
    cursor.on("data", function (doc) {
      console.log("doc is", doc);
      result.push(doc);
    });
    cursor.on("err", function (err) {
      next(err);
    });
    cursor.on("end", function () {
      res.status(200).json({
        message: "Tenants Report",
        tenants: result,
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.getTenantHourlySales = async (req, res, next) => {};

exports.getAllTenantsTotalSales = async (req, res, next) => {};

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
        sales: 1,
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
  let startDate = req.query.startDate
    ? new Date(req.query.startDate)
    : new Date(new Date().setDate(new Date().getMonth() - 3));
  let endDate = req.query.endDate ? req.query.endDate : new Date();
  let query = {
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  };
  if (req.query.tenantIds) {
    query["tenantDetails.id"] = {
      $in: req.query.tenantIds ?? [],
    };
  }
  var cursor = Order.aggregate([
    {
      $match: query,
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
        _id: "$dishes.dishDetails.id",
        name: { $first: "$dishes.dishDetails.name" },
        price: { $sum: "$dishes.price" },
        quantity: { $sum: "$dishes.quantity" },
      },
    },
    {
      $sort: { price: -1, quantity: -1 },
    },
    {
      $limit: 3,
    },
  ]).cursor({ batchSize: 1000 });
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
    res.status(200).json({
      items: result,
    });
  });
};

exports.getMonthWiseTop3TenantsSale = async (req, res, next) => {
  try {
    let startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date(new Date().setDate(new Date().getMonth() - 12));
    let endDate = req.query.endDate ? req.query.endDate : new Date();
    let query = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };
    if (req.query.tenantIds) {
      query["tenantDetails.id"] = {
        $in: req.query.tenantIds ?? [],
      };
    }
    var cursor = Order.aggregate([
      {
        $match: query,
      },
      {
        $project: {
          price: 1,
          month: { $month: "$date" },
          date: 1,
          _id: 1,
          tenantDetails: 1,
        },
      },
      {
        $group: {
          _id: { month: "$month", tenantId: "$tenantDetails.id" },
          name: { $first: { $ifNull: ["$tenantDetails.name", ""] } },
          price: { $sum: "$price" },
          date: { $first: "$date" },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          date: { $first: "$date" },
          tenants: {
            $topN: {
              output: {
                tenantId: "$_id.tenantId",
                tenantName: "$name",
                price: "$price",
              },
              sortBy: { price: -1 },
              n: 3,
            },
          },
        },
      },
      {
        $project: {
          month: "$_id",
          date: 1,
          tenants: 1,
          _id: 0,
        },
      },
    ]).cursor({ batchSize: 1000 });
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
      res.status(200).json({
        result,
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.getHourWiseTop3TenantsSale = async (req, res, next) => {
  try {
    let startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : new Date(new Date().setDate(new Date().getMonth() - 12));
    let endDate = req.query.endDate ? req.query.endDate : new Date();
    let query = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };
    if (req.query.tenantIds) {
      query["tenantDetails.id"] = {
        $in: req.query.tenantIds ?? [],
      };
    }
    var cursor = Order.aggregate([
      {
        $match: query,
      },
      {
        $project: {
          price: 1,
          hour: { $hour: "$date" },
          date: 1,
          _id: 1,
          tenantDetails: 1,
        },
      },
      {
        $group: {
          _id: { hour: "$hour", tenantId: "$tenantDetails.id" },
          name: { $first: { $ifNull: ["$tenantDetails.name", ""] } },
          price: { $sum: "$price" },
          date: { $first: "$date" },
        },
      },
      {
        $group: {
          _id: "$_id.hour",
          date: { $first: "$date" },
          tenants: {
            $topN: {
              output: {
                tenantId: "$_id.tenantId",
                tenantName: "$name",
                price: "$price",
              },
              sortBy: { price: -1 },
              n: 3,
            },
          },
        },
      },
      {
        $project: {
          hour: "$_id",
          date: 1,
          tenants: 1,
          _id: 0,
        },
      },
    ]).cursor({ batchSize: 1000 });
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
      res.status(200).json({
        result,
      });
    });
  } catch (err) {
    next(err);
  }
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
        dishes: 1,
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
  cursor.on("end", () => {
    res.status(200).json({
      message: "Tenants Report",
      report: result,
    });
  });
};
