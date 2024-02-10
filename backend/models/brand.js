var mongoose = require("mongoose");
var brand = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    tenantDetails: {
      id: { type: mongoose.Types.ObjectId, required: true },
      name: { type: String },
    },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
brand.index({ name: "text" });
module.exports = mongoose.model("Brand", brand);
