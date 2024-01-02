var mongoose = require("mongoose");
var table = new mongoose.Schema({
  number: { type: Number, required: true },
  status: { type: String, required: true, default: "free" },
  noOfSeats: { type: Number, required: true },
  outletId: { type: mongoose.Types.ObjectId, required: true },
});
module.exports = mongoose.model("Table", table);
