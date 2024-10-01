var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const {getProduct, getProductById, createProduct, updateProduct, deleteProduct} = require('../controllers/product')

// Lấy danh sách sản phẩm (có hỗ trợ tìm kiếm)
router.get('/', getProduct);

// Lấy chi tiết sản phẩm theo ID
router.get('/:id', getProductById);

// Thêm một sản phẩm mới (chỉ admin)
router.post('/', upload.array('images', 30),createProduct);

// Cập nhật sản phẩm theo ID (chỉ admin)
router.put('/:id', updateProduct);

// Xóa sản phẩm theo ID (chỉ admin)
router.delete('/:id', deleteProduct);

module.exports = router;
