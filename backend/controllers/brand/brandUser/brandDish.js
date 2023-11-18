var Dish = require("../../../models/dish");
var Tax = require("../../../models/tax");
const HttpError = require("../../../models/http-error");
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
var mongoose = require("mongoose");
var { v4: uuidv4 } = require("uuid");
var DishSuperCategory = require("../../../models/dishSuperCategory");
var DishCategory = require("../../../models/dishCategory");
const {
  deleteImageFromS3,
  addImageToS3,
} = require("../../../aws-services/s3-service/aws-s3");
var itemsPerPage = 9;
var async = require("async");
exports.getDishes = function (req, res, next) {
  if (req.query.page) req.query.page = +req.query.page;
  var skip =
    req.query.page && req.query.page != "undefined"
      ? (parseInt(req.query.page) - 1) * itemsPerPage
      : 0;
  async.parallel(
    [
      function (callback) {
        Dish.aggregate(
          [
            { $match: { brandId: req.params.brandId } },
            { $skip: skip },
            { $limit: itemsPerPage },
            {
              $group: {
                _id: "$brandId",
                dishes: { $push: "$$ROOT" },
              },
            },
          ],
          function (err, data) {
            callback(null, {
              dishes: data.length == 0 ? [] : data[0].dishes,
            });
          }
        );
      },
      function (callback) {
        Dish.aggregate(
          [
            { $match: { brandId: req.params.brandId } },
            {
              $count: "totalItems",
            },
          ],
          function (err, data) {
            callback(null, {
              totalItems: data.length == 0 ? 0 : data[0].totalItems,
            });
          }
        );
      },
    ],
    function (err, data) {
      res.status(200).json({
        message: "Dishes Fetched",
        dishes: data[0].length == 0 ? [] : data[0].dishes,
        totalItems: data[1].length == 0 ? 0 : data[1].totalItems,
      });
    }
  );
};

exports.getCategories = function (req, res, next) {
  DishCategory.aggregate(
    [
      {
        $match: {
          dishSuperCategoryId: req.params.superCategoryId,
        },
      },
    ],
    function (err, data) {
      res.status(200).json({
        message: "Categories Fetched",
        categories: data,
      });
    }
  );
};
exports.getSuperCategories = function (req, res, next) {
  DishSuperCategory.aggregate(
    [{ $match: { brandId: req.params.brandId } }],
    function (err, data) {
      res.status(200).json({ superCategories: data });
    }
  );
};
exports.getDish = function (req, res, next) {
  Dish.find({ _id: mongoose.Types.ObjectId(req.params.dishId) })
    .then(function (dish) {
      if (!dish) {
        var error = new HttpError("Dish not found", 404);
        return next(error);
      }
      console.log(dish);
      res.status(200).json({
        message: "Dish Fetched",
        dish: dish[0],
      });
    })
    .catch(function (err) {
      console.log(err);
      next(err);
    });
};

