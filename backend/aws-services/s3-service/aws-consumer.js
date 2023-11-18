require("dotenv").config();
const { Consumer } = require("sqs-consumer");
const { receiveMessage } = require("./aws-sqs");
var sqs = require("../sqs");
const AWS = require("aws-sdk");

const app = Consumer.create({
  queueUrl: process.env.SENDGRID_SQS_QUEUE_S3_URL,
  handleMessageBatch:async (message) => {
    receiveMessage(message[0]);
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

console.log('S3 Consumer service is running');
app.start();
