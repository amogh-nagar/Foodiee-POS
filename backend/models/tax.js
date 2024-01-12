var mongoose = require("mongoose");
var tax = new mongoose.Schema({
  name: { type: String, required: true },
  range: {
    to: { type: Number, required: true },
    from: { type: Number, required: true },
  },
  brandId: { type: mongoose.Types.ObjectId, required: true },
});
tax.index({ name: "text" });

module.exports = mongoose.model("Tax", tax);
