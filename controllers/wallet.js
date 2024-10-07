const { User } = require('../models/user');
const { Transaction } = require('../models/transaction');
const { v4: uuidv4 } = require('uuid');

// Deposit money
async function deposit(req, res) {
    const { userId, amount } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.balance += amount;
        // Tạo mã transaction
        const transactionId = uuidv4();

        const transaction = new Transaction({
            transactionId,
            user: user._id,
            type: 'deposit',
            amount: amount,
        });

        await transaction.save();
        user.transactions.push(transaction._id);
        await user.save();

        res.json({ success: true, balance: user.balance });
    } catch (error) {
        console.error('Deposit error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Transfer money
async function transfer(req, res) {
    const { senderId, recipientEmail, amount } = req.body;

    try {
        const sender = await User.findById(senderId);
        if (!sender) {
            return res.status(404).json({ success: false, message: 'Sender not found' });
        }

        const recipient = await User.findOne({ email: recipientEmail });
        if (!recipient) {
            return res.status(404).json({ success: false, message: 'Recipient not found' });
        }

        if (sender.balance < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient balance' });
        }

        sender.balance -= amount;
        recipient.balance += amount;
        // Tạo mã transaction
        const transactionId = uuidv4();

        const transaction = new Transaction({
            transactionId,
            user: sender._id,
            type: 'transfer',
            amount: amount,
            recipient: recipient._id,
        });

        await transaction.save();
        sender.transactions.push(transaction._id);
        await sender.save();
        await recipient.save();

        res.json({ success: true, balance: sender.balance });
    } catch (error) {
        console.error('Transfer error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Convert to coin
async function convertToCoin(req, res) {
    const { userId, amount } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.balance < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient balance' });
        }

        const coinAmount = amount * 1000; // 1 USD = 1000 coin
        user.balance -= amount;
        user.coinBalance += coinAmount;
        // Tạo mã transaction
        const transactionId = uuidv4();

        const transaction = new Transaction({
            transactionId,
            user: user._id,
            type: 'convertCoin',
            amount: coinAmount,
        });

        await transaction.save();
        user.transactions.push(transaction._id);
        await user.save();

        res.json({ success: true, coinBalance: user.coinBalance });
    } catch (error) {
        console.error('Convert to coin error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Send gift
async function sendGift(req, res) {
    const { userId, recipientEmail, coinAmount } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const recipient = await User.findOne({ email: recipientEmail });
        if (!recipient) {
            return res.status(404).json({ success: false, message: 'Recipient not found' });
        }

        if (user.coinBalance < coinAmount) {
            return res.status(400).json({ success: false, message: 'Insufficient coins' });
        }

        user.coinBalance -= coinAmount;
        recipient.coinBalance += coinAmount;
        // Tạo mã transaction
        const transactionId = uuidv4();

        const transaction = new Transaction({
            transactionId,
            user: user._id,
            type: 'gift',
            amount: coinAmount,
            recipient: recipient._id,
        });

        await transaction.save();
        user.transactions.push(transaction._id);
        await user.save();
        await recipient.save();

        res.json({ success: true, coinBalance: user.coinBalance });
    } catch (error) {
        console.error('Send gift error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Withdraw money
async function withdraw(req, res) {
    const { userId, amount } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.balance < amount) {
            return res.status(400).json({ success: false, message: 'Insufficient balance' });
        }

        user.balance -= amount;
        // Tạo mã transaction
        const transactionId = uuidv4();

        const transaction = new Transaction({
            transactionId,
            user: user._id,
            type: 'withdraw',
            amount: amount,
        });

        await transaction.save();
        user.transactions.push(transaction._id);
        await user.save();

        res.json({ success: true, balance: user.balance });
    } catch (error) {
        console.error('Withdraw error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Convert from coin to USD (with 1% fee)
async function convertToUsd(req, res) {
    const { userId, coinAmount } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.coinBalance < coinAmount) {
            return res.status(400).json({ success: false, message: 'Insufficient coins' });
        }

        const usdAmount = (coinAmount / 1000) * 0.99; // 1% fee

        user.coinBalance -= coinAmount;
        user.balance += usdAmount;
        // Tạo mã transaction
        const transactionId = uuidv4();

        const transaction = new Transaction({
            transactionId,
            user: user._id,
            type: 'convertCoinToMoney',
            amount: usdAmount,
        });

        await transaction.save();
        user.transactions.push(transaction._id);
        await user.save();

        res.json({ success: true, balance: user.balance });
    } catch (error) {
        console.error('Convert to USD error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

module.exports = { deposit, withdraw, transfer, sendGift, convertToCoin, convertToUsd };