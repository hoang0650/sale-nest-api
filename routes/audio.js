var express = require('express');
var router = express.Router();
const {getVideos,getLesson,getVideo,createVideo,updateVideo,deleteVideo} = require('../controllers/audio');

// GET: Lấy hết các Audio
router.get('/', getVideos);
// GET: Lấy hết các bài lessons
router.get('/german-lessons', getLesson);
// GET: Lấy một bài lessons hoặc audio
router.get('/:id', getVideo);
// POST: Tạo một video mới
router.post('/', createVideo);
// PUT: Cập nhật video
router.put('/:id', updateVideo);
// DELETE: xóa video
router.delete('/:id', deleteVideo);

module.exports = router;