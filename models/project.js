const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    blogger: { type: mongoose.SchemaTypes.ObjectId, ref: 'Blogger', required: true },
    client: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'in_progress', 'completed', 'cancelled'], required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', ProjectSchema);
module.exports = { Project }