const { Store } = require('../models/store');
const { Blogger } = require('../models/blogger');
const { Transaction } = require('../models/transaction')
const { Project } = require('../models/project')
const { v4: uuidv4 } = require('uuid');
// Store Registration
async function storeRegister(req, res) {
    try {
        const store = new Store({
            ...req.body,
            userId: req.user._id
        });
        await store.save();
        res.status(201).send(store);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Blogger Registration
async function bloggerRegister(req, res) {
    try {
        const blogger = new Blogger({
            ...req.body,
            user: req.user._id,
            bloggerName: req.user.username
        });
        await blogger.save();
        res.status(201).send(blogger);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get Store List
async function getStores(req, res) {
    try {
        const stores = await Store.find({});
        res.send(stores);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get Blogger List
async function getBloggers(req, res) {
    try {
        const bloggers = await Blogger.find({});
        res.send(bloggers);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Create Transaction
async function createTransaction(req, res) {
    try {
        // Tạo mã transaction
        const transactionId = uuidv4();
        const transaction = new Transaction({
            ...req.body,
            transactionId,
            user: req.user._id
        });

        await transaction.save();
        res.status(201).send(transaction);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get Store Transactions
async function getStoreTransactions(req, res) {
    try {
        const store = await Store.findOne({ _id: req.params.id, user: req.user._id });
        if (!store) {
            return res.status(404).send();
        }
        const transactions = await Transaction.find({ store: store._id });
        res.send(transactions);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get Blogger Transactions
async function getBloggerTransactions(req, res) {
    try {
        const blogger = await Blogger.findOne({ _id: req.params.id, user: req.user._id });
        if (!blogger) {
            return res.status(404).send();
        }
        const transactions = await Transaction.find({ blogger: blogger._id });
        res.send(transactions);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Create Project
async function createProject(req, res) {
    try {
        const project = new Project({
            ...req.body,
            client: req.user._id
        });
        await project.save();
        res.status(201).send(project);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get Blogger Projects
async function getBloggerProject(req, res) {
    try {
        const blogger = await Blogger.findOne({ _id: req.params.id, user: req.user._id });
        if (!blogger) {
            return res.status(404).send();
        }
        const projects = await Project.find({ blogger: blogger._id });
        res.send(projects);
    } catch (error) {
        res.status(500).send(error);
    }
};

module.exports =  {storeRegister,bloggerRegister,getStores,getBloggers,createTransaction,getStoreTransactions,getBloggerTransactions,createProject,getBloggerProject}