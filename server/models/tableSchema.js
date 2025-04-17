const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    tableName: { type: String, required: true, minlength: 1, maxlength: 1 },
    status: { type: String, enum: ["available", "occupied", "reserved","not-available"], default: "available" },
    capacity: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", TableSchema);
