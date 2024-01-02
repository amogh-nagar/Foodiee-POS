var mongoose = require("mongoose");
var outlet = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String },
  brandDetails: {
    id: { type: mongoose.Types.ObjectId, required: true },
    name: { type: String, required: true },
  },
  isDeleted: { type: Boolean, default: false },
  isActive: { type: String, default: true },
});
module.exports = mongoose.model("Outlet", outlet);
