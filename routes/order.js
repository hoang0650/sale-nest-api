var express = require('express');
var router = express.Router();
const {getOrder,getOrders, getOrderWithPage ,updateStatus,Payment} = require('../controllers/order')

// Tiến hành thanh toán
router.get('/', getOrder);

router.get('/query', getOrderWithPage);

router.get('/all', getOrders)

router.put('/:id',updateStatus);
// Tiến hành thanh toán
router.post('/', Payment);

module.exports = router;
