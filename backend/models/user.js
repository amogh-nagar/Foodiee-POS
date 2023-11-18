var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var user = new Schema({
  isdeleted: { type: Boolean, default: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String },
  status: { type: String, default: "active" },
  role: {
    entity: { type: String },
    roleName: { type: String, required: true },
  },
  entityDetails: [
    {
      entityId: { type: String, required: true },
      entityName: { type: String, required: true },
      entityImage: { type: String, default: "" },
    },
  ],
  permissions: [{ type: String }],
});
user.index({ email: 1 }, { unique: true });
module.exports = mongoose.model("User", user);
