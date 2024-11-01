const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema({
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    storeName: { type: String, required: true },
    ownerName: { type: String, required: true },
    description: { type: String },
    address: { type: String },
    phone: { type: String },
    status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Store = mongoose.model('Store', StoreSchema);
module.exports = { Store }