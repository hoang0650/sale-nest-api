const natural = require('natural');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
const qna = require('@tensorflow-models/qna');
const { Translate } = require('@google-cloud/translate').v2;
const csv = require('csv-parser');
const pdf = require('pdf-parse');
const docx = require('docx');
const xlsx = require('xlsx');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const {Session} = require('../models/session');

class LearningChatbot {
  constructor() {
    this.classifier = new natural.BayesClassifier();
    this.responses = {};
    this.dataFolder = path.join(__dirname, 'training_data');
    this.model = null;
    this.encoder = null;
    this.qnaModel = null;
    // this.translate = new Translate({ projectId: 'your-google-cloud-project-id' });
    // this.supportedLanguages = ['en', 'vi', 'fr', 'de', 'es', 'ja', 'ko', 'zh'];
  }

  async init() {
    try {
        await this.loadExistingData();
        this.encoder = await use.load();
        this.qnaModel = await qna.load();
        this.isInitialized = true;
        console.log('Models loaded successfully');
      } catch (error) {
        console.error('Error initializing LearningChatbot:', error);
        throw error;
      }
  }
  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.init();
    }
  }

  async loadExistingData() {
    try {
        const session = await this.getUserSession();
        if (session) {
          this.classifier = natural.BayesClassifier.restore(JSON.parse(session.classifier));
          this.responses = session.responses;
          if (session.model) {
            this.model = await tf.loadLayersModel(tf.io.fromMemory(session.model));
          }
        } else 
        {
          if (await fs.pathExists(path.join(this.dataFolder, 'classifier.json'))) {
            this.classifier = natural.BayesClassifier.restore(
              JSON.parse(await fs.readFile(path.join(this.dataFolder, 'classifier.json'), 'utf8'))
            );
          }
          if (await fs.pathExists(path.join(this.dataFolder, 'responses.json'))) {
            this.responses = JSON.parse(await fs.readFile(path.join(this.dataFolder, 'responses.json'), 'utf8'));
          }
          if (await fs.pathExists(path.join(this.dataFolder, 'model.json'))) {
            this.model = await tf.loadLayersModel(`file://${path.join(this.dataFolder, 'model.json')}`);
          }
        }
        console.log('Existing data loaded');
      } catch (error) {
        console.error('Error loading existing data:', error);
      }
  }

  async getUserSession() {
    return await Session.findOne({ userId: this.userId });
  }

  async updateUserSession(sessionData) {
    await Session.findOneAndUpdate(
      { userId: this.userId },
      sessionData,
      { upsert: true, new: true }
    );
  }

  async saveData() {
    try {
        const modelData = this.model ? await this.model.save(tf.io.withSaveHandler(async (modelArtifacts) => modelArtifacts)) : null;
        const session = {
          userId: this.userId,
          classifier: JSON.stringify(this.classifier),
          responses: this.responses,
          model: modelData
        };
        await this.updateUserSession(session);
        console.log('Data saved to user session');
      } catch (error) {
        console.error('Error saving data:', error);
      }
  }

  async trainFromFolder(folderPath) {
    try {
        const files = await fs.readdir(folderPath);
        const trainingData = [];
        for (const file of files) {
          const filePath = path.join(folderPath, file);
          const fileExtension = path.extname(file).toLowerCase();
          let content = '';
  
          switch (fileExtension) {
            case '.csv':
              content = await this.readCSV(filePath);
              break;
            case '.pdf':
              content = await this.readPDF(filePath);
              break;
            case '.docx':
              content = await this.readDOCX(filePath);
              break;
            case '.xlsx':
              content = await this.readXLSX(filePath);
              break;
            case '.txt':
              content = await fs.readFile(filePath, 'utf8');
              break;
            case '.png':
            case '.jpg':
            case '.jpeg':
              content = await this.readImage(filePath);
              break;
            default:
              console.log(`Unsupported file type: ${fileExtension}`);
              continue;
          }
  
          const sentences = content.split(/[.!?]+/);
          for (let i = 0; i < sentences.length; i += 2) {
            const question = sentences[i]?.trim();
            const answer = sentences[i + 1]?.trim();
            if (question && answer) {
              this.classifier.addDocument(question, answer);
              this.responses[answer] = answer;
              trainingData.push({ input: question, output: answer });
            }
          }
        }
        this.classifier.train();
        await this.trainTensorFlowModel(trainingData);
        await this.saveData();
        console.log('Training from folder completed');
      } catch (error) {
        console.error('Error training from folder:', error);
      }
  }

  async readPDF(filePath) {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  async readDOCX(filePath) {
    const content = await fs.readFile(filePath);
    const doc = new docx.Document(content);
    const text = doc.getFullText();
    return text;
  }

  async readXLSX(filePath) {
    const workbook = xlsx.readFile(filePath);
    let content = '';
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      content += xlsx.utils.sheet_to_txt(sheet) + ' ';
    });
    return content;
  }

  async readImage(filePath) {
    const image = await sharp(filePath).resize(800).toBuffer();
    const result = await Tesseract.recognize(image);
    return result.data.text;
  }

  async trainFromWeb(url) {
    try {
        await this.ensureInitialized();
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const text = $('body').text();
        const sentences = text.split(/[.!?]+/);
        const trainingData = [];
  
        for (let i = 0; i < sentences.length; i += 2) {
          const question = sentences[i]?.trim();
          const answer = sentences[i + 1]?.trim();
          if (question && answer) {
            this.classifier.addDocument(question, answer);
            this.responses[answer] = answer;
            trainingData.push({ input: question, output: answer });
          }
        }
  
        this.classifier.train();
        await this.trainTensorFlowModel(trainingData);
        await this.saveData();
        console.log('Training from web completed');
      } catch (error) {
        console.error('Error training from web:', error);
        throw error;
      }
  }

  async trainTensorFlowModel(trainingData) {
    if (!this.encoder) {
        throw new Error('Encoder is not initialized. Please ensure init() is called and completed.');
      }
  
      const inputs = trainingData.map(item => item.input);
      const outputs = trainingData.map(item => item.output);
  
      const encodedInputs = await this.encoder.embed(inputs);
      const encodedOutputs = await this.encoder.embed(outputs);
  
      const inputTensor = tf.tensor2d(await encodedInputs.array());
      const outputTensor = tf.tensor2d(await encodedOutputs.array());
  
      this.model = tf.sequential();
      this.model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [encodedInputs.shape[1]] }));
      this.model.add(tf.layers.dense({ units: encodedOutputs.shape[1] }));
  
      this.model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  
      await this.model.fit(inputTensor, outputTensor, { epochs: 100 });
  
      inputTensor.dispose();
      outputTensor.dispose();
  }

  async detectLanguage(text) {
    const [detection] = await this.translate.detect(text);
    return detection.language;
  }

  async translateText(text, targetLanguage) {
    const [translation] = await this.translate.translate(text, targetLanguage);
    return translation;
  }

  async processMessage(message, userLanguage = 'en') {
    const detectedLanguage = await this.detectLanguage(message);
    let translatedMessage = message;
    if (detectedLanguage !== 'en') {
      translatedMessage = await this.translateText(message, 'en');
    }

    let response;
    if (this.model && this.encoder) {
      const encoded = await this.encoder.embed([translatedMessage]);
      const prediction = this.model.predict(encoded);
      const index = prediction.argMax(1).dataSync()[0];
      response = Object.values(this.responses)[index];
    } else {
      const classification = this.classifier.classify(translatedMessage);
      response = this.responses[classification] || "I'm not sure how to respond to that.";
    }

    // Use QnA model for more complex queries
    const qnaResult = await this.qnaModel.findAnswers(translatedMessage, response);
    if (qnaResult.length > 0) {
      response = qnaResult[0].text;
    }

    // Translate response back to user's language if needed
    if (userLanguage !== 'en') {
      response = await this.translateText(response, userLanguage);
    }

    // Continuous learning
    this.classifier.addDocument(translatedMessage, response);
    this.classifier.train();
    this.responses[response] = response;
    this.saveData();

    return response;
  }

  async getAvailableLanguages() {
    return this.supportedLanguages;
  }
}

module.exports = LearningChatbot;