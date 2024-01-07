var mongoose = require("mongoose");
var dish = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    rate: { type: Number, required: true },
    category: {
      id: { type: mongoose.Types.ObjectId, required: true },
      name: { type: String, required: true },
    },
    superCategory: {
      id: { type: mongoose.Types.ObjectId, required: true },
      name: { type: String, required: true },
    },
    brandId: { type: mongoose.Types.ObjectId, required: true },
    isDeleted: { type: Boolean, default: false },
    taxes: [
      {
        id:{type:mongoose.Types.ObjectId,required:true},
        name: { type: String, required: true },
        taxAmount: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Dish", dish);
