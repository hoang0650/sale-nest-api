var express = require('express');
var router = express.Router();
const {getBlogs, getBlog, createBlog, updateBlog, deleteBlog} = require('../controllers/blog')

// GET: Lấy hết các bài Blog
router.get('/', getBlogs);
// GET: Lấy một bài Blog cụ thể
router.post('/:id', getBlog);
// POST: Tạo bài Blog mới
router.post('/', createBlog);
// PUT: Cập nhật bài Blog mới
router.put('/:id', updateBlog);
// DELETE: xóa bài Blog
router.delete('/:id', deleteBlog);

module.exports = router;