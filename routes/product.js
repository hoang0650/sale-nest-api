var express = require('express');
var router = express.Router();
const {getProduct, getProductById, getRelated, createProduct, updateProduct, deleteProduct, countClickLink} = require('../controllers/product')
// Lấy danh sách sản phẩm (có hỗ trợ tìm kiếm)
router.get('/', getProduct);

// Lấy chi tiết sản phẩm theo ID
router.get('/:id', getProductById);

// Lấy chi tiết sản phẩm liên quan theo ID
router.get('/related-products/:id', getRelated);

// Thêm một sản phẩm mới (chỉ admin)
router.post('/', createProduct);

// Đếm số lượng click link
router.post('/:id/clicks', countClickLink);

// Cập nhật sản phẩm theo ID (chỉ admin)
router.put('/:id', updateProduct);

// Xóa sản phẩm theo ID (chỉ admin)
router.delete('/:id', deleteProduct);

module.exports = router;
