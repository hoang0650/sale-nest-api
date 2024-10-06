const { Product } = require('../models/product');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Lấy danh sách sản phẩm (có hỗ trợ tìm kiếm)
async function getProduct(req, res) {
  const { search } = req.query;

  try {
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } }, // tìm kiếm theo tên
          { description: { $regex: search, $options: 'i' } }, // tìm kiếm theo mô tả
          { type: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// API lấy chi tiết sản phẩm theo ID
async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật sản phẩm theo ID
async function updateProduct(req, res) {
  const { id } = req.params;
  const { name, description, price, stock, categoryId, imageUrls, variants } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, stock, categoryId, imageUrls, variants },
      { new: true } // trả về đối tượng đã cập nhật
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Xóa sản phẩm theo ID
async function deleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



// Thêm một sản phẩm mới (chỉ dùng cho admin, ví dụ)
async function createProduct(req, res) {
  const { name, price, description, variants, image } = req.body;
  // const images = req.files.map(file => file.path);  
  // Lấy đường dẫn hình ảnh đã upload
  try {
    const newProduct = {
      name,
      price,
      description,
      image,
      variants: JSON.parse(variants)
    };
  
    // Lưu sản phẩm vào cơ sở dữ liệu
    await Product.create(newProduct)
    res.status(201).json({ message: 'Product created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  getProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}
