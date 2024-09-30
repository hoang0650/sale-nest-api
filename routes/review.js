var express = require('express');
var router = express.Router();
const {getReviewsByProduct, addReview} = require('../controllers/review')

// Route để lấy đánh giá của một sản phẩm
router.get('/products/:productId', getReviewsByProduct);

// Route để thêm một đánh giá
router.post('/', addReview);

module.exports = router;