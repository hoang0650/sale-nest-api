var express = require('express');
var router = express.Router();
const {storeRegister,bloggerRegister,getStores,getBloggers,createTransaction,getStoreTransactions,getBloggerTransactions,createProject,getBloggerProject} = require('../controllers/services');

// Get Store List
router.get('/stores', getStores);
// Get Blogger List
router.get('/bloggers', getBloggers);
// Store Registration
router.post('/stores', storeRegister);
// Blogger Registration
router.post('/bloggers', bloggerRegister);
// Create Transaction
router.post('/transactions', createTransaction);
// Get Store Transactions
router.get('/stores/:id/transactions', getStoreTransactions);
// Get Blogger Transactions
router.get('/bloggers/:id/transactions', getBloggerTransactions);
// Create Project
router.get('/:id', createProject);
// Get Blogger Projects
router.post('/', getBloggerProject);

module.exports = router;