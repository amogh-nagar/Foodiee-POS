var Dish = require("../../models/dish");
const HttpError = require("../../models/http-error");
var mongoose = require("mongoose");
var { v4: uuidv4 } = require("uuid");
var DishSuperCategory = require("../../models/dishSuperCategory");
var DishCategory = require("../../models/dishCategory");
const {
  deleteImageFromS3,
  addImageToS3,
} = require("../../../aws-services/s3-service/aws-s3");
var itemsPerPage = 9;
var async = require("async");
const { handleError, MIME_TYPE_MAP } = require("../../common");
exports.getDishes = function (req, res, next) {
  let query = {};
  if (req.query.brandId) query["brandId"] = req.params.brandId;
  async.parallel(
    [
      function (callback) {
        Dish.aggregate(
          [
            { $match: query },
            { $skip: req.query.skip },
            { $limit: itemsPerPage },
          ],
          function (err, data) {
            if (err) {
              return callback(err);
            }
            callback(null, {
              dishes: data.length == 0 ? [] : data,
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
            if (err) return callback(err);
            callback(null, {
              totalItems: data.length == 0 ? 0 : data[0].totalItems,
            });
          }
        );
      },
    ],
    function (err, data) {
      if (err) {
        return handleError(res, {
          message: "Some error occurred",
          statusCode: 500,
          error: err,
        });
      }
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
      if (err)
        return handleError(res, {
          message: "Some error occurred",
          statusCode: 500,
          error: err,
        });
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
      if (err)
        return handleError(res, {
          message: "Some error occurred",
          statusCode: 500,
          error: err,
        });
      res.status(200).json({ superCategories: data });
    }
  );
};
exports.getDish = function (req, res, next) {
  Dish.find({ _id: req.params.dishId })
    .then(function (dish) {
      if (!dish) {
        var error = new HttpError("Dish not found", 404);
        return next(error);
      }
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
  var { name, rate, description } = req.body;
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
      req.body.taxes = req.body.taxes?.map((tax)=>{
        return {
          id: new mongoose.Types.ObjectId(tax.id),
          name: tax.name,
          taxAmount: +tax.taxAmount
        }
      })
      var newDish = new Dish({
        name: name,
        rate: +rate,
        description: description,
        superCategory: {
          id: req.body.superCategoryId,
          name: req.body.superCategoryName,
        },
        category: { id: req.body.categoryId, name: req.body.categoryName },
        image: fileName,
        taxes: req.body.taxes,
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
  Dish.findOne({ _id: req.query.dishId }).then(
    function (founddish) {
      if (!founddish) {
        var error = new HttpError("Dish not found", 404);
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
            ? req.body.taxes?.map((tax)=>{
              return {
                id: new mongoose.Types.ObjectId(tax.id),
                name: tax.name,
                taxAmount: +tax.taxAmount
              }
            })
            : founddish.taxes;
          founddish.name = req.body.name ? req.body.name : founddish.name;
          founddish.rate = req.body.rate ? req.body.rate : founddish.rate;
          founddish.description = req.body.description
            ? req.body.description
            : founddish.description;
          founddish.isDeleted = req.body.status
            ? req.body.isDeleted
            : founddish.isDeleted;
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
};
exports.updateSuperCategory = async function (req, res, next) {
  try{
    let superCategory = await DishSuperCategory.findById(req.body.superCategoryId);
    superCategory.name = req.body.name ? req.body.name : superCategory.name;
    superCategory.description = req.body.description ? req.body.description : superCategory.description;
    superCategory.brandId = req.body.brandId ? req.body.brandId : superCategory.brandId;
    await superCategory.save();
    res.status(200).json({
      message: "Dish Super Category Created",
      dishSuperCategory: superCategory,
    });
  } catch(err){
    next(err);
  }
};
exports.createCategory = async function (req, res, next) {
  try{
    let category = await DishCategory.findById(req.body.categoryId);
    category.name = req.body.name ? req.body.name : category.name;
    category.description = req.body.description ? req.body.description : category.description;
    category.dishSuperCategoryId = req.body.dishSuperCategoryId ? req.body.dishSuperCategoryId : category.dishSuperCategoryId;
    await category.save();
    res.status(200).json({
      message: "Dish Category Created",
      dishCategory: category,
    });
  } catch(err){
    next(err);
  }
};
