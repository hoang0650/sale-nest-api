var express = require('express');
var router = express.Router();
const {addReview, getReviews} = require('../controllers/review')

// Lấy danh sách sản phẩm
router.get('/:productId', getReviews);

// Thêm một sản phẩm mới (chỉ dùng cho admin, ví dụ)
router.post('/', addReview);

module.exports = router;