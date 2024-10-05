import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import string

nltk.download('punkt')
nltk.download('stopwords')

def preprocess_text(text):
    # Chuyển về chữ thường
    text = text.lower()
    
    # Loại bỏ dấu câu
    text = text.translate(str.maketrans('', '', string.punctuation))
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Loại bỏ stopwords
    stop_words = set(stopwords.words('english'))
    tokens = [token for token in tokens if token not in stop_words]
    
    return tokens

# Đọc corpus từ file
with open('corpus.txt', 'r', encoding='utf-8') as f:
    corpus = f.readlines()

# Tiền xử lý
preprocessed_corpus = [preprocess_text(text) for text in corpus]

# Lưu corpus đã tiền xử lý
with open('preprocessed_corpus.txt', 'w', encoding='utf-8') as f:
    for tokens in preprocessed_corpus:
        f.write(' '.join(tokens) + '\n')