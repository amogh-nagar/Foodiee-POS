require("dotenv").config();
var express = require("express");
var app = express();
var mongoose = require("mongoose");
const redis = require("redis");
const client = redis.createClient();
const path = require("path");
const fileUpload = require("express-fileupload");
var mongoose = require("mongoose");
var url = "mongodb://0.0.0.0:27017/foodOrdering";
const passport = require("passport");
const HttpError = require("./models/http-error");
const authRoutes = require("./routes/auth");
var fs = require("fs");
var bodyParser = require("body-parser");
var port = process.env.PORT || 3030;
const emailConsumer = require("./aws-services/email-service/aws-consumer");
const orderConsmer = require("./aws-services/order-service/aws-consumer");
const s3Consumer = require("./aws-services/s3-service/aws-consumer");
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

app.use("/api/auth", authRoutes);

app.use(() => {
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
      s3Consumer();
    });
    var io = require("./socket").init(server);
    io.on("connection", () => {
      console.log("Socket.io establised");
    });
  })
  .catch(function (err) {
    cb(err);
  });

client.on("connect", function () {
  console.log("Redis Connected!");
});
client.on("error", function (err) {
  console.log("Error " + err);
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

