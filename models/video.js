const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    username: { type: String, required: true },
    description: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    viewers: { type: Number, default: 0 },
    category: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    streamUrl: { type: String, required: true },
    isFeatured: { type: Boolean, default: false }
});

const Video = mongoose.model('Video', videoSchema);
module.exports = { Video }