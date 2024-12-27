var express = require('express');
var router = express.Router();
const {createRealestate,getRealestates,getRealestateId,updateRealestate,deleteRealestate,getRealestateByRole} = require('../controllers/realestate')

router.post('/',createRealestate)
router.get('/',getRealestates)
router.get('/:id',getRealestateId)
router.put('/:id',updateRealestate)
router.delete('/:id',deleteRealestate)
router.get('/by-role/:role',getRealestateByRole)

module.exports = router;