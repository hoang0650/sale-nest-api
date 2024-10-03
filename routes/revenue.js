var express = require('express');
var router = express.Router();
const {revenuePerDay} = require('../controllers/revenue')

router.get('/day/:date',revenuePerDay)

module.exports = router;