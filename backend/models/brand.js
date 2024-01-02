var mongoose = require("mongoose");
var brand = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  tenantId: { type: mongoose.Types.ObjectId, required: true },
  isDeleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, {
  timestamps:true
});
module.exports = mongoose.model("Brand", brand);
