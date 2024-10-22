const mongoose = require('mongoose');
const sectionSchema = new mongoose.Schema({
  title: String,
  content: String
});

const blogSchema = new mongoose.Schema({
  title: String,
  type: String,
  imageUrl: String,
  author: String,
  viewCount: {
    type: Number,
    default: 0
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