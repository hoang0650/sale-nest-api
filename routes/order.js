var express = require('express');
var router = express.Router();
const {Payment} = require('../controllers/order')

// Tiến hành thanh toán
router.post('/', Payment);

module.exports = router;
