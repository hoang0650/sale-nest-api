const request = require('request');
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
    const data = req.body;

  if (data.object === 'page') {
    data.entry.forEach(entry => {
      const webhookEvent = entry.messaging[0];
      const senderId = webhookEvent.sender.id;
      console.log('senderId',senderId);
      
      const message = webhookEvent.message.text;

      if (message) {
        // Process the message and send it to your Angular application
        console.log(`Received message: ${message} from user: ${senderId}`);

        // You might want to use WebSocket or any other real-time method
        // to send this message to your Angular application
      }
    });
  }

  res.sendStatus(200);
}

// Gửi tin nhắn đến Facebook
function sendMessage(req, res) {
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
  const recipientId = req.body.recipientId;
  const messageText = req.body.messageText;
  console.log('recipientId',recipientId);
  console.log('messageText',messageText);

  request({
    uri: 'https://graph.facebook.com/v20.0/me?messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: {
      recipient: { id: recipientId },
      message: { text: messageText }
    }
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log('Message sent successfully');
      res.sendStatus(200);
    } else {
      console.error('Error sending message:', error);
      res.sendStatus(500);
    }
  });
}

module.exports = {Webhook,handMessage,sendMessage}