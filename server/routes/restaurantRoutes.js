const restaurantController = require('../controllers/restaurantController');
const express = require('express');
const router = express.Router();

router.post('/register', restaurantController.register);

module.exports = router;