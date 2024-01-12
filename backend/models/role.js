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

//This Roles will be Predefined
//SuperAdmin, TenantAdmin, BrandAdmin, OutletAdmin

module.exports = mongoose.Model("Role", Role);