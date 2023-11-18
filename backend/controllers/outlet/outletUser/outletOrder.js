var Order = require("../../../models/order");
var Outlet = require("../../../models/outlet");
const { addToQueue } = require("../../../aws-services/email-service/aws-sqs");
const {
  addToQueueOrder,
} = require("../../../aws-services/order-service/aws-sqs");
const redis = require("redis");
// const client = redis.createClient();
const HttpError = require("../../../models/http-error");
var itemsPerPage = 9;
var async = require("async");
var mongoose = require("mongoose");
exports.getOrders = function (req, res, next) {
  if (req.query.page) req.query.page = +req.query.page;
  var skip =
    req.query.page && req.query.page != "undefined"
      ? (parseInt(req.query.page) - 1) * itemsPerPage
      : 0;

  async.parallel(
    [
      function (cb) {
        Order.aggregate(
          [
            { $match: { "outletDetails.id": req.params.outletId } },
            { $skip: skip },
            { $limit: itemsPerPage },
            {
              $group: {
                _id: "$outletDetails.id",
                orders: { $push: "$$ROOT" },
              },
            },
          ],
          function (err, data) {
            cb(null, {
              orders: data.length == 0 ? [] : data[0].orders,
            });
          }
        );
      },
      function (cb) {
        Order.aggregate(
          [
            { $match: { "outletDetails.id": req.params.outletId } },
            { $count: "totalItems" },
          ],
          function (err, data) {
            cb(null, {
              totalItems: data.length == 0 ? 0 : data[0].totalItems,
            });
          }
        );
      },
    ],
    function (err, data) {
      res.status(200).json({
        message: "Orders Fetched",
        orders: data[0].orders,
        totalItems: data[1].totalItems,
      });
    }
  );
};
exports.getOrder = function (req, res, next) {
  Order.findOne({ _id: req.params.orderId }).then(function (order) {
    if (!order) {
      var error = new HttpError("Order not found", 404);
      return next(error);
    }

    res.status(200).json({
      message: "Order Fetched",
      order: order,
    });
  });
};

exports.createOrder = function (req, res, next) {
  var { name, email, contact, type, date } = req.body;
  // console.log(req.body)
  Outlet.findOne({ _id: mongoose.Types.ObjectId(req.body.entityId) })
    .then(function (outlet) {
      if (!outlet) {
        var error = new HttpError("Oultet not found", 404);
        return next(error);
      }
      addToQueueOrder({
        order: {
          customerName: name,
          customerEmail: email,
          customerContact: contact,
          dishes: req.body.cart.items,
          orderType: type ? type : "Dining",
          orderDate: date ? date : Date.now(),
          totalTax: +req.body.taxAmount,
          orderStatus: "Pending",
          outletDetails: {
            id: req.body.entityId,
            name: req.body.entityName,
          },
          brandDetails: {
            id: outlet.brandDetails.id,
            name: outlet.brandDetails.name,
          },
          price: req.body.cart.totalCartPrice,
        },
        outlet: {
          _id: req.body.entityId,
          userId: req.user._id,
        },
      });
      res.status(200).json({
        message: "Order Created",
        order: {
          customerName: name,
          customerEmail: email,
          customerContact: contact,
          dishes: req.body.cart.items,
          orderType: type ? type : "Dining",
          orderDate: date ? date : Date.now(),
          orderStatus: "Pending",
          outletDetails: {
            id: req.body.outletId,
            name: req.body.outletName,
          },
          brandDetails: {
            id: outlet.brandDetails.id,
            name: outlet.brandDetails.name,
          },
          price: req.body.cart.totalCartPrice,
        },
      });
    })
    .catch(function (err) {
      console.log(err);
      next(err);
    });
};
exports.updateOrder = function (req, res, next) {
  Order.findOne({ _id: req.body.orderId }).then(function (order) {
    if (!order) {
      var error = new HttpError("Outlet not found", 404);
      return next(error);
    }
    order.orderStatus = req.body.orderStatus;
    order.customerEmail = req.body.customerEmail;
    order.customerName = req.body.customerName;
    order.customerContact = req.body.customerContact;
    order.orderType = req.body.orderType;
    order.orderDate = req.body.orderDate;
    order.orderPrice = req.body.orderPrice;
    order.dishes = req.body.dishes;
    order
      .save()
      .then(function (order) {
        res.status(200).json({
          message: "Order Updated",
          order: outlet.orders[idx],
        });
      })
      .catch(function (err) {
        console.log(err);
        next(err);
      });
  });
};
exports.deleteOrder = function (req, res, next) {
  // console.log(req.query.orderId);
  Order.findOneAndDelete({ id: req.params.orderId })
    .then(function () {
      res.status(200).json({
        message: "Order Deleted",
      });
    })
    .catch(function (err) {
      console.log(err);
      next(err);
    });
};

exports.getRecommendedDishes = function (req, res, next) {
  if (req.query.page) req.query.page = +req.query.page;
  var skip =
    req.query.page && req.query.page != "undefined"
      ? (parseInt(req.query.page) - 1) * itemsPerPage
      : 0;
  var condStage = [];
  req.body.dishIds.forEach(function (dish) {
    condStage.push({ $ne: ["$$dish.dishId._id", dish] });
  });
  Order.aggregate(
    [
      {
        $project: {
          dishes: 1,
        },
      },
      {
        $match: {
          "dishes.dishId._id": { $in: req.body.dishIds },
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
          _id: "$dishes.dishId._id",
          dish: { $first: "$dishes.dishId" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 4,
      },
    ],
    function (err, data) {
      res.status(200).json({
        message: "Recommended Dishes Fetched",
        dishes: data,
      });
    }
  );
};
