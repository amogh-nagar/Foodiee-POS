require("dotenv").config();
var sqs = require("../sqs");
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
var io = require("../../socket");
var Order = require("../../models/order");
const { addToQueue } = require("../email-service/aws-sqs");
function deleteMessage(data) {
  const deleteParams = {
    QueueUrl: process.env.SQS_QUEUE_ORDER_URL,
    ReceiptHandle: data.ReceiptHandle,
  };
  sqs.deleteMessage(deleteParams, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log("Successfully deleted message from queue");
    }
  });
}

function receiveMessage(message) {
  console.log("Message received");
  const details = JSON.parse(message.Body);
  var newOrder = new Order({
    customerName: details.order.customerName,
    customerEmail: details.order.customerEmail,
    customerContact: details.order.customerContact,
    dishes: details.order.dishes,
    type: details.order.orderType,
    totalTax: details.order.totalTax,
    date: details.order.orderDate,
    status: "Done",
    outletDetails: details.order.outletDetails,
    brandDetails: details.order.brandDetails,
    price: +details.order.price + +details.order.totalTax,
  });
  newOrder
    .save()
    .then(function (newOrder) {
      var orderDetails = [];
      orderDetails.push(`Quantity - DishName @ DishPrice `);

      newOrder.dishes.forEach(function (order) {
        orderDetails.push(
          `${order.quantity} - ${order.dishId.name} @ ${order.dishId.price} each`
        );
      });
      addToQueue({
        email: details.order.customerEmail,
        subject: "Order Created!",
        text: "Your Order has been Created",
        html: `<div><h1>Hi ${details.order.customerName},</h1></div>
              <h3>Here are your Order Details</h3>
              <div><p>Total Cost: ${newOrder.price}</p></div>
              <div><p>Order Type: ${newOrder.type}</p></div>
              <div><p>Order Date: ${newOrder.date}</p></div>
              <div><p>Order Status: ${newOrder.status}</p></div>
              <div>Dishes Ordered</div>
              <div>${orderDetails.join("<br>")}</div>
              <div><p>Thank You for using our Outlet</p></div>
              `,
      });
      io.getio().emit("orders", {
        action: "update",
        order: newOrder,
        outlet: details.outlet,
      });

      deleteMessage(message);
    })
    .catch(function (err) {
      console.log(err);
    });
}

exports.addToQueueOrder = function (details) {
  console.log("Adding to queue");
  const params = {
    MessageBody: JSON.stringify(details),
    QueueUrl: process.env.SQS_QUEUE_ORDER_URL,
  };
  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Successfully added Order", data.MessageId);
    }
  });
};

exports.receiveMessageOrder = receiveMessage;
exports.deleteMessageOrder = deleteMessage;
