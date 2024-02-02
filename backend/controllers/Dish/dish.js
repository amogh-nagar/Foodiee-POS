var Dish = require("../../models/dish");
const HttpError = require("../../models/http-error");
var mongoose = require("mongoose");
var { v4: uuidv4 } = require("uuid");
var DishSuperCategory = require("../../models/dishSuperCategory");
var DishCategory = require("../../models/dishCategory");
var itemsPerPage = 9;
var async = require("async");
const {
  handleError,
  MIME_TYPE_MAP,
  addImageToS3,
  deleteImageFromS3,
} = require("../../common");
exports.getDishes = function (req, res, next) {
  let query = {};
  var skip = (req.query.page - 1) * itemsPerPage;
  if (req.query.brandId) query["brandId"] = req.query.brandId;
  if (req.query.superCategoryId != "all")
    query["superCategory.id"] = req.query.superCategoryId;
  if (req.query.categoryId != "all")
    query["category.id"] = req.query.categoryId;
  let aggPipeline = [
    { $match: query },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        image: 1,
        rate: 1,
        isActive: 1,
        taxes: 1,
        category: 1,
        superCategory: 1,
        brandId: 1,
      },
    },
    { $skip: skip },
    { $limit: itemsPerPage },
  ];
  if (req.query.getAll) {
    aggPipeline = aggPipeline.slice(0, 2);
    aggPipeline[1]["$project"] = { name: 1, tenantId: 1 };
  }
  let parallelArr = [
    function (callback) {
      Dish.aggregate(aggPipeline, function (err, data) {
        if (err) {
          return callback(err);
        }
        callback(null, {
          dishes: data.length == 0 ? [] : data,
        });
      });
    },
  ];
  if (!req.query.notIncludeTotal) {
    parallelArr.push(function (cb) {
      Dish.aggregate(
        [{ $match: query }, { $count: "totalItems" }],
        function (err, data) {
          if (err) return cb(err);
          cb(null, {
            totalItems: data.length == 0 ? 0 : data[0].totalItems,
          });
        }
      );
    });
  }
  async.parallel(parallelArr, function (err, data) {
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
  });
};
exports.getCategories = function (req, res, next) {
  let query = {};
  var skip = (req.params.page - 1) * itemsPerPage;
  if (req.params.superCategoryId)
    query["dishSuperCategoryId"] = req.params.superCategoryId;
  let aggPipeline = [
    { $match: query },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        image: 1,
      },
    },
    { $skip: skip },
    { $limit: itemsPerPage },
  ];
  if (req.params.getAll) {
    aggPipeline = aggPipeline.slice(0, 2);
    aggPipeline[1]["$project"] = { name: 1, dishSuperCategoryId: 1 };
  }
  let parallelArr = [
    function (callback) {
      DishCategory.aggregate(aggPipeline, function (err, data) {
        if (err) {
          return callback(err);
        }
        callback(null, {
          categories: data.length == 0 ? [] : data,
        });
      });
    },
  ];
  if (!req.params.notIncludeTotal) {
    parallelArr.push(function (cb) {
      DishCategory.aggregate(
        [{ $match: query }, { $count: "totalItems" }],
        function (err, data) {
          if (err) return cb(err);
          cb(null, {
            totalItems: data.length == 0 ? 0 : data[0].totalItems,
          });
        }
      );
    });
  }
  async.parallel(parallelArr, function (err, data) {
    if (err) {
      return handleError(res, {
        message: "Some error occurred",
        statusCode: 500,
        error: err,
      });
    }
    res.status(200).json({
      message: "Categories Fetched",
      categories: data[0].length == 0 ? [] : data[0].categories,
      totalItems: data[1].length == 0 ? 0 : data[1].totalItems,
    });
  });
};
exports.getSuperCategories = function (req, res, next) {
  let query = {};
  var skip = (req.params.page - 1) * itemsPerPage;
  if (req.params.brandId) query["brandId"] = req.params.brandId;
  let aggPipeline = [
    { $match: query },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        image: 1,
      },
    },
    { $skip: skip },
    { $limit: itemsPerPage },
  ];
  if (req.params.getAll) {
    aggPipeline = aggPipeline.slice(0, 2);
    aggPipeline[1]["$project"] = { name: 1, brandId: 1 };
  }
  let parallelArr = [
    function (callback) {
      DishSuperCategory.aggregate(aggPipeline, function (err, data) {
        if (err) {
          return callback(err);
        }
        callback(null, {
          superCategories: data.length == 0 ? [] : data,
        });
      });
    },
  ];
  if (!req.params.notIncludeTotal) {
    parallelArr.push(function (cb) {
      DishSuperCategory.aggregate(
        [{ $match: query }, { $count: "totalItems" }],
        function (err, data) {
          if (err) return cb(err);
          cb(null, {
            totalItems: data.length == 0 ? 0 : data[0].totalItems,
          });
        }
      );
    });
  }
  async.parallel(parallelArr, function (err, data) {
    if (err) {
      return handleError(res, {
        message: "Some error occurred",
        statusCode: 500,
        error: err,
      });
    }
    res.status(200).json({
      message: "superCategories Fetched",
      superCategories: data[0].length == 0 ? [] : data[0].superCategories,
      totalItems: data[1].length == 0 ? 0 : data[1].totalItems,
    });
  });
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

