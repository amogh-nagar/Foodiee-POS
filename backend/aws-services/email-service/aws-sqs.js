require("dotenv").config();
var sqs = require("../sqs");
const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

function deleteMessage(data) {
  const deleteParams = {
    QueueUrl: process.env.AWS_SQS_QUEUE_EMAIL_URL,
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
  sendGridMail
    .send({
      to: details.email,
      from: process.env.SENDGRID_EMAIL,
      subject: details.subject,
      text: details.text,
      html: details.html,
    })
    .then(function () {
      console.log("Succesfully sent message to " + details.email)
    })
    .catch(function (err) {
      console.log("Error occurred", err)
      deleteMessage(message);
    });
}

exports.addToQueue = function (details) {
  const params = {
    MessageBody: JSON.stringify(details),
    QueueUrl: process.env.AWS_SQS_QUEUE_EMAIL_URL,
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
