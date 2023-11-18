var mongoose = require("mongoose");
var brand = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  superAdminId: { type: String, required: true },
  isdeleted: { type: Boolean, default: false },
  status: { type: String, default: "active" },
});
module.exports = mongoose.model("Brand", brand);
