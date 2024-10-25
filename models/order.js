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
      variants: {
        size: { type: String, required: false }, // Nếu cần bắt buộc, đổi required thành true
        color: { type: String, required: false }
      }
    },
  ],
  status: { type: String, enum: ['pending', 'completed', 'delivered', 'cancelled'], default: 'pending' },
  subtotal: { type: Number, required: true },
  discount: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  orderId: { type: String, required: true, unique: true },
  voucherCode: {
    type: String,
    default: '', // Mặc định là chuỗi rỗng
  },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = { Order }