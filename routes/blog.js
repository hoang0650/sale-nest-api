var express = require('express');
var router = express.Router();
const {getBlogs, getBlog, getRelated, getAllBlogComments,createBlogComment, createRelyComment, createBlog, updateBlog, deleteBlog} = require('../controllers/blog')

// GET: Lấy hết các bài Blog
router.get('/', getBlogs);
// GET: Lấy một bài Blog cụ thể
router.get('/:id', getBlog);
// GET: Lấy tất cả comment của blog
router.get('/:id/comments', getAllBlogComments);
// GET: Lấy các bài Blog liên quan
router.get('/related-posts/:id', getRelated);
// POST: Tạo bài Blog mới
router.post('/', createBlog);
// POST: Tạo comment mới
router.post('/:id/comments', createBlogComment);
// POST: Tạo rely mới
router.post('/:id/comments/:commentId/replies', createRelyComment);
// PUT: Cập nhật bài Blog mới
router.put('/:id', updateBlog);
// DELETE: xóa bài Blog
router.delete('/:id', deleteBlog);

module.exports = router;