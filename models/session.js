const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
  classifier: String,
  responses: Object,
  model: Object
});

const Session = mongoose.model('Session', sessionSchema);
module.exports = { Session };