exports.getOutletSuperCategories = async function (req, res, next) {
  let query = {};
  var skip = (req.params.page - 1) * itemsPerPage;
  if (req.params.outletId) {
    var olt = await outlet.findOne({
      _id: req.params.outletId,
    });
    query["brandId"] = olt.brandDetails.id;
  }
  let aggPipeline = [
    { $match: query },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        image: 1,
      },
    },
    { $skip: skip },
    { $limit: itemsPerPage },
  ];
  if (req.params.getAll) {
    aggPipeline = aggPipeline.slice(0, 2);
    aggPipeline[1]["$project"] = { name: 1, brandId: 1 };
  }
  let parallelArr = [
    function (callback) {
      DishSuperCategory.aggregate(aggPipeline, function (err, data) {
        if (err) {
          return callback(err);
        }
        callback(null, {
          superCategories: data.length == 0 ? [] : data,
        });
      });
    },
  ];
  if (!req.params.notIncludeTotal) {
    parallelArr.push(function (cb) {
      DishSuperCategory.aggregate(
        [{ $match: query }, { $count: "totalItems" }],
        function (err, data) {
          if (err) return cb(err);
          cb(null, {
            totalItems: data.length == 0 ? 0 : data[0].totalItems,
          });
        }
      );
    });
  }
  async.parallel(parallelArr, function (err, data) {
    if (err) {
      return handleError(res, {
        message: "Some error occurred",
        statusCode: 500,
        error: err,
      });
    }
    res.status(200).json({
      message: "superCategories Fetched",
      superCategories: data[0].length == 0 ? [] : data[0].superCategories,
      totalItems: data[1].length == 0 ? 0 : data[1].totalItems,
    });
  });
};

exports.createDish = function (req, res, next) {
  var { name, rate, description } = req.body;
  Dish.findOne({
    "superCategory.id": req.body.superCategoryId,
    "category.id": req.body.categoryId,
    brandId: req.body.brandId,
    name: name,
  }).then(function (result) {
    if (result) {
      const error = new HttpError("Duplicate Dish Found", 400);
      return next(error);
    }

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
        req.body.taxes =
          req.body.taxes?.map((tax) => {
            return {
              id: new mongoose.Types.ObjectId(tax.id),
              name: tax.name,
              taxAmount: +tax.taxAmount,
            };
          }) || [];
        var newDish = new Dish({
          name: name,
          rate: +rate,
          description: description,
          superCategory: {
            id: req.body.superCategoryId,
            name: req.body.superCategoryName,
          },
          category: {
            id: req.body.categoryId,
            name: req.body.categoryName,
          },
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
  });
};
exports.updateDish = function (req, res, next) {
  Dish.findOne({ _id: req.body.dishId }).then(function (founddish) {
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
          ? req.body.taxes?.map((tax) => {
              return {
                id: new mongoose.Types.ObjectId(tax.id),
                name: tax.name,
                taxAmount: +tax.taxAmount,
              };
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
  });
};
exports.createSuperCategory = function (req, res, next) {
  DishSuperCategory.findOne({
    name: req.body.name,
    brandId: req.body.brandId,
  }).then(function (newSuperCtg) {
    if (newSuperCtg) {
      var err = new HttpError("Duplicate Super Category Found", 400);
      return next(err);
    }

    var newSuperCategory = new DishSuperCategory({
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
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
  });
};
exports.createCategory = function (req, res, next) {
  DishCategory.findOne({
    dishSuperCategoryId: req.body.superCategoryId,
    name: req.body.name,
  }).then(function (result) {
    if (result) {
      var err = new HttpError("Duplicate Category Found!", 400);
      return next(err);
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
exports.updateCategory = function (req, res, next) {
  DishCategory.findOne({
    _id: {
      $ne: req.body.categoryId,
    },
    dishSuperCategoryId: req.body.superCategoryId,
    name: req.body.name,
  }).then(function (result) {
    if (result) {
      var err = new HttpError("Duplicate Category Found!", 400);
      return next(err);
    }
    DishCategory.findById(req.body.categoryId).then(function (ctg) {
      if (!ctg) {
        var err = new HttpError("Category Not Found!", 400);
        return next(err);
      }
      ctg.name = req.body.name ?? ctg.name;
      ctg.description = req.body.description ?? ctg.description;
      ctg
        .save()
        .then(function (newCtg) {
          res.status(200).json({
            message: "Dish Category Updated Succesfully",
            category: newCtg,
          });
        })
        .catch(function (err) {
          next(err);
        });
    });
  });
};
exports.updateSuperCategory = async function (req, res, next) {
  try {
    let superCategory = await DishSuperCategory.findById(
      req.body.superCategoryId
    );
    superCategory.name = req.body.name ? req.body.name : superCategory.name;
    superCategory.description = req.body.description
      ? req.body.description
      : superCategory.description;
    superCategory.brandId = req.body.brandId
      ? req.body.brandId
      : superCategory.brandId;
    await superCategory.save();
    res.status(200).json({
      message: "Dish Super Category Created",
      dishSuperCategory: superCategory,
    });
  } catch (err) {
    next(err);
  }
};
