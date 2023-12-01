var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Role = new Schema({
    isDeleted: { type: Boolean, default: false },
    name: { type: String, required: true },
    permissions: [{
        type: String,
    }],
    
})

module.exports = mongoose.Model("Role", Role);