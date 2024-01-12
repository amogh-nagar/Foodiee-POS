const Tax = require("../../models/tax");
exports.createTax = function (req, res, next) {
  Tax.findOne({
    brandId: req.body.brandId,
    name: req.body.name,
  }).then(function (tax) {
    if (tax) {
      var error = new HttpError("Duplicate Tax found", 400);
      return next(error);
    }
    var tax = new Tax({
      name: req.body.name,
      range: {
        to: req.body.to,
        from: req.body.from,
      },
      brandId: req.body.brandId,
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
  });
};
exports.updateTax = function (req, res, next) {
  Tax.findOne({ _id: req.body.taxId }).then(function (oldTax) {
    if (!oldTax) {
      var error = new HttpError("Tax not found", 400);
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
exports.getTaxes = function (req, res, next) {
  Tax.find({ brandId: req.params.brandId })
    .then(function (taxes) {
      res.status(200).json({
        message: "Taxes Fetched",
        taxes: taxes,
      });
    })
    .catch(function (err) {
      console.log(err);
      next(err);
    });
};

exports.getTax = function (req, res, next) {
  Tax.findById(req.params.taxId).then(function (tax) {
    if (!tax) {
      var error = new HttpError("Tax not found", 400);
      return next(error);
    }
    res.status(200).json({
      message: "Tax Fetched",
      tax: tax,
    });
  });
};
