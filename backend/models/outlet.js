var mongoose = require("mongoose");
var outlet = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String },
  brandDetails: {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
  isdeleted: { type: Boolean, default: false },
  status: { type: String, default: "active" },
});
module.exports = mongoose.model("Outlet", outlet);
