var mongoose = require("mongoose");
var dish = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    category: {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
    superCategory: {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
    brandId: { type: String, required: true },
    isdeleted: { type: Boolean, default: false },
    taxes: [
      {
        id:{type:String,required:true},
        name: { type: String, required: true },
        percentAmount: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Dish", dish);
