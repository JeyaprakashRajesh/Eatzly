const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const generateToken = async (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
};

const verifyTokenMiddleWare = (req, res, next) => {
  console.log("verifyTokenMiddleWare");
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({
      success: false,
      message: "Access token missing or malformed",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  generateToken,
  verifyToken,
  verifyTokenMiddleWare,
};
