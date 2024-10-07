var express = require('express');
var router = express.Router();
const {deposit, withdraw, transfer, sendGift, convertToCoin, convertToUsd} = require('../controllers/wallet')
// Middleware for authentication
const auth = (req, res, next) => {
  // Implement your authentication logic here, e.g., JWT check
  next();
};

// Nạp tiền
router.post('/deposit', deposit);

// Chuyển tiền
router.post('/transfer', transfer);

// Quy đổi sang coin
router.post('/convert', convertToCoin);

// Tặng quà
router.post('/gift', sendGift);

// Rút tiền
router.post('/withdraw', withdraw);

// Quy đổi từ coin sang USD (trừ phí 1%)
router.post('/convertCoinToMoney', convertToUsd);

module.exports = router;
