var express = require('express');
var router = express.Router();
const {Webhook,handMessage} = require('../controllers/webhook')


router.get('/',Webhook);
router.post('/',handMessage);

module.exports = router;