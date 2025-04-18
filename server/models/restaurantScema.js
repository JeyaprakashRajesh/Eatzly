const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ["veg", "non-veg"] },
    coordinates: { lat: Number, lng: Number },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    ownerName: { type: String, required: true },
    gstin: { type: String, required: true },
    pan: { type: String, required: true },
    fssai: { type: String, required: true },
    bankAccount: {
      accountNumber: { type: String },
      ifscCode: { type: String },
      accountHolderName: { type: String },
    },
    menu: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
    tables: [{ type: mongoose.Schema.Types.ObjectId, ref: "Table" }],
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    rating: { type: Number, default: 0 },
    reviews: [
      {
        customer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Customer",
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
          default: 0,
        },
        review: {
          type: String,
        },
      },
    ],
    reservations: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Reservation" },
    ],
    image: { type: String },
    openingHours: {
      monday: {
        open: { type: String, default: "09:00" },
        close: { type: String, default: "21:00" },
      },
      tuesday: {
        open: { type: String, default: "09:00" },
        close: { type: String, default: "21:00" },
      },
      wednesday: {
        open: { type: String, default: "09:00" },
        close: { type: String, default: "21:00" },
      },
      thursday: {
        open: { type: String, default: "09:00" },
        close: { type: String, default: "21:00" },
      },
      friday: {
        open: { type: String, default: "09:00" },
        close: { type: String, default: "21:00" },
      },
      saturday: {
        open: { type: String, default: "09:00" },
        close: { type: String, default: "21:00" },
      },
      sunday: {
        open: { type: String, default: "09:00" },
        close: { type: String, default: "21:00" },
      },
    },
    tags: [{ type: String }],
    website: { type: String },
    otp: {
      code: { type: String },
      createdAt: { type: Date },
    },
    isOpen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
