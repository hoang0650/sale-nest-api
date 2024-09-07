var express = require('express');
var router = express.Router();
const {Webhook,handMessage,sendMessage} = require('../controllers/webhook')


router.get('/',Webhook);
router.post('/',handMessage);
router.post('/send-message',sendMessage)
module.exports = router;