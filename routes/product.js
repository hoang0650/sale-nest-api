var express = require('express');
var router = express.Router();
const {getProduct,createProduct} = require('../controllers/product')

// Lấy danh sách sản phẩm
router.get('/', getProduct);

// Thêm một sản phẩm mới (chỉ dùng cho admin, ví dụ)
router.post('/', createProduct);

module.exports = router;
