var express = require('express');
var router = express.Router();
const multer = require('multer');
const LearningChatbot = require('../config/learningChatbot');


// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// Khởi tạo chatbot
const chatbot = new LearningChatbot();

// API endpoint cho chatbot
router.post('/chat', async (req, res) => {
    try {
        const { message, language } = req.body;
        // const userId = req.user.id;
        const chatbot = new LearningChatbot();
        await chatbot.ensureInitialized();
        const response = await chatbot.processMessage(message, language);
        res.json({ response });
      } catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).json({ error: 'An error occurred while processing your message' });
      }
});

// API endpoint để train từ folder (yêu cầu xác thực)
router.post('/train/folder', async (req, res) => {
    const { folderPath } = req.body;
    await chatbot.trainFromFolder(folderPath);
    res.json({ message: 'Training from folder completed' });
});

// GET: Lấy tất cả các tin nhắn liên hệ (chỉ dành cho admin)
router.get('/train/file', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    await chatbot.trainFromFolder(path.dirname(req.file.path));
    res.json({ message: 'Training from uploaded file completed' });
});

// API endpoint để train từ web (yêu cầu xác thực)
router.post('/train/web', async (req, res) => {
    try {
        const { url } = req.body;
        // const userId = req.user.id;
        const chatbot = new LearningChatbot();
        await chatbot.ensureInitialized();
        await chatbot.trainFromWeb(url);
        res.json({ message: 'Training from web completed successfully' });
      } catch (error) {
        console.error('Error in train/web endpoint:', error);
        res.status(500).json({ error: 'An error occurred while training from web' });
      }
});

// API endpoint để lấy danh sách ngôn ngữ hỗ trợ
router.get('/languages', async (req, res) => {
    const languages = await chatbot.getAvailableLanguages();
    res.json({ languages });
});

module.exports = router;