
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