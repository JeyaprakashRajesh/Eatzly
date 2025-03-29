const customerController = require('../controllers/customerController');
const express = require('express');
const router = express.Router();

router.post('/register', customerController.register);

module.exports = router;