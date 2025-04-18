const Customer = require('../models/customerSchema');
const Restaurant = require("../models/restaurantScema")
const Menu = require("../models/menuSchema")
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
require('dotenv').config();

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

    let customer = await Customer.findOne({ $or: [{ phone }, { tempPhone: phone }] });

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
  console.log(phone, otp)


  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP are required" });
  }

  const customer = await Customer.findOne({ $or: [{ phone }, { tempPhone: phone }] });
  console.log(phone, otp, customer.otp)
  if (!customer || customer.otp !== parseInt(otp)) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (customer.tempPhone) {
    customer.phone = customer.tempPhone;
    customer.tempPhone = undefined;
  }

  customer.otp = undefined;
  await customer.save();
  console.log(customer)
  const token = generateToken(customer.phone);

  return res.status(200).json({ message: "Login successful", token });
});

const getCustomerDetails = async (req, res) => {
  try {
    const { phone } = req.user
    
    const customer = await Customer.findOne({ phone });
    console.log(customer)
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    res.status(200).json({ message: "Customer details fetched successfully", customer })
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
  
  
}

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
    res.status(200).json({ message: "Customer details updated successfully" , customer : customer}); 
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

const getRestaurants = async(req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({ message: "Restaurants fetched successfully", restaurants : restaurants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

const getRestaurantMenu = async (req, res) => {
  console.log("inside Try");
  try {
    const { restaurantId } = req.params; 
    console.log("restaurantId:", restaurantId);

    const menu = await Menu.findOne({ restaurantId });

    res.status(200).json({ message: "Menu fetched successfully", menu : menu });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  Phone,
  Login,
  getCustomerDetails,
  putCustomerDetails,
  getRestaurants,
  getRestaurantMenu
}