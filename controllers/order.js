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

// Tiến hành thanh toán
async function Payment (req, res) {
  try {
    const { fullName, phone, address, email, items, totalPrice,orderId} = req.body;
    const newOrder = new Order({
      fullName,
      phone,
      address,
      email,
      items,
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


module.exports = {getOrder,Payment};
