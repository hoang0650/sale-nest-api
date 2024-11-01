const mongoose = require('mongoose');

const transcriptSchema = new mongoose.Schema({
  start: { type: Number, required: true },
  end: { type: Number, required: true },
  text: { type: String, required: true }
});

const audioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  duration: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  isGermanLesson: { type: Boolean, default: false },
  transcript: [transcriptSchema]
});

const Audio = mongoose.model('Audio', audioSchema);
module.exports = { Audio }