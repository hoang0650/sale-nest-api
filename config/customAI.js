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
const iconv = require('iconv-lite');
const jschardet = require('jschardet');
const translate = require('@vitalets/google-translate-api');
const unidecode = require('unidecode');
const utf8 = require('utf8');
const { v4: uuidv4 } = require('uuid');

class CustomAI {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
    this.classifier = new natural.BayesClassifier();
    this.stemmer = natural.PorterStemmer;
    this.documents = [];
  }

  async train(text) {
    const decodedText = this.decodeText(text);
    const tokens = this.tokenizer.tokenize(decodedText.toLowerCase());
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
          text = await this.readTextFile(filePath);
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
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const encoding = this.detectEncoding(response.headers['content-type'], response.data);
      const decodedData = iconv.decode(response.data, encoding);
      const $ = cheerio.load(decodedData);
      const text = $('body').text();
      await this.train(text);
    } catch (error) {
      console.error(`Error training from web: ${error.message}`);
    }
  }

  detectEncoding(contentType, buffer) {
    const charset = contentType && contentType.match(/charset=(.+)/i);
    if (charset) {
      return charset[1].toLowerCase();
    }
    const detected = jschardet.detect(buffer);
    return detected.encoding || 'utf-8';
  }

  async readCSV(filePath) {
    return new Promise((resolve) => {
      let text = '';
      fs.createReadStream(filePath, { encoding: 'utf-8' })
        .pipe(csv())
        .on('data', (row) => {
          text += Object.values(row).join(' ') + ' ';
        })
        .on('end', () => {
          resolve(this.decodeText(text));
        });
    });
  }

  async readDOCX(filePath) {
    const result = await mammoth.extractRawText({ path: filePath });
    return this.decodeText(result.value);
  }

  async readXLSX(filePath) {
    const workbook = xlsx.readFile(filePath, { type: 'buffer', cellText: true, cellDates: true });
    let text = '';
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      text += xlsx.utils.sheet_to_csv(sheet, { FS: ' ' }) + ' ';
    });
    return this.decodeText(text);
  }

  async readPDF(filePath) {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return this.decodeText(data.text);
  }

  async readTextFile(filePath) {
    const buffer = await fs.readFile(filePath);
    const encoding = jschardet.detect(buffer).encoding || 'utf-8';
    return iconv.decode(buffer, encoding);
  }

  async readImage(filePath) {
    const worker = await createWorker();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(filePath);
    await worker.terminate();
    return this.decodeText(text);
  }

  decodeText(text) {
    try {
      return utf8.decode(unidecode(text));
    } catch (error) {
      console.error('Error decoding text:', error);
      return text;
    }
  }

  async generateResponse(query) {
    const decodedQuery = this.decodeText(query);
    const tokens = this.tokenizer.tokenize(decodedQuery.toLowerCase());
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
    await fs.writeFile(filename, JSON.stringify(modelData), 'utf-8');
  }

  async loadModel(filename) {
    const modelData = JSON.parse(await fs.readFile(filename, 'utf-8'));
    this.tfidf = new natural.TfIdf(modelData.tfidf);
    this.classifier = natural.BayesClassifier.restore(modelData.classifier);
    this.documents = modelData.documents;
  }

  async translateText(text, targetLanguage = 'en') {
    try {
      const result = await translate(text, { to: targetLanguage });
      return result.text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }
}

module.exports = CustomAI;