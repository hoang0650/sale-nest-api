var express = require('express');
var router = express.Router();
const CustomAI = require('../config/customAI');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const iconv = require('iconv-lite');

const ai = new CustomAI();
const trainedModelsFile = 'trained_models.json';
// Cấu hình multer để xử lý file upload
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 } // Giới hạn kích thước mỗi file là 50MB
});

async function addTrainedModel(modelName) {
    try {
        let models = await getTrainedModels();
        if (!models.includes(modelName)) {
            models.push(modelName);
            await fs.writeFile(trainedModelsFile, JSON.stringify(models), { encoding: 'utf8' });
        }
    } catch (error) {
        console.error('Failed to add trained model', error);
    }
}

async function getTrainedModels() {
    try {
        const data = await fs.readFile(trainedModelsFile, { encoding: 'utf8' });
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

router.post('/train', express.json({ limit: '50mb' }), async (req, res) => {
    const { text } = req.body;

    try {
        const decodedText = iconv.decode(Buffer.from(text), 'utf-8');
        await ai.train(decodedText);
        const modelName = `model_${Date.now()}.json`;
        await ai.saveModel(modelName);
        await addTrainedModel(modelName);
        res.json({ message: 'Training completed successfully', modelName });
    } catch (error) {
        res.status(500).json({ error: 'Training failed', details: error.message });
    }
});

router.post('/train-folder', upload.array('files', 10), async (req, res) => {
    try {
        const folderPath = path.join(__dirname, 'uploads');
        await ai.trainFromFolder(folderPath);
        const modelName = `model_folder_${Date.now()}.json`;
        await ai.saveModel(modelName);
        await addTrainedModel(modelName);
        res.json({ message: 'Folder training completed successfully', modelName });
    } catch (error) {
        res.status(500).json({ error: 'Folder training failed', details: error.message });
    } finally {
        // Clean up uploaded files
        const files = await fs.readdir('uploads');
        for (const file of files) {
            await fs.unlink(path.join('uploads', file));
        }
    }
});

router.post('/train-web', express.json(), async (req, res) => {
    const { url } = req.body;
    
    try {
        await ai.trainFromWeb(url);
        const modelName = `model_web_${Date.now()}.json`;
        await ai.saveModel(modelName);
        await addTrainedModel(modelName);
        res.json({ message: 'Web training completed successfully', modelName });
    } catch (error) {
        res.status(500).json({ error: 'Web training failed', details: error.message });
    }
});

router.post('/query', express.json(), async (req, res) => {
    const { query, targetLanguage } = req.body;

    try {
        const decodedQuery = iconv.decode(Buffer.from(query), 'utf-8');
        let response = await ai.generateResponse(decodedQuery);
        if (targetLanguage) {
            response = await ai.translateText(response, targetLanguage);
        }
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: 'Query processing failed', details: error.message });
    }
});

router.post('/save', express.json(), async (req, res) => {
    const { filename } = req.body;
    try {
        await ai.saveModel(filename);
        await addTrainedModel(filename);
        res.json({ message: 'Model saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save model', details: error.message });
    }
});

router.post('/load', express.json(), async (req, res) => {
    const { filename } = req.body;
    try {
        await ai.loadModel(filename);
        res.json({ message: 'Model loaded successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to load model', details: error.message });
    }
});

router.get('/trained-models', async (req, res) => {
    try {
        const models = await getTrainedModels();
        res.json(models);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get trained models', details: error.message });
    }
});

module.exports = router;