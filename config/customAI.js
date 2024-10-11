const natural = require('natural');
const fs = require('fs');

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
    
    // Train the classifier
    this.classifier.addDocument(stemmedTokens, 'category');
    
    // Retrain the entire classifier
    await new Promise((resolve) => {
      this.classifier.train(() => {
        resolve();
      });
    });
  }

  async generateResponse(query) {
    const tokens = this.tokenizer.tokenize(query.toLowerCase());
    const stemmedTokens = tokens.map(token => this.stemmer.stem(token));
    
    // Find the most similar document
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
      // Generate a response based on the most similar document
      const response = this.generateResponseFromDocument(mostSimilarDoc);
      return response;
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
    // This is a very simple response generation.
    // In a more advanced system, you'd use more sophisticated NLP techniques.
    return doc.join(' ');
  }

  saveModel(filename) {
    const modelData = {
      tfidf: this.tfidf,
      classifier: this.classifier.save(),
      documents: this.documents
    };
    fs.writeFileSync(filename, JSON.stringify(modelData));
  }

  loadModel(filename) {
    const modelData = JSON.parse(fs.readFileSync(filename, 'utf-8'));
    this.tfidf = new natural.TfIdf(modelData.tfidf);
    this.classifier = natural.BayesClassifier.restore(modelData.classifier);
    this.documents = modelData.documents;
  }
}

module.exports = CustomAI;