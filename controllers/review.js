const {Review} = require('../models/review');
const  {Product} = require('../models/product');
const {User} = require('../models/user');

// Lấy danh sách đánh giá theo productId
const getReviewsByProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const reviews = await Review.find({id}).populate('userId', 'username avatar'); // Populate để lấy thông tin người dùng
        console.log('reviews',reviews);
        
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
};

// Tạo mới đánh giá
const addReview = async (req, res) => {
    try {
        const { productId, userId, rating, comment, createdAt } = req.body;
    
        // Kiểm tra xem sản phẩm và người dùng có tồn tại không
        const product = await Product.findById(productId);
        const user = await User.findById(userId);
        
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Tạo một review mới
        const newReview = new Review({
          productId,
          userId,
          rating,
          comment,
          createdAt: createdAt || new Date(),
        });
    
        // Lưu review vào database
        const savedReview = await newReview.save();
    
        // Trả về kết quả
        return res.status(201).json(savedReview);
    
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
      }
};

module.exports = {
    getReviewsByProduct,
    addReview
};