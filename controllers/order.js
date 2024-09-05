const {Cart} = require('../models/cart');
const {Order} = require('../models/order');

// Tiến hành thanh toán
async function Payment (req, res) {
    const { name, phone, email, address } = req.body;
    const cart = await Cart.findOne().populate('items.productId');

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Giỏ hàng trống.' });
    }

    const order = new Order({
        name,
        phone,
        email,
        address,
        cart: {
            items: cart.items,
            totalPrice: cart.totalPrice,
        },
    });

    await order.save();
    await Cart.deleteOne(); // Xóa giỏ hàng sau khi thanh toán

    res.json({ message: 'Thanh toán thành công!', order });
};

module.exports = {Payment};
