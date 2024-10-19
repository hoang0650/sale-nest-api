var express = require('express');
var router = express.Router();
const {getBlogs, getBlog, getRelatedPosts, createBlog, updateBlog, deleteBlog} = require('../controllers/blog')

// GET: Lấy hết các bài Blog
router.get('/', getBlogs);
// GET: Lấy một bài Blog cụ thể
router.get('/:id', getBlog);
// GET: Lấy các bài Blog liên quan
router.get('/related-posts/:id', getRelatedPosts);
// POST: Tạo bài Blog mới
router.post('/', createBlog);
// PUT: Cập nhật bài Blog mới
router.put('/:id', updateBlog);
// DELETE: xóa bài Blog
router.delete('/:id', deleteBlog);

module.exports = router;