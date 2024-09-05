const {Product} = require('../models/product');

// Lấy danh sách sản phẩm
async function getProduct (req, res) {
    const products = await Product.find();
    res.json(products);
};

// Thêm một sản phẩm mới (chỉ dùng cho admin, ví dụ)
async function createProduct (req, res) {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
};

module.exports = {getProduct,createProduct}
