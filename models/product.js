const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: Number,
    name: { type: String, required: true },
    type: String,
    description: String,
    price: { type: Number, required: true },
    discountPrice: Number,
    image: [String],
    variants: [{
        name: String,
        size: String,
        color: String,
        stock: Number
    }]
});

const Product = mongoose.model('Product', productSchema);
module.exports = { Product }