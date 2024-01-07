var Order = require("../../models/order");

exports.getAllOrdersForAStatus = async (req, res, next) => {
  let query = {
    "outletDetails.id": req.body.outletId,
    date: {
      $gte: req.body.startDate,
      $lte: req.body.endDate,
    },
  };
  if (req.body.status) {
    query["status"] = req.body.status;
  }
  let cursor = Order.collection.aggregate(
    [
      {
        $match: query,
      },
      {
        $project: {
          totalTax: 1,
          customerDetails: 1,
          price: 1,
          tab: 1,
          outletDetails: 1,
          tenantDetails: 1,
          brandDetails: 1,
        },
      },
    ],
    {
      allowDiskUse: true,
      cursor: { batchSize: 1000 },
    }
  );
  let result = [];
  cursor.on("data", (doc) => {
    result.push(doc);
  });
  cursor.on("error", (err) => {
    next(err);
  });
  cursor.on("end", () => {
    res.status(200).json({
      message: "All Pending Order",
      orders: result,
    });
  });
};

exports.getRecommendedDishes = function (req, res, next) {
  var condStage = [];
  req.body.dishIds.forEach(function (dish) {
    condStage.push({ $ne: ["$$dish.dishId._id", dish] });
  });
  Order.aggregate(
    [
      {
        $match: {
          "dishes.dishDetails.id": { $in: req.body.dishIds },
          date: {
            $gte: req.body.startDate,
            $lte: req.body.endDate,
          }
        },
      },
      {
        $project: {
          dishes: {
            $filter: {
              input: "$dishes",
              as: "dish",
              cond: { $and: condStage },
            },
          },
        },
      },
      {
        $unwind: "$dishes",
      },
      {
        $group: {
          _id: "$dishes.dishDetails.id",
          price: { $sum: "$dishes.price" },
          quantity: { $sum: "$dishes.quantity" },
        },
      },
      {
        $sort: {
          price: -1,
          quantity: -1,
        },
      },
      {
        $limit: 4,
      },
    ],
    function (err, data) {
      if (err) return next(err);
      res.status(200).json({
        message: "Recommended Dishes Fetched",
        dishes: data,
      });
    }
  );
};
