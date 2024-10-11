var express = require('express');
var router = express.Router();
const CustomAI = require('../config/customAI');
const fs = require('fs').promises;
const path = require('path');

const ai = new CustomAI();
const trainedModelsFile = 'trained_models.json';
async function addTrainedModel(modelName) {
    try {
      let models = await getTrainedModels();
      if (!models.includes(modelName)) {
        models.push(modelName);
        await fs.writeFile(trainedModelsFile, JSON.stringify(models));
      }
    } catch (error) {
      console.error('Failed to add trained model', error);
    }
  }
  
  async function getTrainedModels() {
    try {
      const data = await fs.readFile(trainedModelsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

router.post('/train', async (req, res) => {
    const { text } = req.body;

    try {
        await ai.train(text);
        const modelName = `model_${Date.now()}.json`;
        await ai.saveModel(modelName);
        await addTrainedModel(modelName);
        res.json({ message: 'Training completed successfully', modelName });
    } catch (error) {
        res.status(500).json({ error: 'Training failed' });
    }
});

router.post('/query', async (req, res) => {
    const { query } = req.body;

    try {
        const response = await ai.generateResponse(query);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ error: 'Query processing failed' });
    }
});

router.post('/save', async (req, res) => {
    const { filename } = req.body;
    try {
        await ai.saveModel(filename);
        await addTrainedModel(filename);
        res.json({ message: 'Model saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save model' });
    }
});

router.post('/load', async (req, res) => {
    const { filename } = req.body;
    try {
        await ai.loadModel(filename);
        res.json({ message: 'Model loaded successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to load model' });
    }
});

router.get('/trained-models', async (req, res) => {
    try {
        const models = await getTrainedModels();
        res.json(models);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get trained models' });
    }
});

module.exports = router;
