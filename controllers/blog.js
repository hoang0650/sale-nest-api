const { Blog } = require('../models/blog');

// Lấy danh sách blog
async function getBlogs(req, res) {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách blog', error: error.message });
  }
}

// Lấy chi tiết blog
async function getBlog(req, res) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Không tìm thấy bài blog' });
    }
    blog.viewCount += 1;
    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy bài blog', error: error.message });
  }
}

async function getRelated(req,res){
  const postId = req.params.id;
    const limit = 8; // Giới hạn số lượng sản phẩm liên quan trả về

    try {
        // Gọi hàm getRelatedProducts
        const relatedProducts = await getRelatedPosts(postId, null, limit);
        res.json(relatedProducts);
    } catch (error) {
        res.status(500).send('Error fetching related products');
    }
}

// Lấy các bài viết liên quan
async function getRelatedPosts(postId, type, limit = 8) {
  try {
    const post = await Blog.findById(postId);

    if (!post) {
      return [];
    }

    const relatedPosts = await Blog.find({
      type: post.type,
      _id: { $ne: postId },
    })
      .sort({ clickCount: -1 })
      .limit(limit);

    return relatedPosts;
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

// Tạo bài blog mới
async function createBlog(req, res) {
  try {
    const blogData = req.body;

    // Xử lý dữ liệu blog bao gồm các trường imageUrl từ URL người dùng nhập
    const blog = new Blog(blogData);
    await blog.save();

    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (error) {
    console.error('Error in createBlog:', error);
    res.status(500).json({ error: 'Error creating blog.' });
  }
}

// Cập nhật bài blog
async function updateBlog(req, res) {
  try {
    const blogId = req.params.id;
    const blogData = req.body;

    const existingBlog = await Blog.findById(blogId);
    if (!existingBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, blogData, { new: true });
    res.json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    console.error('Error in updateBlog:', error);
    res.status(500).json({ error: 'Error updating blog.' });
  }
}

// Xóa bài blog
async function deleteBlog(req, res) {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ message: 'Blog not found' });

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
}

module.exports = { getBlogs, getBlog, getRelated, createBlog, updateBlog, deleteBlog };