exports.createDish = function (req, res, next) {
  var { name, price, description } = req.body;
  var fileName = "";
  if (req.files) {
    if (!MIME_TYPE_MAP[req.files.image.mimetype]) {
      var error = new HttpError("Invalid image type", 401);
      return next(error);
    }
    fileName = uuidv4() + "." + MIME_TYPE_MAP[req.files.image.mimetype];
  }
  addImageToS3(req, {
    fileName: fileName,
    data: req.files ? req.files.image.data : "",
  })
    .then(function () {
      var newDish = new Dish({
        name: name,
        price: price,
        description: description,
        superCategory: {
          id: req.body.superCategoryId,
          name: req.body.superCategoryName,
        },
        category: { id: req.body.categoryId, name: req.body.categoryName },
        image: fileName,
        taxes: JSON.parse(req.body.taxes),
        brandId: req.body.brandId,
      });
      newDish
        .save()
        .then(function (newDish) {
          res.status(200).json({
            message: "Dish Created",
            dish: newDish,
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

exports.updateDish = function (req, res, next) {
  Dish.findOne({ _id: mongoose.Types.ObjectId(req.query.dishId) }).then(
    function (founddish) {
      if (!founddish) {
        var error = new HttpError("Dish not found", 404);
        return next(error);
      }
      console.log(founddish);
      var fileName = "";
      if (req.files) {
        if (!MIME_TYPE_MAP[req.files.image.mimetype]) {
          var error = new HttpError("Invalid image type", 401);
          return next(error);
        }
        fileName = uuidv4() + "." + MIME_TYPE_MAP[req.files.image.mimetype];
        deleteImageFromS3({
          fileName: founddish.image,
        });

        founddish.image = fileName;
      }
      addImageToS3(req, {
        fileName: fileName,
        data: req.files ? req.files.image.data : "",
      })
        .then(function () {
          if (req.body.superCategoryName) {
            founddish.superCategory.name = req.body.superCategoryName;
            founddish.superCategory.id = req.body.superCategoryId;
          }
          if (req.body.categoryName) {
            founddish.category.name = req.body.categoryName;
            founddish.category.id = req.body.categoryId;
          }
          founddish.taxes = req.body.taxes
            ? JSON.parse(req.body.taxes)
            : founddish.taxes;
          founddish.name = req.body.name ? req.body.name : founddish.name;
          founddish.price = req.body.price ? req.body.price : founddish.price;
          founddish.description = req.body.description
            ? req.body.description
            : founddish.description;
          founddish.status = req.body.status
            ? req.body.status
            : founddish.dishStatus;
          founddish.isdeleted = req.body.status
            ? req.body.isdeleted
            : founddish.isdeleted;
          founddish.save().then(function (updatedDish) {
            res.status(200).json({
              message: "Dish Updated",
              dish: updatedDish,
            });
          });
        })
        .catch(function (err) {
          console.log(err);
          next(err);
        });
    }
  );
};

exports.createSuperCategory = function (req, res, next) {
  console.log(req.body);
  var newSuperCategory = new DishSuperCategory({
    name: req.body.name,
    description: req.body.description,
    brandId: req.body.brandId,
  });
  newSuperCategory
    .save()
    .then(function (newSuperCategory) {
      res.status(200).json({
        message: "Dish Super Category Created",
        dishSuperCategory: newSuperCategory,
      });
    })
    .catch(function (err) {
      console.log(err);
      next(err);
    });
};

exports.createCategory = function (req, res, next) {
  DishSuperCategory.find({ id: req.body.superCategoryId }).then(function (
    superCategory
  ) {
    if (!superCategory) {
      var error = new HttpError("Dish Super not found", 404);
      return next(error);
    }
    var newCategory = new DishCategory({
      name: req.body.name,
      description: req.body.description,
      dishSuperCategoryId: req.body.superCategoryId,
    });
    newCategory
      .save()
      .then(function (newCategory) {
        res.status(200).json({
          message: "Dish Category Created",
          dishCategory: newCategory,
        });
      })
      .catch(function (err) {
        console.log(err);
        next(err);
      });
  });
};

exports.createTax = function (req, res, next) {
  console.log(req.body)
  var tax = new Tax({
    name: req.body.name,
    range: {
      to: req.body.to,
      from: req.body.from,
    },
    brandId:req.body.brandId
  });
  tax
    .save()
    .then(function (newTax) {
      res.status(200).json({
        message: "Tax created",
        tax: newTax,
      });
    })
    .catch(function () {
      console.log(err);
      next(err);
    });
};

exports.updateTax = function (req, res, next) {
  Tax.findOne({ name: req.body.oldName }).then(function (oldTax) {
    if (!oldTax) {
      var error = new HttpError("Tax not found", 404);
      return next(error);
    }
    oldTax.name = req.body.name ? req.body.name : oldTax.name;
    oldTax.range.to = req.body.to ? +req.body.to : oldTax.range.to;
    oldTax.range.from = req.body.from ? +req.body.from : oldTax.range.from;
    oldTax
      .save()
      .then(function (newTax) {
        res.status(200).json({
          message: "Tax updated",
          tax: newTax,
        });
      })
      .catch(function (err) {
        console.log(err);
        next(err);
      });
  });
};
exports.taxes=function(req,res,next){
  console.log(req.params)
  Tax.find({brandId:req.params.brandId}).then(function(taxes){
    res.status(200).json({
      message:"Taxes Fetched",
      taxes:taxes
    })
  }).catch(function(err){
    console.log(err);
    next(err);
  })
}