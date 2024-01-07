var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Role = new Schema({
    isDeleted: { type: Boolean, default: false },
    name: { type: String, required: true },
    description: { type: String, required: true },
    permissions: [{
        type: String,
    }],
    entityId: {type:mongoose.Types.ObjectId, required: true}
})

module.exports = mongoose.Model("Role", Role);