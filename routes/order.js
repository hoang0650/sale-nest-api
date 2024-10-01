var express = require('express');
var router = express.Router();
const {getOrder,Payment} = require('../controllers/order')

// Tiến hành thanh toán
router.get('/', getOrder);
// Tiến hành thanh toán
router.post('/', Payment);

module.exports = router;
