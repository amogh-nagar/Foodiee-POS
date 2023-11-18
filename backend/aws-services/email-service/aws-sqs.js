require("dotenv").config();
var sqs = require("../sqs");
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

function deleteMessage(data) {
  const deleteParams = {
    QueueUrl: process.env.SENDGRID_SQS_QUEUE_EMAIL_URL,
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
  const params = {
    QueueUrl: process.env.SENDGRID_SQS_QUEUE_EMAIL_URL,
    AttributeNames: ["SentTimestamp"],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: ["All"],
    VisibilityTimeout: 10,
    WaitTimeSeconds: 0,
  };
  const details = JSON.parse(message.Body);
  sendGridMail
    .send({
      to: details.email,
      from: "amoghnagar1111@gmail.com",
      subject: details.subject,
      text: details.text,
      html: details.html,
    })
    .then(function () {})
    .catch(function (err) {
      console.log(err);
      deleteMessage(message);
    });
}

exports.addToQueue = function (details) {
  const params = {
    MessageBody: JSON.stringify(details),
    QueueUrl: process.env.SENDGRID_SQS_QUEUE_EMAIL_URL,
  };
  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Successfully added message", data.MessageId);
    }
  });
};

exports.receiveMessage = receiveMessage;
exports.deleteMessage = deleteMessage;
