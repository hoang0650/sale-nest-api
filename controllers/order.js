// const {Cart} = require('../models/cart');
const {Order} = require('../models/order');
const sendEmail  = require('../config/emailService')

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

async function updateStatus(req,res) {
  try {
    const updatedOrder = await Order.findOneAndUpdate({ id: req.params.id }, { status: req.body.status }, { new: true });
    if (updatedOrder) {
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
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
