var express = require('express');
var router = express.Router();
const {creatorTop} =  require('../controllers/creator');


router.get('/top',creatorTop);


module.exports = router;