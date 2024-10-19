const { Product } = require('../models/product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for handling multiple file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads/products';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  }
}).array('images', 30); // 'images' is the field name, 5 is the max number of files

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
    product.viewCount += 1;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

async function getRelated(req,res){
  const productId = req.params.id;
    const limit = 8; // Giới hạn số lượng sản phẩm liên quan trả về

    try {
        // Gọi hàm getRelatedProducts
        const relatedProducts = await getRelatedProducts(productId, null, limit);
        res.json(relatedProducts);
    } catch (error) {
        res.status(500).send('Error fetching related products');
    }
}

async function getRelatedProducts(productId, type, limit = 8) {
  try {
    // Find the product with the given ID
    const product = await Product.findById(productId);

    if (!product) {
      return [];
    }

    // Get related products based on product type
    const relatedProducts = await Product.find({
      type: product.type,
      _id: { $ne: productId }, // Exclude the current product
    })
      .sort({ clickCount: -1 }) // Sort by click count in descending order
      .limit(limit);

    return relatedProducts;
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

// Cập nhật sản phẩm theo ID
async function updateProduct(req, res) {
  try {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }

      const productData = JSON.parse(req.body.productData);
      const productId = req.params.id;

      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Add new image URLs to the existing ones
      const newImageUrls = req.files.map(file => `https://sale-nest-api.onrender.com/uploads/products/${file.filename}`);
      productData.image = [...existingProduct.image, ...newImageUrls];

      const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true });
      res.json({ message: 'Product updated successfully', product: updatedProduct });
    });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    res.status(500).json({ error: 'Error updating product.' });
  }
}

// Xóa sản phẩm theo ID
async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



// Thêm một sản phẩm mới (chỉ dùng cho admin, ví dụ)
async function createProduct(req, res) {
  try {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }

      const productData = JSON.parse(req.body.productData);

      // Add image URLs to the product data
      productData.image = req.files.map(file => `https://sale-nest-api.onrender.com/uploads/products/${file.filename}`);

      const product = new Product(productData);
      await product.save();

      res.status(201).json({ message: 'Product created successfully', product });
    });
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(500).json({ error: 'Error creating product.' });
  }
};

async function countClickLink(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.clickCount += 1;
    await product.save();
    res.json({ message: 'Click count updated', clickCount: product.clickCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



module.exports = {
  getProduct,
  getProductById,
  getRelated,
  createProduct,
  updateProduct,
  deleteProduct,
  countClickLink
}
