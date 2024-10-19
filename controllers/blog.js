const {Blog} = require('../models/blog');

async function getBlogs (req, res)  {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách blog', error: error.message });
  }
}

async function getBlog (req, res) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Không tìm thấy bài blog' });
    }
    // blog.viewCount += 1;
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy bài blog', error: error.message });
  }
}

async function getRelatedPosts(postId, type, limit = 8) {
  try {
    // Find the product with the given ID
    const post = await Blog.findById(postId);

    if (!post) {
      return [];
    }

    // Get related products based on product type
    const relatedPosts = await Blog.find({
      type: post.type,
      _id: { $ne: postId }, // Exclude the current product
    })
      .sort({ clickCount: -1 }) // Sort by click count in descending order
      .limit(limit);

    return relatedPosts;
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

async function createBlog (req, res) {
    try {
      const newBlog = new Blog(req.body);
      await newBlog.save();
      res.status(201).json({ message: 'Bài blog đã được tạo thành công', blog: newBlog });
    } catch (error) {
      res.status(400).json({ message: 'Có lỗi xảy ra khi tạo bài blog', error: error.message });
    }
}

async function updateBlog (req, res) {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBlog) {
      return res.status(404).json({ message: 'Không tìm thấy bài blog' });
    }
    res.json({ message: 'Bài blog đã được cập nhật thành công', blog: updatedBlog });
  } catch (error) {
    res.status(400).json({ message: 'Có lỗi xảy ra khi cập nhật bài blog', error: error.message });
  }
}

async function deleteBlog (req, res) {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Không tìm thấy bài blog' });
    }
    res.json({ message: 'Bài blog đã được xóa thành công', blog: deletedBlog });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa bài blog', error: error.message });
  }
}

module.exports = {getBlogs, getBlog, getRelatedPosts, createBlog, updateBlog, deleteBlog};