const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        total: { type: Number, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    totalAmount: { type: Number, default: 0 },
    status: {
      type: String, 
      enum: ["pending", "preparing", "served"],
      default: "pending",
    },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref : "Payment" },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
  },
  { timestamps: true }          
);  

module.exports = mongoose.model("Order", OrderSchema);
