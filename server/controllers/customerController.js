const Customer = require('../models/customerSchema');
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
    console.log(phone , otp)
    
  
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }
    
    const customer = await Customer.findOne({ $or: [{ phone }, { tempPhone: phone }] });
    console.log(phone , otp , customer.otp)
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


module.exports={
    Phone,
    Login
}