const AWS = require("aws-sdk");
const credentials = new AWS.SharedIniFileCredentials({profile: "default"});
AWS.config.credentials = credentials;

const sqs = new AWS.SQS({
    apiVersion: "latest",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1",
  });

module.exports=sqs;