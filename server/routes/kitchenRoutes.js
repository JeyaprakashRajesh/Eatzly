const kitchenController = require('../controllers/kitchenController');
const express = require('express');
const router = express.Router();

router.get("/get-all-orders", kitchenController.getAllOrders);

module.exports =  router;