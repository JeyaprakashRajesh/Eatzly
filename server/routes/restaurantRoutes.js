const restaurantController = require("../controllers/restaurantController");
const express = require("express");
const { verifyTokenMiddleWare } = require("../utils/jwt");
const router = express.Router();

router.post("/register", restaurantController.register);
router.post("/login", restaurantController.login);
router.get(
  "/get-restaurant",
  verifyTokenMiddleWare,
  restaurantController.getRestaurant
);

module.exports = router;
