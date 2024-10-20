const {Blog} = require('../models/blog');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for handling multiple file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads/blogs';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload only images.'), false);
    }
  }
}).array('images', 30); // 'images' is the field name, 30 is the max number of files


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
    blog.viewCount += 1;
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

async function createBlog(req, res) {
  try {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }

      const blogData = JSON.parse(req.body.blogData);

      // Add image URLs to the blog data
      blogData.imageUrl = req.files.map(file => `/uploads/blogs/${file.filename}`)[0]; // Chỉ lấy hình ảnh đầu tiên làm imageUrl cho blog

      // Xử lý phần images cho các sections
      let fileIndex = 1; // Bắt đầu từ file thứ hai
      blogData.sections = blogData.sections.map(section => {
        section.images = [];
        while (req.files[fileIndex] && section.images.length < 5) {
          section.images.push(`/uploads/blogs/${req.files[fileIndex].filename}`);
          fileIndex++;
        }
        return section;
      });

      const blog = new Blog(blogData);
      await blog.save();

      res.status(201).json({ message: 'Blog created successfully', blog });
    });
  } catch (error) {
    console.error('Error in createBlog:', error);
    res.status(500).json({ error: 'Error creating blog.' });
  }
};


async function updateBlog(req, res) {
  try {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: err.message });
      }

      const blogData = JSON.parse(req.body.blogData);
      const blogId = req.params.id;

      const existingBlog = await Blog.findById(blogId);
      if (!existingBlog) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      // Add new image URLs to the existing ones
      const newImageUrls = req.files.map(file => `/uploads/blogs/${file.filename}`);
      blogData.imageUrl = blogData.imageUrl || existingBlog.imageUrl;

      // Merge existing section images with new ones
      let fileIndex = newImageUrls.length ? 1 : 0;
      blogData.sections.forEach((section, idx) => {
        if (!section.images) section.images = [];
        while (req.files[fileIndex] && section.images.length < 5) {
          section.images.push(`/uploads/blogs/${req.files[fileIndex].filename}`);
          fileIndex++;
        }
      });

      const updatedBlog = await Blog.findByIdAndUpdate(blogId, blogData, { new: true });
      res.json({ message: 'Blog updated successfully', blog: updatedBlog });
    });
  } catch (error) {
    console.error('Error in updateBlog:', error);
    res.status(500).json({ error: 'Error updating blog.' });
  }
}


async function deleteBlog (req, res) {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ message: 'Blog not found' });

    // Delete associated images
    if (deletedBlog.imageUrl) {
      fs.unlink(path.join(__dirname, '..', deletedBlog.imageUrl), (err) => {
        if (err) console.error('Error deleting main image:', err);
      });
    }
    deletedBlog.sections.forEach(section => {
      section.images.forEach(image => {
        fs.unlink(path.join(__dirname, '..', image), (err) => {
          if (err) console.error('Error deleting section image:', err);
        });
      });
    });

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
}

module.exports = {getBlogs, getBlog, getRelatedPosts, createBlog, updateBlog, deleteBlog};