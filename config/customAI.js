const natural = require('natural');
const fs = require('fs').promises;
const path = require('path');
const csv = require('csv-parser');
const mammoth = require('mammoth');
const xlsx = require('xlsx');
const pdf = require('pdf-parse');
const { createWorker } = require('tesseract.js');
const axios = require('axios');
const cheerio = require('cheerio');

class CustomAI {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
    this.classifier = new natural.BayesClassifier();
    this.stemmer = natural.PorterStemmer;
    this.documents = [];
  }

  async train(text) {
    const tokens = this.tokenizer.tokenize(text.toLowerCase());
    const stemmedTokens = tokens.map(token => this.stemmer.stem(token));
    
    this.tfidf.addDocument(stemmedTokens);
    this.documents.push(stemmedTokens);
    
    this.classifier.addDocument(stemmedTokens, 'category');
    
    await new Promise((resolve) => {
      this.classifier.train(() => {
        resolve();
      });
    });
  }

  async trainFromFolder(folderPath) {
    const files = await fs.readdir(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const ext = path.extname(file).toLowerCase();
      let text = '';

      switch (ext) {
        case '.csv':
          text = await this.readCSV(filePath);
          break;
        case '.docx':
          text = await this.readDOCX(filePath);
          break;
        case '.xlsx':
          text = await this.readXLSX(filePath);
          break;
        case '.pdf':
          text = await this.readPDF(filePath);
          break;
        case '.txt':
          text = await fs.readFile(filePath, 'utf-8');
          break;
        case '.png':
        case '.jpg':
        case '.jpeg':
          text = await this.readImage(filePath);
          break;
        default:
          console.log(`Unsupported file type: ${ext}`);
          continue;
      }

      await this.train(text);
    }
  }

  async trainFromWeb(url) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const text = $('body').text();
      await this.train(text);
    } catch (error) {
      console.error(`Error training from web: ${error.message}`);
    }
  }

  async readCSV(filePath) {
    return new Promise((resolve) => {
      let text = '';
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          text += Object.values(row).join(' ') + ' ';
        })
        .on('end', () => {
          resolve(text);
        });
    });
  }

  async readDOCX(filePath) {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  async readXLSX(filePath) {
    const workbook = xlsx.readFile(filePath);
    let text = '';
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      text += xlsx.utils.sheet_to_csv(sheet) + ' ';
    });
    return text;
  }

  async readPDF(filePath) {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  async readImage(filePath) {
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(filePath);
    await worker.terminate();
    return text;
  }

  async generateResponse(query) {
    const tokens = this.tokenizer.tokenize(query.toLowerCase());
    const stemmedTokens = tokens.map(token => this.stemmer.stem(token));
    
    let maxSimilarity = 0;
    let mostSimilarDoc = null;
    
    this.documents.forEach((doc) => {
      const similarity = this.calculateCosineSimilarity(stemmedTokens, doc);
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        mostSimilarDoc = doc;
      }
    });
    
    if (mostSimilarDoc) {
      return this.generateResponseFromDocument(mostSimilarDoc);
    } else {
      return "I'm sorry, I don't have enough information to answer that question.";
    }
  }

  calculateCosineSimilarity(tokens1, tokens2) {
    const vector1 = this.createVector(tokens1);
    const vector2 = this.createVector(tokens2);
    
    const dotProduct = Object.keys(vector1).reduce((sum, key) => {
      return sum + (vector1[key] * (vector2[key] || 0));
    }, 0);
    
    const magnitude1 = Math.sqrt(Object.values(vector1).reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(Object.values(vector2).reduce((sum, val) => sum + val * val, 0));
    
    return dotProduct / (magnitude1 * magnitude2);
  }

  createVector(tokens) {
    return tokens.reduce((vector, token) => {
      vector[token] = (vector[token] || 0) + 1;
      return vector;
    }, {});
  }

  generateResponseFromDocument(doc) {
    return doc.join(' ');
  }

  async saveModel(filename) {
    const modelData = {
      tfidf: this.tfidf,
      classifier: this.classifier.save(),
      documents: this.documents
    };
    await fs.writeFile(filename, JSON.stringify(modelData));
  }

  async loadModel(filename) {
    const modelData = JSON.parse(await fs.readFile(filename, 'utf-8'));
    this.tfidf = new natural.TfIdf(modelData.tfidf);
    this.classifier = natural.BayesClassifier.restore(modelData.classifier);
    this.documents = modelData.documents;
  }
}

module.exports = CustomAI;