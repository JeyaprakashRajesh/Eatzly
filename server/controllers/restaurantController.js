const Restaurants = require("../models/restaurantScema");
const { generateToken } = require("../utils/jwt");

const register = async (req, res) => {
  try {
    const {
      phone,
      email,
      name,
      ownerName,
      gstin,
      pan,
      fssai,
      city,
      state,
      pincode,
      coordinates,
    } = req.body.formData;

    if (
      !phone ||
      !email ||
      !name ||
      !ownerName ||
      !gstin ||
      !pan ||
      !fssai ||
      !city ||
      !state ||
      !pincode ||
      !coordinates
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields in registration",
      });
    }

    const existingRestaurant = await Restaurants.findOne({
      $or: [{ email }, { phone: phone }],
    });

    if (existingRestaurant) {
      return res.status(409).json({
        success: false,
        message: "A restaurant with this email or phone number already exists",
      });
    }

    const newRestaurant = new Restaurants({
      name,
      phone,
      email,
      ownerName,
      gstin,
      pan,
      fssai,
      city,
      state,
      pincode,
      coordinates,
    });

    await newRestaurant.save();

    res.status(201).json({
      success: true,
      message: "Restaurant registered successfully",
      restaurant: newRestaurant,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while registering the restaurant",
    });
  }
};

const login = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    console.log(phone, otp);

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const restaurant = await Restaurants.findOne({ phone });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    if (!otp || (Array.isArray(otp) && otp.some((d) => d.trim() === ""))) {
      const generatedOtp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      restaurant.otp = {
        code: generatedOtp,
        createdAt: new Date(),
      };
      await restaurant.save();

      console.log(`🔐 OTP for ${phone}: ${generatedOtp}`);

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully. Valid for 5 minutes.",
      });
    }

    const storedOtp = restaurant.otp;

    if (!storedOtp || !storedOtp.code || !storedOtp.createdAt) {
      return res.status(401).json({
        success: false,
        message: "No OTP generated or already used.",
      });
    }

    const currentTime = new Date();
    const otpCreatedTime = new Date(storedOtp.createdAt);
    const otpIsExpired = currentTime - otpCreatedTime > 5 * 60 * 1000;

    if (storedOtp.code !== (Array.isArray(otp) ? otp.join("") : otp)) {
      return res.status(401).json({
        success: false,
        message: "Incorrect OTP",
      });
    }

    if (otpIsExpired) {
      return res.status(401).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    restaurant.otp = undefined;
    await restaurant.save();

    const token = await generateToken({
      id: restaurant._id,
      role: "restaurant",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      restaurant,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
};

const getRestaurant = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.id) {
      return res.status(400).json({
        success: false,
        message: "Invalid user information provided",
      });
    }

    const restaurant = await Restaurants.findById(user.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant details fetched successfully",
      restaurant,
    });
  } catch (err) {
    console.error("Error fetching restaurant details:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching restaurant details",
    });
  }
};

module.exports = {
  register,
  login,
  getRestaurant,
};
