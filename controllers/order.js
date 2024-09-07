// const {Cart} = require('../models/cart');
const {Order} = require('../models/order');
const sendEmail  = require('../config/emailService')
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


module.exports = {Payment};
