const { hashSync, compareSync } = require("bcrypt");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var user = new Schema({
  isDeleted: { type: Boolean, default: false },
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: {
    type: String,
    required: true,
  },
  password: { type: String },
  image: { type: String },
  roles: [
    {
      roleId: { type: mongoose.Types.ObjectId },
      roleName: { type: String, required: true },
    },
  ],
  entityDetails: [
    {
      entityId: { type: mongoose.Types.ObjectId, default: null },
      entityName: { type: String },
    },
  ],
  permissions: [{ type: String }],
  isActive: { type: Boolean, default: true },
});
user.index({ email: 1, mobile: 1 }, { unique: true });

user.pre("save", function (next) {
  this.password = hashSync(this.password, 10);
  next();
});
user.methods.isValidPassword = function (password) {
  return compareSync(password, this.password);
};
user.index({ name: "text" });
module.exports = mongoose.model("User", user);
