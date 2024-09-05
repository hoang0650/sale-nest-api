const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: Number,
    },
  ],
  totalPrice: Number,
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = { Cart }