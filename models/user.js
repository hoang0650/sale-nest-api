const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    googleId: String,
    facebookId: String,
    tiktokId: String,
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    blocked: {
        type: Boolean, default: false
    },
    online: {
        type: Boolean, default: false
    },
    role: {
        type: String,
        enum: ['user', 'shop', 'admin'],
        default: 'user',
        required: true,
    },
    avatar: { type: String },
    coverPhoto: {type: String},
    bio: {type: String},
    contact: {
        phone: String,
        address: String
    },
    balance: {
        type: Number,
        default: 0,
    },
    coinBalance: {
        type: Number,
        default: 0,
    },
    followers: Number,
    friends: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
    blockedUsers: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
    loyaltyPoints: { type: Number, default: 0 },
    transactions: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Transaction',
        },
    ],  
    orderHistory: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Order' }],
    loginHistory: [
        {
            loginDate: { type: Date, default: Date.now },
            ipAddress: String
        }
    ],
    usedVouchers: [{ type: String }],  // Thêm trường này để lưu voucher đã sử dụng
    createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', UserSchema);
module.exports = { User };
