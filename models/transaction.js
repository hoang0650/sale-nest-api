const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    type: {
        type: String,
        enum: ['deposit', 'withdraw', 'transfer', 'convertCoin', 'gift', 'isvalid', 'convertCoinToMoney'],
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = { Transaction }
