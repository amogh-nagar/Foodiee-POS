// var async = require("async");
const { prompt } = require("inquirer");
const figlet = require("figlet");
const inquirer = require("inquirer");
const gradient = require("gradient-string");
var User = require("../models/user");
const { hashSync } = require("bcrypt");
const { addToQueue } = require("../aws-services/email-service/aws-sqs");
const HttpError = require("../models/http-error");
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
module.exports = {
  registerSuperAdmin: function () {
    prompt(questionsforsignup).then(function (answers) {
      if (answers.password !== answers.cnfrmpassword) {
        console.info("Passwords not match");
        return;
      }
      User.findOne({ email: answers.email }).then(function (user) {
        if (user) {
          var error = new HttpError("User already exists", 401);
          console.error(error);
          return;
        }
        var entity, roleName;
        entity = "";
        roleName = "superAdmin";
        var newUser = new User({
          name: answers.name,
          email: answers.email,
          password: hashSync(answers.password, 10),
          role: {
            entity: entity,
            roleName: roleName,
          },
          entityDetails: [
            {
              entityId: "superAdmin",
              entityName: "superAdmin",
            },
          ],
          permissions: [
            "createAdmin",
            "createBrand",
            "updateBrand",
            "readBrand",
            "updateAdmin",
            "readAdmin",
          ],
        });
        newUser.save().then(function (user) {
          addToQueue({
            email: answers.email,
            name: answers.name,
            subject: "Signup success",
            text: "Successfully signed up",
            html: `<div><h1>Welcome to the food Ordering App</h1></div>
              <h3>Here are you credentials</h3>
              <div><p>Name: ${answers.name}</p></div>
              <div><p>Email: ${answers.email}</p></div>
              <div><p>Role: ${newUser.role.entity}-${newUser.role.roleName}</p></div>
              <div><p>Thank you for signing up</p></div>
              `,
          });

          console.info("User registered");
        });
      });

    });
  },
};
