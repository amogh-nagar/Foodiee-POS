require("dotenv").config();
var sqs = require("../sqs");
var s3 = require("../aws");
function deleteMessage(data) {
  const deleteParams = {
    QueueUrl: process.env.SENDGRID_SQS_QUEUE_S3_URL,
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

function receives3Message(message) {
  const details = JSON.parse(message.Body);
  console.log("Image", details);
  var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: details.fileName,
    Body: details.data,
  };
  s3.upload(params, function (error, data) {
    if (error) {
      console.log(error);
      next(error);
    }
    console.log(data);
    deleteMessage(message);
  });
}

exports.addToQueueImage = function (details) {
  const params = {
    MessageBody: JSON.stringify(details),
    QueueUrl: process.env.SENDGRID_SQS_QUEUE_S3_URL,
  };
  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Successfully added message", data.MessageId);
    }
  });
};

exports.receiveMessage = receives3Message;
exports.deleteMessage = deleteMessage;
