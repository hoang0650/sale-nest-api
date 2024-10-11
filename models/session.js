const mongoose = require('mongoose');

const supporMessageSchema = new mongoose.Schema({
  sender: String,    // 'client' hoặc 'support'
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const sessionSchema = new mongoose.Schema({
  customerId: String,
  supportId: String,
  isActive: { type: Boolean, default: true }, // Đóng phiên nếu không còn tư vấn
  messages: [supporMessageSchema],
  startedAt: { type: Date, default: Date.now },
  endedAt: Date
});

const Session = mongoose.model('Session', sessionSchema);
module.exports = { Session };