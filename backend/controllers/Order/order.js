var Order = require("../../models/order");
var Outlet = require("../../models/outlet");
const { addToQueue } = require("../../aws-services/email-service/aws-sqs");
const { addToQueueOrder } = require("../../aws-services/order-service/aws-sqs");
const redis = require("redis");
// const client = redis.createClient();
const HttpError = require("../../models/http-error");
var async = require("async");
var mongoose = require("mongoose");
exports.getOrders = function (req, res, next) {
  async.parallel(
    [
      function (cb) {
        Order.aggregate(
          [
            { $match: { "outletDetails.id": req.params.outletId } },
            { $skip: req.query.skip },
            { $limit: itemsPerPage },
          ],
          function (err, data) {
            if (err) return cb(err);
            cb(null, {
              orders: data.length == 0 ? [] : data,
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
      if (err) return next(err);
      res.status(200).json({
        message: "Orders Fetched",
        orders: data[0].orders,
        totalItems: data[1].totalItems,
      });
    }
  );
};
exports.getOrder = function (req, res, next) {
  Order.findOne({ _id: req.params.orderId })
    .then(function (order) {
      if (!order) {
        var error = new HttpError("Order not found", 404);
        return next(error);
      }
      res.status(200).json({
        message: "Order Fetched",
        order: order,
      });
    })
    .catch(function (err) {
      console.log(err);
      next(err);
    });
};

exports.createOrder = function (req, res, next) {
  var { name, email, contact, type, date } = req.body;
  Outlet.findOne({ _id: req.body.entityId })
    .then(function (outlet) {
      if (!outlet) {
        var error = new HttpError("Oultet not found", 404);
        return next(error);
      }
      let orderDetails = {
        customerName: name,
        customerEmail: email,
        customerContact: contact,
        dishes: req.body.cart.items,
        type: type ? type : "Dining",
        date: date ? date : Date.now(),
        totalTax: +req.body.taxAmount,
        status: "Pending",
        outletDetails: {
          id: req.body.entityId,
          name: req.body.entityName,
        },
        brandDetails: {
          id: outlet.brandDetails.id,
          name: outlet.brandDetails.name,
        },
        tenatDetails: {
          id: outlet.tenantDetails.id,
          name: outlet.tenantDetails.name,
        },
        price: req.body.cart.totalCartPrice,
      };
      addToQueueOrder({
        order: orderDetails,
      });
      res.status(200).json({
        message: "Order Created",
        order: orderDetails,
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
    order.status = req.body.status ? req.body.status : order.status;
    order.customerDetails.email = req.body.customerEmail
      ? req.body.customerEmail
      : order.customerDetails.email;
    order.customerDetails.name = req.body.customerName
      ? req.body.customerName
      : order.customerDetails.name;
    order.customerDetails.contact = req.body.customerContact
      ? req.body.customerContact
      : order.customerDetails.contact;
    order.price =
      req.body.cart.totalCartPrice && req.body.taxAmount
        ? +req.body.cart.totalCartPrice + +req.body.taxAmount
        : order.price;
    order.totalTax = req.body.taxAmount ? +req.body.taxAmount : order.taxAmount;
    order.isDeleted = req.body.isDeleted ? req.body.isDeleted : order.isDeleted;
    order.dishes = req.body.dishes
      ? req.body.cart.items.map((dish) => {
          return {
            dishDetails: {
              id: new mongoose.Types.ObjectId(dish.dishDetails.id),
              name: dish.dishDetails.name,
              rate: +dish.dishDetails.rate,
            },
            price: +dish.price,
            quantity: +dish.quantity,
          };
        })
      : order.dishes;
    order.priority = req.body.priority ? +req.body.priority : order.priority;
    order
      .save()
      .then(function () {
        res.status(200).json({
          message: "Order Updated",
          order: order,
        });
      })
      .catch(function (err) {
        console.log(err);
        next(err);
      });
  });
};

