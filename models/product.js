const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: Number,
    name: { type: String, required: true },
    type: String,
    description: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    shopOwnerId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User'},
    tiktokAffiliateLink: String,
    sold: {
        type: Number,
        default: 0
    },
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
    }],
    createdAt: {
        type: Date,
        default: Date.now
      },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = { Product }