const customerController = require('../controllers/customerController');
const express = require('express');
const router = express.Router();
const { verifyTokenMiddleWare } = require("../utils/jwt");


router.post("/phone", customerController.Phone);
router.post("/otp", customerController.Login);
router.get("/customer-data", verifyTokenMiddleWare, customerController.getCustomerDetails);
router.put("/customer-data", verifyTokenMiddleWare, customerController.putCustomerDetails);
router.get("/restaurants", verifyTokenMiddleWare, customerController.getRestaurants);
router.get('/restaurant-menu/:restaurantId', customerController.getRestaurantMenu);
router.post("/reserve", verifyTokenMiddleWare, customerController.createOrder);
router.get("/complete", verifyTokenMiddleWare, customerController.closeOrder);


module.exports = router;