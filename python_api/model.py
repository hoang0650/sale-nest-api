import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Đọc corpus đã tiền xử lý
with open('preprocessed_corpus.txt', 'r', encoding='utf-8') as f:
    corpus = f.readlines()

# Tokenize
tokenizer = Tokenizer()
tokenizer.fit_on_texts(corpus)
total_words = len(tokenizer.word_index) + 1

# Tạo sequences
input_sequences = []
for line in corpus:
    token_list = tokenizer.texts_to_sequences([line])[0]
    for i in range(1, len(token_list)):
        n_gram_sequence = token_list[:i+1]
        input_sequences.append(n_gram_sequence)

# Pad sequences
max_sequence_len = max([len(x) for x in input_sequences])
input_sequences = np.array(pad_sequences(input_sequences, maxlen=max_sequence_len, padding='pre'))

# Tạo predictors và label
X, y = input_sequences[:,:-1], input_sequences[:,-1]
y = np.array([np.zeros(total_words) for _ in range(len(y))])
y[np.arange(len(y)), input_sequences[:,-1]] = 1

# Xây dựng mô hình
model = Sequential()
model.add(Embedding(total_words, 100, input_length=max_sequence_len-1))
model.add(LSTM(150))
model.add(Dense(total_words, activation='softmax'))
model.compile(loss='categorical_crossentropy', optimizer='adam')

# Huấn luyện mô hình
model.fit(X, y, epochs=100, verbose=1)

# Lưu mô hình
model.save('language_model.h5')