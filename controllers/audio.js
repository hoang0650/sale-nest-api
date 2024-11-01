const {Audio} = require('../models/audio');

// Get all videos (including German lessons)
async function getVideos (req, res) {
    try {
      const videos = await Audio.find();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

// Get German lessons only
async function getLesson (req, res) {
    try {
      const lessons = await Audio.find({ isGermanLesson: true });
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  
  // Get a single video or lesson
async function getVideo (req, res) {
    try {
      const video = await Audio.findById(req.params.id);
      if (video) {
        res.json(video);
      } else {
        res.status(404).json({ message: 'Video not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};
  
  // Create a new video or lesson
async function createVideo (req, res) {
    const video = new Audio(req.body);
    try {
      const newVideo = await video.save();
      res.status(201).json(newVideo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};
  
  // Update a video or lesson
async function updateVideo (req, res) {
    try {
      const video = await Audio.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (video) {
        res.json(video);
      } else {
        res.status(404).json({ message: 'Video not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};
  
  // Delete a video or lesson
async function deleteVideo (req, res) {
    try {
      const video = await Audio.findByIdAndDelete(req.params.id);
      if (video) {
        res.json({ message: 'Video deleted' });
      } else {
        res.status(404).json({ message: 'Video not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

module.exports = {getVideos,getLesson,getVideo,createVideo,updateVideo,deleteVideo}

