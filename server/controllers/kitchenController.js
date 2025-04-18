const Orders = require("../models/orderSchema");
const Employee = require("../models/employeeSchema");
const { generateToken, verifyToken } = require("../utils/jwt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }
    const token = await generateToken({
      id: user._id,
      email: user.email,
    });
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, restaurantId } = req.body;
    if (!name || !email || !password || !role || !restaurantId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await Employee.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const newUser = await Employee.create({
      name,
      email,
      password,
      role,
      restaurantId,
    });
    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Restaurant id is required",
      });
    }
    const orders = await Orders.find({ restaurantId });

    if (!orders) {
      return res.status(200).json({
        success: true,
        message: "No orders found",
        orders: [],
      });
    }
    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting all orders",
      error: error.message,
    });
  }
};

const verify = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
      });
    }
    const decoded = await verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    res.status(200).json({
      success: true,
      message: "Token verified",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in verifying token",
      error: error.message,
    });
  }
};

module.exports = {
  getAllOrders,
  login,
  register,
  verify,
};
