const Customer = require("../models/customerSchema");
const Restaurant = require("../models/restaurantScema");
const Menu = require("../models/menuSchema");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
require("dotenv").config();
const mongoose = require("mongoose");
const Order = require("../models/orderSchema");
const Table = require("../models/tableSchema");

function generateToken(phone, res) {
  const JWT_TOKEN = process.env.JWT_SECRET;

  try {
    const token = jwt.sign({ phone: phone }, JWT_TOKEN);
    console.log("Generated Token:", token);
    return token;
  } catch (err) {
    console.log("error while creating token", err);
    return res.status(500).json({ message: "Internal Server Error: " + err });
  }
}

async function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

async function Phone(req, res) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    let customer = await Customer.findOne({
      $or: [{ phone }, { tempPhone: phone }],
    });

    const otp = await generateOTP();

    if (customer) {
      customer.otp = otp;
    } else {
      customer = new Customer({ tempPhone: phone, otp });
    }

    await customer.save();

    console.log(`OTP sent to ${phone}: ${otp}`);

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

const Login = asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;
  console.log(phone, otp);

  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP are required" });
  }

  const customer = await Customer.findOne({
    $or: [{ phone }, { tempPhone: phone }],
  });
  console.log(phone, otp, customer.otp);
  if (!customer || customer.otp !== parseInt(otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (customer.tempPhone) {
    customer.phone = customer.tempPhone;
    customer.tempPhone = undefined;
  }

  customer.otp = undefined;
  await customer.save();
  console.log(customer);
  const token = generateToken(customer.phone);

  return res.status(200).json({ message: "Login successful", token });
});

const getCustomerDetails = async (req, res) => {
  try {
    const { phone } = req.user;

    const customer = await Customer.findOne({ phone });
    console.log(customer);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res
      .status(200)
      .json({ message: "Customer details fetched successfully", customer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const putCustomerDetails = async (req, res) => {
  try {
    const { phone } = req.user;
    const { username, address } = req.body;

    const customer = await Customer.findOne({ phone });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    customer.username = username;
    customer.address = address;
    await customer.save();
    res.status(200).json({
      message: "Customer details updated successfully",
      customer: customer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({
      message: "Restaurants fetched successfully",
      restaurants: restaurants,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getRestaurantMenu = async (req, res) => {
  console.log("inside Try");
  try {
    const { restaurantId } = req.params;
    console.log("restaurantId:", restaurantId);

    const menu = await Menu.findOne({ restaurantId });

    res.status(200).json({ message: "Menu fetched successfully", menu: menu });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const createOrder = async (req, res) => {
  try {
    const { tableId, customerId, restaurantId, items, totalAmount, paymentId } =
      req.body;

    if (!tableId || !customerId || !restaurantId || !items || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing required order fields",
      });
    }

    const newOrder = new Order({
      tableId: mongoose.Types.ObjectId(tableId),
      customerId: mongoose.Types.ObjectId(customerId),
      restaurantId: mongoose.Types.ObjectId(restaurantId),
      items,
      totalAmount,
      paymentId: paymentId ? mongoose.Types.ObjectId(paymentId) : undefined,
    });

    await newOrder.save();

    const table = await Table.findById(tableId);
    if (table) {
      table.status = "occupied";
      await table.save();
    }

    const customer = await Customer.findById(customerId);
    if (customer) {
      customer.orders.push(newOrder._id);
      await customer.save();
    }
    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant) {
      restaurant.orders.push(newOrder._id);
      await restaurant.save();
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating order",
    });
  }
};

const closeOrder = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    order.endTime = new Date();
    await order.save();

    const table = await Table.findById(order.tableId);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    table.status = "available";
    await table.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating order",
    });
  }
};

module.exports = {
  Phone,
  Login,
  getCustomerDetails,
  putCustomerDetails,
  getRestaurants,
  getRestaurantMenu,
  createOrder,
  closeOrder,
};
