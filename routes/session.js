var express = require('express');
var router = express.Router();
const Session = require('../models/session');

// Tạo một phiên mới
router.post('/', async (req, res) => {
    const { customerId, supportId } = req.body;
    const session = new Session({ customerId, supportId });
    await session.save();
    res.status(201).json(session);
});

// Gửi tin nhắn trong phiên
router.post('/:sessionId/messages', async (req, res) => {
    const { sessionId } = req.params;
    const { sender, text } = req.body;

    const session = await Session.findById(sessionId);
    session.messages.push({ sender, text });
    await session.save();

    res.status(201).json(session);
});

// Lấy danh sách các phiên đang hoạt động
router.get('/active', async (req, res) => {
    const sessions = await Session.find({ isActive: true });
    res.status(200).json(sessions);
});

// Đóng phiên
router.put('/:sessionId/close', async (req, res) => {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    session.isActive = false;
    session.endedAt = new Date();
    await session.save();

    res.status(200).json(session);
});

module.exports = router;
