var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var user = new Schema({
  isDeleted: { type: Boolean, default: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String },
  roles: [
    {
      entity: { type: String },
      roleName: { type: String, required: true },
    },
  ],
  entityDetails: [
    {
      entityId: { type: mongoose.Types.ObjectId, default: null },
      entityName: { type: String },
      entityImage: { type: String, default: "" },
    },
  ],
  permissions: [{ type: String }],
  isActive: { type: Boolean, default: true },
});
user.index({ email: 1 }, { unique: true });
module.exports = mongoose.model("User", user);
