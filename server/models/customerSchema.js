const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    tempPhone: {
      type: Number
    },
    username: { 
      type: String, 
      trim: true 
    },
    phone: {
      type: Number,
      unique: true,
      sparse: true
    },
    otp: {
      type: Number
    },
    orders: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Order" 
      }
    ],
    address: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", CustomerSchema);