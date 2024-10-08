const { Video } = require('../models/video');

async function getAllVideo(req, res) {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getFeaturedVideo (req, res) {
    try {
      const featuredVideo = await Video.findOne({ isFeatured: true });
      res.json(featuredVideo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

async function getRelatedVideos (req, res) {
    try {
      const relatedVideos = await Video.find({ isFeatured: false }).limit(4);
      res.json(relatedVideos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

module.exports = {getAllVideo,getFeaturedVideo,getRelatedVideos}