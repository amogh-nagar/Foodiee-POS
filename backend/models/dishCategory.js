var mongoose = require("mongoose");
var dishCategory = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    dishSuperCategoryId: { type: mongoose.Types.ObjectId, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
dishCategory.index({ name: "text" });
module.exports = mongoose.model("DishCategory", dishCategory);
