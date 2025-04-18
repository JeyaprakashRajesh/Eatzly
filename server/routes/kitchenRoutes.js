const kitchenController = require('../controllers/kitchenController');
const express = require('express');
const { verifyTokenMiddleWare } = require('../utils/jwt');
const router = express.Router();

router.post("/login", kitchenController.login);
router.post("/register", kitchenController.register);
router.get("/verify", kitchenController.verify);
router.get("/orders", kitchenController.getAllOrders);

module.exports =  router; 