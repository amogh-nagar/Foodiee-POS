var mongoose = require("mongoose");
var Order = require("../../models/order");

exports.getBrandsSalesReport = function (req, res, next) {
  let startDate = req.body.startDate ? new Date(req.body.startDate) : new Date().setDate(new Date().getDate() - 1);
  let endDate = req.body.endDate ? new Date(req.body.endDate) : new Date().setDate(new Date().getDate() - 1);
  Order.aggregate(
    [
      {
        $match: {
          "brandDetails.id": {
            $in: req.body.brandIds,
          },
          _created: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: "$brandDetails.id",
          sale: {
            $sum: "$price",
          },
        },
      },
      {
        $project:{
          brandId: "$_id",
          sale: "$sale"
        }
      }
    ],
    function (err, data) {
      if (err) console.log(err);
      res.status(200).json({
        message: "Brands Report",
        report: data,
      });
    }
  );
};

exports.getBrandsHourlySalesReport = function (req, res, next) {
  let startDate = req.body.startDate ? new Date(req.body.startDate) : new Date().setDate(new Date().getDate() - 1);
  let endDate = req.body.endDate ? new Date(req.body.endDate) : new Date().setDate(new Date().getDate() - 1);
  Order.aggregate(
    [
      {
        $match: {
          "brandDetails.id": {
            $in: req.body.brandIds,
          },
          _created: {
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
          brandDetails: 1,
          _id: 1,
          price:1,
        },
      },
      {
        $group: {
          _id: {orderDate:"$orderDate",brandId:"$brandDetails.id"},
          brandId: { $first: "$brandDetails.id" },
          sale: {
            $sum: "$price",
          },
        },
      },
      {
        $group: {
          _id: "$_id.brandId",
          sales: { $push: { hour: { $toInt: "$_id.orderDate" }, sale: "$sale" } },
        },
      },
      {
        $project:{
          brandId: "$_id",

        }
      }
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

exports.getTop3ItemsOfBrands = function(req,res,next){
  let startDate = req.body.startDate ? new Date(req.body.startDate) : new Date().setDate(new Date().getDate() - 1);
  let endDate = req.body.endDate ? new Date(req.body.endDate) : new Date().setDate(new Date().getDate() - 1);
  var cursor = Order.collection.aggregate([
    {
      $match: {
        "brandDetails.id" :{
          $in: req.body.brandIds,
        },
        _created: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $project: {
        dishes: "$dishes",
        _id: 1,
        brandDetails: 1,
      },
    },
    {
      $unwind: "$dishes",
    },
    {
      $group: {
        _id: {dishId: "$dishes.dishId._id", brandId: "$brandDetails.id"},
        dishName: {$first: "$dishes.dishId.name"},
        price: {$sum: "$dishes.price"},
        quantity: {$sum: "$dishes.quantity"},
      },
    },
    {
      $sort: {price: -1, quantity: -1}
    },
    {
      $group:{
        _id: "$_id.brandId",
        dishes:{
          $push:{
            price: "$price",
            quantity: "$quantity",
            dishId: "$_id.dishId"
          }
        }
      }
    }, 
    {
      $project:{
        brandId: "$_id",
        dishes: {$slice: ["$dishes", 3]}
      }
    }
  ],
  {
    cursor: {batchSize: 1000},
    allowDiskUse: true
  });
  let result = [];
  cursor.on("data", function(doc){
    result.push(doc);
  })
  cursor.on("error", function(doc){
    handleError(res, {
      message: "Some error occurred",
      statusCode: 500,
    });
  })
  cursor.on("end", function(doc){
    res.status(200).json(result);
  })
}

exports.getTop3ItemsofBrandsHourlyWise = function (req, res, next) {
  let startDate = req.body.startDate ? new Date(req.body.startDate) : new Date().setDate(new Date().getDate() - 1);
  let endDate = req.body.endDate ? new Date(req.body.endDate) : new Date().setDate(new Date().getDate() - 1);
    Order.aggregate(
      [
        {
          $match: {
            "brandDetails.id" :{
              $in: req.body.brandIds,
            },
            _created: {
              $gte: startDate,
              $lte: endDate,
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
              dishId: "$dishes.dishId._id"
            },
            dishName: {$first: "$dishes.dishId.name"},
            price: {$sum: "$dishes.price"},
            quantity: {$sum: "$dishes.quantity"},
          },
        },    
        {
          $sort: {price: -1, quantity: -1, "$_id.orderDate":1}
        },
        {
          $group: {
            _id: {brandId: "$_id.brandId", orderDate: "$_id.orderDate"},
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
          $project:{
            orderDate: "$_id.orderDate",
            brandId: "$_id.brandId",
            dishes: {$slice: ["$dishes", 3]}
          }
        },
        {
          $group: {
            _id: "$brandId",
            items: {
              $push: {
                orderDate: "$orderDate",
                dishes: "$dishes"
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
