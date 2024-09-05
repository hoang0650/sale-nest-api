const {Cart} = require('../models/cart');
const {Product} = require('../models/product');

// Thêm sản phẩm vào giỏ hàng
async function addToCart (req, res) {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne();

    if (!cart) {
        cart = new Cart({ items: [], totalPrice: 0 });
    }

    const product = await Product.findById(productId);
    const cartItem = cart.items.find(item => item.productId.equals(productId));

    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        cart.items.push({ productId, quantity });
    }

    cart.totalPrice += product.price * quantity;
    await cart.save();
    res.json(cart);
};

// Lấy giỏ hàng
async function getCart (req, res) {
    const cart = await Cart.findOne().populate('items.productId');
    res.json(cart);
};

module.exports = {addToCart,getCart};
