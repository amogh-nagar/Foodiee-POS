require("dotenv").config();
var express = require("express");
var app = express();
var mongoose = require("mongoose");
const redis = require("redis");
const publisher = redis.createClient();
const subscriber = redis.createClient();
const path = require("path");
const fileUpload = require("express-fileupload");
var mongoose = require("mongoose");
var url = "mongodb://0.0.0.0:27017/foodOrdering";
const passport = require("passport");
const HttpError = require("./models/http-error");
var fs = require("fs");
var port = process.env.PORT || 3030;
const emailConsumer = require("./aws-services/email-service/aws-consumer");
const orderConsmer = require("./aws-services/order-service/aws-consumer");
const { redis_channels } = require("./common");
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded());
require("./config/passport");
require("./firebase");
app.use(fileUpload());
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});
app.use("/api", require("./routes"));
app.use(() => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({
    message: error.message || "An unknown error occurred!",
    statusCode: error.code || 500,
  });
});
mongoose
  .connect(url)
  .then(function () {
    console.log(`Database Connected to ${url}`);
    var server = app.listen(port, function () {
      console.log("Server is running on port " + port);
      emailConsumer();
      orderConsmer();
    });
    var io = require("./socket").init(server);
    io.on("connection", () => {
      console.log("Socket.io establised");
    });
  })
  .catch(function (err) {
    cb(err);
  });

Object.values(redis_channels).forEach((channel) => {
  subscriber.subscribe(channel);
});

subscriber.on("message", (channel, message) => {
  console.log("Received data :" + message + ", channel is" + channel);
  try {
    message = JSON.parse(message);
    if (channel == redis_channels.user_update) {
      subscriber.hset("users", message.id, JSON.stringify(message));
    }
  } catch (err) {
    console.log("Error occurred", err);
  }
});
publisher.on("connect", function () {
  console.log("Redis Publisher Connected!");
});
publisher.on("error", function (err) {
  console.log("Error in Publisher" + err);
});
subscriber.on("connect", function () {
  console.log("Redis Subscribe Connected!");
});
subscriber.on("error", function (err) {
  console.log("Error in Subsciber " + err);
});

// const { prompt } = require("inquirer");
// const inquirer = require("inquirer");
// const figlet = require("figlet");
// const gradient = require("gradient-string");
// const questionsforsignup = [
//   {
//     type: "input",
//     name: "name",
//     message: "Enter your Name",
//   },
//   {
//     type: "input",
//     name: "email",
//     message: "Enter your Email",
//   },
//   {
//     type: "input",
//     name: "password",
//     message: "Enter your Password",
//   },
//   {
//     type: "input",
//     name: "cnfrmpassword",
//     message: "Confirm password",
//   },
// ];
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
