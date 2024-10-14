const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: Number,
    name: { type: String, required: true },
    type: String,
    description: String,
    price: { type: Number, required: true },
    discountPrice: Number,
    tiktokAffiliateLink: String,
    clickCount: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
    },
    image: [String],
    variants: [{
        size: String,
        color: String,
        stock: Number
    }]
});

const Product = mongoose.model('Product', productSchema);
module.exports = { Product }