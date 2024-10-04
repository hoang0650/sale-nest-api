var express = require('express');
var router = express.Router();
const {revenuePerDay,addRevenue} = require('../controllers/revenue')

router.post('/',addRevenue)
router.get('/:period',revenuePerDay)

module.exports = router;