const { Creator } = require('../models/creator')

async function creatorTop(req, res) {
    try {
        const topCreators = await Creator.find().sort({ followers: -1 }).limit(5);
        res.json(topCreators);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {creatorTop}