var express = require('express');
var router = express.Router();
const {getProduct,getProductById,createProduct} = require('../controllers/product')

// Lấy danh sách sản phẩm
router.get('/', getProduct);
// Lấy danh sách sản phẩm
router.get('/:id', getProductById);
// Thêm một sản phẩm mới (chỉ dùng cho admin, ví dụ)
router.post('/', createProduct);

module.exports = router;
