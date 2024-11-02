const mongoose = require('mongoose');

const BloggerSchema = new mongoose.Schema({
  user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
  bloggerName: {type: String},
  specialty: { type: String },
  bio: { type: String },
  experience: { type: Number },
  portfolioUrl: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Blogger = mongoose.model('Blogger', BloggerSchema);
module.exports = { Blogger }