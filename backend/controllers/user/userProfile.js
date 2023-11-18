var User = require("../../models/user");
const redis = require("redis");
const HttpError = require("../../models/http-error");
const client = redis.createClient();

exports.userProfile = function (req, res, next) {
  client.hget("users", req.params.userId, function (err, data) {
    data = JSON.parse(data);
    if (data) {
      console.log("Fetched from redis");
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

exports.updateUserProfile = function (req, res, next) {
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
          olduser.name = req.body.name ? req.body.name : olduser.name;
          olduser.email = req.body.email ? req.body.email : olduser.email;
          olduser.password = req.body.password
            ? hashSync(req.body.password, 10)
            : olduser.password;

          olduser
            .save()
            .then(function (newUser) {
              client.hset("users", newUser.id, JSON.stringify(newUser));
              res.status(200).json({
                message: "User Updated",
                user: newUser,
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
