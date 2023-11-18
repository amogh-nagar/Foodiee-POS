var mongoose = require("mongoose");
var dishSuperCategory = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    region: { type: String },
    brandId:{type:String,required:true},
    isdeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("DishSuperCategory", dishSuperCategory);
