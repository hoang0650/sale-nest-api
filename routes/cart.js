var express = require('express');
var router = express.Router();
const {addToCart,getCart} = require('../controllers/cart')

// Thêm sản phẩm vào giỏ hàng
router.post('/add', addToCart);

// Lấy giỏ hàng
router.get('/', getCart);

module.exports = router;
