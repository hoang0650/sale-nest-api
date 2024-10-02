var express = require('express');
var router = express.Router();
const {getContacts,sendContact} = require('../controllers/contact')

// POST: Gửi tin nhắn liên hệ
router.post('/', sendContact);

// GET: Lấy tất cả các tin nhắn liên hệ (chỉ dành cho admin)
router.get('/', getContacts);

module.exports = router;