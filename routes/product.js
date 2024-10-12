var express = require('express');
var router = express.Router();
const {getProduct, getProductById, createProduct, updateProduct, deleteProduct} = require('../controllers/product')
const upload = require('../config/upload')
// Lấy danh sách sản phẩm (có hỗ trợ tìm kiếm)
router.get('/', getProduct);

// Lấy chi tiết sản phẩm theo ID
router.get('/:id', getProductById);

// Thêm một sản phẩm mới (chỉ admin)
router.post('/', upload.array('image[]'), createProduct);

// Cập nhật sản phẩm theo ID (chỉ admin)
router.put('/:id', upload.array('image[]'), updateProduct);

// Xóa sản phẩm theo ID (chỉ admin)
router.delete('/:id', deleteProduct);

module.exports = router;
