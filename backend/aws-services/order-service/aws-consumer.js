require("dotenv").config();
const { Consumer } = require("sqs-consumer");
const { receiveMessageOrder } = require("./aws-sqs");
var sqs = require("../sqs");
const AWS = require("aws-sdk");

const app = Consumer.create({
  queueUrl: process.env.SQS_QUEUE_ORDER_URL,
  handleMessageBatch:async (message) => {
    receiveMessageOrder(message[0]);
  },
  batchSize: 1,
  sqs: sqs,
});

app.on("error", (err) => {
  console.error(err.message);
});

app.on("processing_error", (err) => {
  console.error(err.message);
});

app.on("timeout_error", (err) => {
  console.error(err.message);
});

console.log('Order Consumer service is running');
app.start();
