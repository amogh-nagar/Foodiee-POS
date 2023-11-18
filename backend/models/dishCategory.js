var mongoose = require("mongoose");
var dishCategory = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    dishSuperCategoryId  : { type: String, required: true },
    isdeleted: { type: 
      Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("DishCategory", dishCategory);
