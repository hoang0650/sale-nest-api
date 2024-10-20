const mongoose = require('mongoose');
const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: false
  },
  images: [{
    type: String,
    required: false
  }]
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  author: {
    type: String,
    required: true
  },
  sections: [sectionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

blogSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
  
const Blog = mongoose.model('Blog', blogSchema);
module.exports = { Blog };