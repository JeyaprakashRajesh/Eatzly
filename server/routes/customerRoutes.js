const customerController = require('../controllers/customerController');
const express = require('express');
const router = express.Router();

router.post("/phone", customerController.Phone);
 router.post("/otp", customerController.Login);



module.exports = router;