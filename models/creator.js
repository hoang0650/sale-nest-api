const mongoose = require('mongoose');

const creatorSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    followers: { type: Number, default: 0 },
    category: { type: String, required: true }
});

const Creator = mongoose.model('Creator', creatorSchema);
module.exports = { Creator }