const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["veg", "non-veg"], required: true },
    location: {
      address: { type: String, required: true },
      coordinates: { lat: Number, lng: Number },
    },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    ownerName: { type: String, required: true },
    gst: { type: String, required: true },
    pan: { type: String, required: true },
    fssai: { type: String, required: true },
    bankAccount: {
      accountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true },
      accountHolderName: { type: String, required: true },
    },
    menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
    tables: [{ type: mongoose.Schema.Types.ObjectId, ref: "Table" }],
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    rating: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    reservations: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Reservation" },
    ],
    images: [{ type: String }],
    openingHours: {
      monday: {
        open: String,
        close: String,
      },
      tuesday: {
        open: String,
        close: String,
      },
      wednesday: {
        open: String,
        close: String,
      },
      thursday: {
        open: String,
        close: String,
      },
      friday: {
        open: String,
        close: String,
      },
      saturday: {
        open: String,
        close: String,
      },
      sunday: {
        open: String,
        close: String,
      },
    },
    tags: [{ type: String }],
    website: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
