const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // người dùng viết đánh giá
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, // sản phẩm được đánh giá
    rating: { type: Number, required: true, min: 1, max: 5 }, // đánh giá từ 1 đến 5 sao
    comment: { type: String, required: true }, // nội dung đánh giá
    createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = { Review };