var express = require('express');
var router = express.Router();
const {getAllVideo,getFeaturedVideo,getRelatedVideos} =  require('../controllers/video');


router.get('/',getAllVideo);

router.get('/featured',getFeaturedVideo);

router.get('/related',getRelatedVideos);

module.exports = router;