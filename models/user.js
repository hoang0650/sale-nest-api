const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    userId: {
        type: String,
        unique: true,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    blocked: {
        type: Boolean, default: false
    },
    online: {
        type: Boolean, default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
        required: true,
    },
    avatar: { type: String },
    contact: {
        phone: String,
        address: String
    },
    loyaltyPoints: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    orderHistory: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Order' }],
    loginHistory: [
        {
            loginDate: { type: Date, default: Date.now },
            ipAddress: String
        }
    ]
})

const User = mongoose.model('User', UserSchema);
module.exports = { User };