const { hashSync, compareSync } = require("bcrypt");
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
      roleId: { type: mongoose.Types.ObjectId, required: true },
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
user.index({ email: 1 }, { unique: true });

user.pre("save", function (next) {
  this.password = hashSync(this.password, 10);
  next();
});
user.methods.isValidPassword = function (password) {
  console.log("password", password);
  return compareSync(password, this.password);
};
module.exports = mongoose.model("User", user);
