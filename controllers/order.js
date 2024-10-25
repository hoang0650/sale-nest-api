// const {Cart} = require('../models/cart');
const {Order} = require('../models/order');
const {Product} = require('../models/product');
const sendEmail  = require('../config/emailService');

// Lấy danh sách sản phẩm (có hỗ trợ tìm kiếm)
async function getOrder(req, res) {
  const { search } = req.query;

  try {
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { orderId: { $regex: search, $options: 'i' } }, // tìm kiếm theo tên
        ]
      };
    }

    const products = await Order.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Lấy danh sách blog
async function getOrderWithPage(req, res) {
  const { search, page = 1, limit = 100 } = req.query; // Lấy page và limit từ query params, mặc định page = 1, limit = 10

  try {
    let query = {};

    // Xử lý tìm kiếm nếu có tham số `search`
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },  // tìm kiếm theo tiêu đề
          { author: { $regex: search, $options: 'i' } }, // tìm kiếm theo tác giả
          { type: { $regex: search, $options: 'i' } }    // tìm kiếm theo danh mục
        ]
      };
    }

    // Tính toán skip và limit để phân trang
    const skip = (page - 1) * limit;
    
    // Lấy danh sách blog có phân trang
    const blogs = await Order.find(query)
      .sort({ createdAt: -1 }) // -1 để sắp xếp theo thứ tự mới nhất
      .skip(skip)
      .limit(parseInt(limit));

    // Lấy tổng số blog để tính số trang
    const totalCount = await Order.countDocuments(query);

    // Trả về dữ liệu cùng với tổng số bài viết
    res.json({
      blogs,
      totalCount,
      totalPages: Math.ceil(totalCount / limit), // Tổng số trang
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách blog', error: error.message });
  }
}

async function getOrders(req,res) {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'completed', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find the order by _id
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // If the new status is 'completed' and the current status is not 'completed'
    if (status === 'completed' && order.status !== 'completed') {
      // Update the sold count for each product in the order
      for (const item of order.items) {
        await Product.findOneAndUpdate(
          { name: item.name },
          { $inc: { sold: item.quantity } }
        );
      }
    }

    // Update the order status
    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Tiến hành thanh toán
async function Payment (req, res) {
  try {
    const { fullName, phone, address, email, items, discount, subtotal, totalPrice,orderId} = req.body;
    const newOrder = new Order({
      fullName,
      phone,
      address,
      email,
      items,
      discount,
      subtotal,
      totalPrice,
      orderId,  
    });

    await newOrder.save();
    // await Cart.deleteOne();

    // Gửi email xác nhận
    sendEmail(email, newOrder);

    return res.status(201).json({ message: 'Order created successfully', orderId });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating order', error });
  }
};


module.exports = {getOrder,getOrders,getOrderWithPage,updateStatus,Payment};
