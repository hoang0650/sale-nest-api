var express = require('express');
var router = express.Router();
const {getAllCampaigns, createCampaign} = require('../controllers/campaign')

// GET: Lấy hết các bài Blog
router.get('/', getAllCampaigns);
// POST: Tạo bài Blog mới
router.post('/', createCampaign);
// PUT: Cập nhật bài Blog mới
// router.put('/:id', updateBlog);
// DELETE: xóa bài Blog
// router.delete('/:id', deleteBlog);

module.exports = router;