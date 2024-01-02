var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var user = new Schema({
  isDeleted: { type: Boolean, default: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String },
  status: { type: String, default: "active" },
  roles: [{
    entity: { type: String },
    roleName: { type: String, required: true },
  }],
  entityDetails: [
    {
      entityId: { type: mongoose.Types.ObjectId, required: true },
      entityName: { type: String, required: true },
      entityImage: { type: String, default: "" },
    },
  ],
  permissions: [{ type: String }],
});
user.index({ email: 1 }, { unique: true });
module.exports = mongoose.model("User", user);
