require("dotenv").config();
var express = require("express");
var async = require("async");
var app = express();
var mongoose = require("mongoose");
const { prompt } = require("inquirer");
const figlet = require("figlet");
const redis = require("redis");
const client = redis.createClient();
const { Consumer } = require("sqs-consumer");
const { receiveMessageOrder } = require("./aws-services/order-service/aws-sqs");
var sqs = require("./aws-services/sqs");
const path = require("path");
const fileUpload = require("express-fileupload");
const inquirer = require("inquirer");
const gradient = require("gradient-string");
var mongoose = require("mongoose");
const { registerSuperAdmin } = require("./helper/superAdminCLI");
var url = "mongodb://0.0.0.0:27017/foodOrdering";
const passport = require("passport");
const HttpError = require("./models/http-error");
const superAdminRoutes = require("./routes/superAdmin");
const brandRoutes = require("./routes/brandUser");
const outletRoutes = require("./routes/outletUser");
const reportRoutes = require("./routes/report");
const userRoutes = require("./routes/user");
var fs = require("fs");
var bodyParser = require("body-parser");
const { receiveMessage } = require("./aws-services/email-service/aws-sqs");
const { receives3Message } = require("./aws-services/s3-service/aws-sqs");
var port = process.env.PORT || 3000;
require("./aws-services/email-service/aws-consumer");
require("./aws-services/s3-service/aws-consumer");
app.use(passport.initialize());
require("./config/passport");

app.use(fileUpload());
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/superAdmin", superAdminRoutes);
app.use("/brand", brandRoutes);
app.use("/outlet", outletRoutes);
app.use("/report", reportRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  console.log(error);
  res.status(error.code || 500);
  res.json({
    message: error.message || "An unknown error occurred!",
    statusCode: error.code || 500,
  });
});
const questionsforsignup = [
  {
    type: "input",
    name: "name",
    message: "Enter your Name",
  },
  {
    type: "input",
    name: "email",
    message: "Enter your Email",
  },
  {
    type: "input",
    name: "password",
    message: "Enter your Password",
  },
  {
    type: "input",
    name: "cnfrmpassword",
    message: "Confirm password",
  },
];
mongoose
  .connect(url)
  .then(function () {
    console.log(`Database Connected to ${url}`);
    var server = app.listen(port, function () {
      console.log("Server is running on port " + port);

      const order = Consumer.create({
        queueUrl: process.env.SQS_QUEUE_ORDER_URL,
        handleMessage: (message) => {
          console.log("consumer sqs message")
          receiveMessageOrder(message);
        },
        sqs: sqs,
      });
      order.start();
      order.on("error", (err) => {
        console.error(err.message);
      });
      order.on("processing_error", (err) => {
        console.error(err.message);
      });
      order.on("timeout_error", (err) => {
        console.log(err.message);
      });
      console.log("Order Consumer service is running");

      const email = Consumer.create({
        queueUrl: process.env.SENDGRID_SQS_QUEUE_EMAIL_URL,
        handleMessage: (message) => {
          receiveMessage(message);
        },
        sqs: sqs,
      });
      email.start();
      email.on("error", (err) => {
        console.error(err.message);
      });
      email.on("processing_error", (err) => {
        console.error(err.message);
      });
      email.on("timeout_error", (err) => {
        console.log(err.message);
      });
      console.log("Email Consumer service is running");

      const s3app = Consumer.create({
        queueUrl: process.env.SENDGRID_SQS_QUEUE_S3_URL,
        handleMessage: (message) => {
          receives3Message(message);
        },
        sqs: sqs,
      });
      s3app.start();
      s3app.on("error", (err) => {
        console.error(err.message);
      });
      s3app.on("processing_error", (err) => {
        console.error(err.message);
      });
      s3app.on("timeout_error", (err) => {
        console.log(err.message);
      });

      console.log("S3 Consumer service is running");
     
    });
    var io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("Socket.io establised");
    });
  })
  .catch(function (err) {
    cb(err);
  });

// async.series(
//   [
//     function (cb) {
//       figlet("Food Ordering", function (err, data) {
//         console.log(gradient.pastel.multiline(data));
//         cb(null, "Excuted");
//       });
//     },
//     function (cb) {
//       prompt({
//         type: "input",
//         name: "choice",
//         message: "Enter 1 to create a Super Admin ,2 to Exit ",
//       }).then(function (answers) {
//         if (answers.choice === "1") {
//           registerSuperAdmin();
//           cb(null, "Excuted");
//         } else {
//           cb(null, "Excuted");
//         }
//       });
//     },
//   ],
//   function (err, callback) {
//     if (err) {
//       console.log(err);
//       return;
//     }
//   }
// );

client.on("connect", function () {
  console.log("Redis Connected!");
});
client.on("error", function (err) {
  console.log("Error " + err);
});
