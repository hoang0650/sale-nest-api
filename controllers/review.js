const Review = require('../models/review');

// POST: Thêm đánh giá mới
async function addReview (req, res) {
    const { userId, productId, rating, comment } = req.body;

    if (!userId || !productId || !rating || !comment) {
        return res.status(400).json({ error: 'Vui lòng điền đủ thông tin' });
    }

    try {
        const newReview = new Review({ userId, productId, rating, comment });
        await newReview.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ error: 'Có lỗi xảy ra khi thêm đánh giá' });
    }
}

// GET: Lấy tất cả đánh giá của một sản phẩm
async function getReviews (req, res) {
    const { productId } = req.params;

    try {
        const reviews = await Review.find({ productId }).populate('userId', 'username'); // populate để lấy thông tin người dùng
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Có lỗi xảy ra khi lấy đánh giá' });
    }
}

module.exports = {
    addReview,
    getReviews
}
