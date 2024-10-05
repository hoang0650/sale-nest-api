const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },    // User ID của người gửi
    message: { type: String, required: true },   // Nội dung tin nhắn
    roomId: { type: String, required: true },    // ID của room hoặc cặp người chat
    type: { type: String, enum: ['group', 'private'], default: 'private' },  // Loại chat (group hoặc private)
    createdAt: { type: Date, default: Date.now }, // Thời gian tin nhắn
});

const Message = mongoose.model('Message', messageSchema)
module.exports = { Message };