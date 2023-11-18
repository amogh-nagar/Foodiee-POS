var mongoose = require("mongoose");
var order = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerContact: { type: Number, required: true },
    type: { type: String, required: true, default: "Dine In" },
    dishes: [
      {
        dishId: {
          _id:{ type:String, required: true },
          name: { type: String, required: true },
          price: { type: Number, required: true },
          image:{type:String}
        },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    totalTax:{type:Number,default:0},
    status: { type: String, required: true, default: "pending" },
    isdeleted: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    price: { type: Number, default: 0 },
    priority: { type: Number, default: 0 },
    outletDetails: {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
    brandDetails: {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
  },
  { timestamps: true }
);

// order.createIndex( { "dishes.dishId._id": 1 } )

module.exports = mongoose.model("Order", order);
