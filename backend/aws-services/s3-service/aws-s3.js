require("dotenv").config();
var sqs = require("../sqs");
var s3 = require("../aws");
exports.deleteImageFromS3 = function (data) {
  if (!data.fileName || data.fileName.length == 0) return;
  var params = { Bucket: process.env.AWS_BUCKET_NAME, Key: data.fileName };
  s3.deleteObject(params, function (err, data) {
    console.log("data", data);
    if (err) {
      console.log(err, err.stack);
      return;
    }
    console.log("Successfully deleted image from s3");
  });
};

exports.addImageToS3 = function (req, details) {
  return new Promise(function (resolve, reject) {
    if (!req.files) {
      resolve();
      return;
    }

    var params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: details.fileName,
      Body: details.data,
    };
    s3.upload(params, function (error, data) {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
};
