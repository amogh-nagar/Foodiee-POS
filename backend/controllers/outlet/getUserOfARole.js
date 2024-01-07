var User = require("../../models/user");
var s3 = require("../../aws-services/aws");
const { v4: uuidv4 } = require("uuid");
const sendGridMail = require("@sendgrid/mail");
const { hashSync } = require("bcrypt");
const HttpError = require("../../models/http-error");
const { addToQueue } = require("../../aws-services/email-service/aws-sqs");
const redis = require("redis");
// const client = redis.createClient();
const {
  deleteImageFromS3,
  addImageToS3,
} = require("../../../aws-services/s3-service/aws-s3");
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
var itemsPerPage = 9;
exports.getUsersOfARole = function (req, res, next) {
  if(req.query.page)
  req.query.page=+req.query.page
  var skip = req.query.page && req.query.page!='undefined'? (parseInt(req.query.page) - 1) * itemsPerPage : 0;
  console.log(req.params);
  User.aggregate(
    [
      { $unwind: "$entityDetails" },
      {
        $match: {
          "entityDetails.entityId": req.params.outletId,
          "role.roleName": req.params.roleName,
          _id: { $ne: req.user._id },
        },
      },
      { $skip: skip },
      { $limit: itemsPerPage },
      {
        $group: {
          _id: "$role.roleName",

          users: {
            $push: {
              _id: "$_id",
              name: "$name",
              email: "$email",
              role: "$role",
              isdeleted: "$isdeleted",
              status: "$status",
              image: "$image",
            },
          },
        },
      },
    ],
    function (err, data) {
      res.status(200).json({
        message: "Users Fetched",
        users: data.length == 0 ? [] : data[0].users,
      });
    }
  );
};