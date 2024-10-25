var express = require('express');
var router = express.Router();
const {getProduct, getProductById, getRelated, getProductWithPage, getProductByRole, createProduct, updateProduct, deleteProduct, countClickLink} = require('../controllers/product')
const {checkRole} = require('../middleware/isAuthenticated')

// Lấy danh sách sản phẩm (có hỗ trợ tìm kiếm)
router.get('/', getProduct);

// Lấy danh sách sản phẩm (có hỗ trợ tìm kiếm, phân trang,)
router.get('/query', getProductWithPage);

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

// GET: Lấy hết các bài Blog
router.get('/role', checkRole, getProductByRole);

module.exports = router;
