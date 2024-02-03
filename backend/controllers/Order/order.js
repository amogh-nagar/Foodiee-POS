var Order = require("../../models/order");
var Outlet = require("../../models/outlet");
const Razorpay = require("razorpay");
const { addToQueueOrder } = require("../../aws-services/order-service/aws-sqs");
const redis = require("redis");
const HttpError = require("../../models/http-error");
var async = require("async");
const crypto = require("crypto");
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

exports.validateRazorPayOrder = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  sha.update(razorpay_order_id + "|" + razorpay_payment_id);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    var err = new HttpError("Invalid Signature", 400);
    return next(err);
  }
  return res.status(200).json({
    message: "Validation Succesfull",
    razorpay_order_id,
    razorpay_payment_id,
  });
};

exports.getRazorPayOrderId = async (req, res, next) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const options = req.body;
    const order = await razorpay.orders.create(options);
    if (!order) {
      let error = new HttpError("Some error occurred", 500);
      return next(error);
    }
    res.status(200).json({
      order,
      message: "RazorPay Order Created",
    });
  } catch (err) {
    next(err);
  }
};

exports.createOrder = function (req, res, next) {
  var {
    name,
    email,
    contact,
    address,
    type,
    date,
    dishes,
    taxAmount,
    totalPrice,
  } = req.body;
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
        customerAddress: address,
        dishes: dishes,
        type: type ? type : "Dining",
        date: date ? date : Date.now(),
        totalTax: taxAmount ?? 0,
        status: "Pending",
        outletDetails: {
          id: outlet._id,
          name: outlet.name,
        },
        brandDetails: {
          id: outlet.brandDetails.id,
          name: outlet.brandDetails.name,
        },
        tenantDetails: {
          id: outlet.tenantDetails.id,
          name: outlet.tenantDetails.name,
        },
        price: +totalPrice,
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
