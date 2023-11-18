var mongoose = require("mongoose");
var Order = require("../../../models/order");

exports.getBrandsReport = function (req, res, next) {
  console.log()
  Order.aggregate(
    [
      {
        $match: {
          "brandDetails.id": {
            $in: req.body.brandIds,
          },
        },
      },
      {
        $group: {
          _id: "$brandDetails.id",
          brandName: { $first: "$brandDetails.name" },
          sell: {
            $sum: "$price",
          },
        },
      },
    ],
    function (err, data) {
      if (err) console.log(err);
      res.status(200).json({
        message: "Brands Report",
        report: data,
      });
      console.log(data);
    }
  );
};

exports.getBrandsHourlyReport = function (req, res, next) {
  Order.aggregate(
    [
      {
        $match: {
          "brandDetails.id": {
            $in: req.body.brandIds,
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
          brandDetails: 1,
          _id: 1,
          price:1,
        },
      },

      {
        $group: {
          _id: {orderDate:"$orderDate",brandId:"$brandDetails.id"},
          brandId: { $first: "$brandDetails.id" },
          brandName: { $first: "$brandDetails.name" },
          sell: {
            $sum: "$price",
          },
        },
      },
      {
        $sort: { "_id.orderDate": 1 },
      },
      {
        $group: {
          _id: "$_id.brandId",
          brandName: { $first: "$brandName" },
          hours: { $push: { hour: { $toInt: "$_id.orderDate" }, sell: "$sell" } },
        },
      },
    ],
    function (err, data) {
      if (err) console.log(err);
      res.status(200).json({
        message: "Brands Report",
        report: data,
      });
      console.log(data);
    }
  );
};

exports.getBrandsReportWithDates = function (req, res, next) {
  
  Order.aggregate(
    [
      {
        $match: {
          "brandDetails.id": {
            $in: req.body.brandIds,
          },
        },
      },
      {
        $project: {
          outletDetails: 1,
          _id: 1,
          brandDetails: 1,
          orderDate: {
            $substr: ["$date", 0, 10],
          },
          price:1
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
        $group: {
          _id: "$_id",
          brandName: { $first: "$brandDetails.name" },
          sell: {
            $sum: "$price",
          },
        },
      },
    ],
    function (err, data) {
      if (err) console.log(err);
      res.status(200).json({
        message: "Brands Report",
        report: data,
      });
      console.log(data);
    }
  );
};

exports.getBrandsHourlyReportWithDates = function (req, res, next) {
  
  Order.aggregate(
    [
      {
        $match: {
          "brandDetails.id": {
            $in: req.body.brandIds,
          },
        },
      },
      {
        $project: {
          outletDetails: 1,
          _id: 1,
          brandDetails: 1,
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
          price:1

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
        $group: {
          _id: {orderDate:"$date",brandId:"$_id"},
          brandName: { $first: "$brandDetais.id" },
          sell: {
            $sum: "$price",
          },
        },
      },

      {
        $sort: { "_id.orderDate": 1 },
      },
      {
        $group: {
          _id: "$_id.brandId",
          brandName: { $first: "$brandName" },
          hours: { $push: { hour: { $toInt: "$_id.orderDate" }, sell: "$sell" } },
        },
      },
    ],
    function (err, data) {
      if (err) console.log(err);
      res.status(200).json({
        message: "Brands Report",
        report: data,
      });
      console.log(data);
    }
  );
};

exports.getTop3ItemsofBrandsWithoutDates = function (req, res, next) {
    
    Order.aggregate(
      [
        {
          $match: {
            "brandDetails.id" :{
              $in: req.body.brandIds,
            },
          },
        },
        {
          $project: {
            dishes: "$dishes",
            _id: 1,
            brandDetails: 1,
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
              brandId: "$brandDetails.id",
            },
            brandName: { $first: "$brandDetails.name" },
            dishes: {
              $push: {
                dishName: "$dishes.dishId.name",
                dishPrice: "$dishes.dishId.price",
                dishQuantity: "$dishes.quantity",
                dishId: "$dishes.dishId._id",
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
              orderDate: { $toInt: "$_id.orderDate" },
              brandId: "$_id.brandId",
              dishId: "$dishes.dishId",
            },
            brandName: { $first: "$brandName" },
            dishName: { $first: "$dishes.dishName" },
            dishPrice: { $first: "$dishes.dishPrice" },
            dishImage: { $first: "$dishes.dishImage" },
            dishQuantity: { $sum: "$dishes.dishQuantity" },
          },
        },
        {
          $sort: { dishQuantity: -1 },
        },
        {
          $group: {
            _id: {
              orderDate: "$_id.orderDate",
              brandId: "$_id.brandId",
            },
            brandName: { $first: "$brandName" },
            dishes: {
              $push: {
                dishName: "$dishName",
                dishPrice: "$dishPrice",
                dishQuantity: "$dishQuantity",
                dishId: "$_id.dishId",
                dishImage: "$dishImage",
              },
            },
          },
        },
        {
          $group: {
            _id: "$_id.brandId",
            brandName: { $first: "$brandName" },
            stats: {
              $push: {
                hour: "$_id.orderDate",
                dishes: "$dishes",
              },
            },
          },
        },
        {
          $unwind: "$stats",
        },
        {
          $sort: { "stats.hour": 1 },
        },
        {
          $group: {
            _id: "$_id",
            brandName: { $first: "$brandName" },
            stats: {
              $push: {
                hour: "$stats.hour",
                dishes: "$stats.dishes",
              },
            },
          },
        },
      ],
      function (err, data) {
        if (err) console.log(err);
        res.status(200).json({
          message: "Brands Report",
          report: data,
        });
        console.log(data);
      }
    );   
}

exports.getTop3ItemsofBrandsWithDatesHourly = function (req, res, next) {
  
  Order.aggregate(
    [
      {
        $match: {
          "brandDetails.id": {
            $in: req.body.brandIds,
          },
        },
      },
      {
        $project: {
          dishes: "$dishes",
          _id: 1,
          brandDetails: 1,
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
        $group: {
          _id: {
            orderDate: "$orderDate",
            brandId: "$brandDetails.id",
          },
          brandName: { $first: "$brandDetails.name" },
          dishes: {
            $push: {
              dishName: "$dishes.dishId.dishName",
              dishPrice: "$dishes.dishId.dishPrice",
              dishQuantity: "$dishes.quantity",
              dishId: "$dishes.dishId._id",
              dishImage: "$dishes.dishId.dishImage",
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
            orderDate: { $toInt: "$_id.orderDate" },
            brandId: "$_id.brandId",
            dishId: "$dishes.dishId",
          },
          brandName: { $first: "$brandName" },
          dishName: { $first: "$dishes.dishName" },
          dishPrice: { $first: "$dishes.dishPrice" },
          dishImage: { $first: "$dishes.dishImage" },
          dishQuantity: { $sum: "$dishes.dishQuantity" },
        },
      },
      {
        $sort: { dishQuantity: -1 },
      },
      {
        $group: {
          _id: {
            orderDate: "$_id.orderDate",
            brandId: "$_id.brandId",
          },
          brandName: { $first: "$brandName" },
          dishes: {
            $push: {
              dishName: "$dishName",
              dishPrice: "$dishPrice",
              dishQuantity: "$dishQuantity",
              dishId: "$_id.dishId",
              dishImage: "$dishImage",
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id.brandId",
          brandName: { $first: "$brandName" },
          stats: {
            $push: {
              hour: "$_id.orderDate",
              dishes: "$dishes",
            },
          },
        },
      },
      {
        $unwind: "$stats",
      },
      {
        $sort: { "stats.hour": 1 },
      },
      {
        $group: {
          _id: "$_id",
          brandName: { $first: "$brandName" },
          stats: {
            $push: {
              hour: "$stats.hour",
              dishes: "$stats.dishes",
            },
          },
        },
      },
    ],
    function (err, data) {
      if (err) console.log(err);
      res.status(200).json({
        message: "Brands Report",
        report: data,
      });
      console.log(data);
    }
  );
};
