var User = require("../../models/user");
const redis = require("redis");
const HttpError = require("../../models/http-error");
const { redis_channels, handleError, emailTemplates, projectUser, addImageToS3, deleteImageFromS3 } = require("../../common");
const { addToQueue } = require("../../aws-services/email-service/aws-sqs");
const { default: mongoose } = require("mongoose");
const client = redis.createClient();

exports.userProfile = function (req, res, next) {
  client.hget("users", req.params.userId, function (err, data) {
    if (data) {
      console.log("Fetched from redis");
      data = JSON.parse(data);
      res.status(200).json({
        message: "User fetched",
        user: data,
      });
    } else {
      User.findById(req.params.userId)
        .then(function (user) {
          if (!user) {
            var error = new HttpError("User not found", 401);
            return next(error);
          }
          client.hset("users", user.id, JSON.stringify(user));
          res.status(200).json({
            message: "User fetched",
            user: user,
          });
        })
        .catch(function (err) {
          console.log(err);
          next(err);
        });
    }
  });
};

exports.updateUser = function (req, res, next) {
  User.findById(req.params.userId)
    .then(function (olduser) {
      if (!olduser) {
        var error = new HttpError("User not found", 404);
        return next(error);
      }
      var fileName = "";
      if (req.files) {
        if (!MIME_TYPE_MAP[req.files.image.mimetype]) {
          var error = new HttpError("Invalid image type", 401);
          return next(error);
        }
        fileName = uuidv4() + "." + MIME_TYPE_MAP[req.files.image.mimetype];
        deleteImageFromS3({
          fileName: olduser.image,
        });
        olduser.image = fileName;
      }
      addImageToS3(req, {
        fileName: fileName,
        data: req.files ? req.files.image.data : "",
      })
        .then(function () {
          olduser.name = req.body.name ?? olduser.name;
          olduser.email = req.body.email ?? olduser.email;
          olduser.password = req.body.password
            ? req.body.password
            : olduser.password;
          olduser.isActive = req.body.isActive
            ? parseInt(req.body.isActive)
            : olduser.isActive;
          olduser.isDeleted = req.body.isDeleted
            ? parseInt(req.body.isDeleted)
            : olduser.isDeleted;
          if (req.body.permissions) {
            olduser.permissions = req.body.permissions;
          }
          if (req.body.entityDetails) {
            olduser.entityDetails = req.body.entityDetails.map((entity)=>{
              return {
                entityId: new mongoose.Types.ObjectId(entity.entityId),
                entityName: entity.entityName,
              }
            });
          }
          if (req.body.roles) {
            olduser.roles = req.body.roles.map((role)=>{
              return {
                roleId: new mongoose.Types.ObjectId(role.roleId),
                roleName: role.roleName,
              }
            });
          }
          olduser
            .save()
            .then(function (newUser) {
              client.publish(
                redis_channels.user_update,
                JSON.stringify(newUser),
                (err, count) => {
                  if (err) {
                    console.error("Error publishing message:", err);
                  } else {
                    console.log(`Message sent to ${count} subscribers`);
                  }
                }
              );
              res.status(200).json({
                message: "User Updated",
                user: projectUser(newUser),
              });
              addToQueue({
                email: req.body.email,
                subject: "Credentials Updated",
                text: "Your login Credentials have been updated",
                html: `<div><h1>New Credentials are as follows</h1></div>
                            <h3>Here are you New credentials</h3>
                            <div><p>Name: ${req.body.name}</p></div>
                            <div><p>Email: ${req.body.email}</p></div>
                            <div><p>Role: ${newUser.role.entity}-${newUser.role.roleName}</p></div>
                            <div><p>Thank you for signing up</p></div>
                            `,
              });
            })
            .catch(function (err) {
              console.log(err);
              next(err);
            });
        })
        .catch(function (err) {
          console.log(err);
          next(err);
        });
    })
    .catch(function (err) {
      console.log(err);
      next(err);
    });
};

exports.createUser = function (req, res, next) {
  try {
    let {
      email,
      password,
      name,
      roles,
      entityDetails,
      permissions,
    } = req.body;
    User.findOne({
      email: email,
    }).then(function (user) {
      if (user) {
        var error = new HttpError("User already exists", 401);
        return next(error);
      }
      const newUser = new User({
        name: name,
        email: email,
        password: password,
        role: [],
        entityDetails: [],
        permissions: permissions,
      });
      entityDetails && entityDetails.forEach((entity)=>{
        newUser.entityDetails.push({
          entityId: new mongoose.Types.ObjectId(entity.entityId),
          entityName: entity.entityName
        })
      })
      roles && roles.forEach((role)=>{
        newUser.roles.push({
          roleId: new mongoose.Types.ObjectId(role.roleId),
          roleName: role.roleName
        })
      })
      newUser.save().then(function () {
        addToQueue({
          email: email,
          name: name,
          subject: "Signup success",
          text: "Successfully signed up",
          html: `<div><h1>Welcome to the foodiee</h1></div>
              <h3>Here are you credentials</h3>
              <div><p>Name: ${name}</p></div>
              <div><p>Email: ${email}</p></div>
              <div><p>Role: ${newUser.role.entity}-${newUser.role.roleName}</p></div>
              <div><p>Thank you for signing up</p></div>
              `,
        });
        res.status(200).json({
          message: "User Registered",
          user: newUser,
        });
      });
    });
  } catch (err) {
    handleError(res, {
      message: "Some error occurred",
      statusCode: 500,
    });
  }
};

exports.disableUser = async function (req, res, next) {
  try {
    let { userId, type } = req.body;
    let user = await User.findById(userId);
    if (type == "BLOCK_USER") {
      user.isActive = false;
    } else if (type == "DELETE_USER") {
      user.isDeleted = true;
    }
    await user.save();
    if(type == "BLOCK_USER") {
      addToQueue({
        email: req.user.email,
        name: req.user.name,
        subject: emailTemplates["BLOCK_USER"].subject,
        text: emailTemplates["BLOCK_USER"].text,
        html: emailTemplates["BLOCK_USER"].html(user)
      });   
    } else {
      addToQueue({
        email: email,
        name: name,
        subject: emailTemplates["DELETE_USER"].subject,
        text: emailTemplates["DELETE_USER"].text,
        html: emailTemplates["DELETE_USER"].html(user)
      });
    }
    res.status(200).json({
      message: "User Disabled!!",
      user: projectUser(user),
    });
  } catch (err) {
    handleError(res, {
      message: "Some error occurred",
      statusCode: 500,
    });
  }
};
