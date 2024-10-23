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


module.exports = {getOrder,getOrders,updateStatus,Payment};
