const Review = require('../models/review');

// Lấy danh sách đánh giá theo productId
const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ productId }).populate('userId', 'name'); // Populate để lấy thông tin người dùng
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
};

// Tạo mới đánh giá
const addReview = async (req, res) => {
    try {
        const { userId, productId, rating, comment } = req.body;
        const review = new Review({
            userId,
            productId,
            rating,
            comment
        });
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error });
    }
};

module.exports = {
    getReviewsByProduct,
    addReview
};