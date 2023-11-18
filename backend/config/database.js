var mongoose = require("mongoose");
var url="mongodb://0.0.0.0:27017/foodOrdering";
mongoose
  .connect(url)
  .then(function () {
    console.log(`Database Connected to ${url}`);
  })
  .catch(function (err) {
    console.log(err);
  });
