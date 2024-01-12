var mongoose = require("mongoose");
var dishSuperCategory = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    brandId: { type: mongoose.Types.ObjectId, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
dishSuperCategory.index({ name: "text" });
module.exports = mongoose.model("DishSuperCategory", dishSuperCategory);
