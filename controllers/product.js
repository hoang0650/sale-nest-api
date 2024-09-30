const {Product} = require('../models/product');

// Lấy danh sách sản phẩm
async function getProduct (req, res) {
    try {
        const products = await Product.find();
        res.json(products);
      } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// API lấy chi tiết sản phẩm theo ID
async function getProductById (req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
    
        res.json(product);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
};


// Thêm một sản phẩm mới (chỉ dùng cho admin, ví dụ)
async function createProduct (req, res) {
    const { name, description, price, stock, categoryId, imageUrls, variants } = req.body;

  try {
    const product = new Product({
      name,
      description,
      price,
      stock,
      categoryId,
      imageUrls,
      variants
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {getProduct,getProductById,createProduct}
