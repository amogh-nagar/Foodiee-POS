var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Role = new Schema({
    isDeleted: { type: Boolean, default: false },
    name: { type: String, required: true },
    permissions: [{
        type: String,
    }],
    parentRole: { type: String, required: true}
})

module.exports = mongoose.Model("Role", Role);