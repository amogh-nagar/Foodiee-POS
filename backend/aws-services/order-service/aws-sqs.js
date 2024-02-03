require("dotenv").config();
var sqs = require("../sqs");
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
var io = require("../../socket");
var Order = require("../../models/order");
const { addToQueue } = require("../email-service/aws-sqs");
const { default: mongoose } = require("mongoose");
const { emailTemplates } = require("../../common");
function deleteMessage(data) {
  const deleteParams = {
    QueueUrl: process.env.AWS_SQS_QUEUE_ORDER_URL,
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
  const details = JSON.parse(message.Body);
  console.log("details", details)
  let dishes = details?.order?.dishes?.map((dish) => {
    return {
      dishDetails: {
        id: new mongoose.Types.ObjectId(dish.id),
        name: dish.name,
        description: dish.description,
        rate: +dish.rate,
      },
      price: +(dish.rate ?? 0) * +(dish.quantity ?? 0),
      quantity: +dish.quantity,
      comment: dish.comment,
    };
  });

  var newOrder = new Order({
    customerDetails: {
      name: details.order.customerName,
      email: details.order.customerEmail,
      contact: details.order.customerContact,
      address: details.order.customerAddress,
    },
    dishes: dishes,
    totalTax: +details.order.totalTax,
    date: details.order.orderDate,
    status: details.order.status,
    tab: details.order.type,
    outletDetails: {
      id: new mongoose.Types.ObjectId(details.order.outletDetails.id),
      name: details.order.outletDetails.name,
    },
    brandDetails: {
      id: new mongoose.Types.ObjectId(details.order.brandDetails.id),
      name: details.order.brandDetails.name,
    },
    tenantDetails: {
      id: new mongoose.Types.ObjectId(details.order.tenantDetails.id),
      name: details.order.tenantDetails.name,
    },
    price: +details.order.price + +details.order.totalTax,
  });
  newOrder
    .save()
    .then(function (newOrder) {
      var orderDetails = [];
      orderDetails.push(`Quantity - DishName @ DishPrice `);
      newOrder.dishes.forEach(function (dish) {
        orderDetails.push(
          `${dish.quantity} - ${dish.dishDetails.name} @ ${dish.dishDetails.rate} each`
        );
      });
      addToQueue({
        email: details.order.customerEmail,
        subject: emailTemplates.ORDER_CREATED.subject,
        text: emailTemplates.ORDER_CREATED.text,
        html: emailTemplates.ORDER_CREATED.html(details.order, orderDetails),
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
    QueueUrl: process.env.AWS_SQS_QUEUE_ORDER_URL,
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
