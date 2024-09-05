const dotenv = require('dotenv');
dotenv.config();
// verify token webhook facebook
function Webhook(req, res) {
    const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook verified!');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
}

// Message Handle
function handMessage(req, res) {
    // Xử lý dữ liệu tin nhắn
    res.sendStatus(200);
}

module.exports = {Webhook,handMessage}