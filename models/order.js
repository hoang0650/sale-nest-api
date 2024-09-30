const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  status: { type: String, enum: ['pending', 'completed', 'delivered', 'cancelled'], default: 'pending' },
  totalPrice: { type: Number, required: true },
  orderId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = { Order }