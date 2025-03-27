const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    tableNo: { type: Number, required: true },
    status: { type: String, enum: ["available", "occupied", "reserved"], default: "available" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", TableSchema);
