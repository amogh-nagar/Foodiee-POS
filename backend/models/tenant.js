var mongoose = require("mongoose");
var tenant = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  superAdminId: { type: mongoose.Types.ObjectId, required: true },
  isDeleted: { type: Boolean, default: false },
  isActive: { type: String, default: true },
});
tenant.index({ name: "text" });

module.exports = mongoose.model("Tenant", tenant);
