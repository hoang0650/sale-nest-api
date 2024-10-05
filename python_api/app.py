import os
from flask import Flask, request, jsonify
from predict import generate_text, model, max_sequence_len
from flask_cors import CORS
import cv2
import numpy as np
import pytesseract
from PIL import Image
import tensorflow as tf

app = Flask(__name__)
CORS(app)

# Load pre-trained model for object detection
model = tf.saved_model.load('models/train_model')

# Load model AI datatrain
@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    seed_text = data['seed_text']
    next_words = data['next_words']
    generated_text = generate_text(seed_text, next_words, model, max_sequence_len)
    return jsonify({'generated_text': generated_text})

@app.route('/api/ai/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    response = f"Python API nhận được: {user_message}"
    return jsonify({"response": response})

@app.route('/api/ai/ocr', methods=['POST'])
def ocr():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        image = Image.open(file.stream)
        text = pytesseract.image_to_string(image)
        return jsonify({"text": text})

@app.route('/api/object-detection', methods=['POST'])
def object_detection():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        # Read the image file
        nparr = np.fromstring(file.read(), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Prepare the image for object detection
        input_tensor = tf.convert_to_tensor(img)
        input_tensor = input_tensor[tf.newaxis, ...]

        # Perform object detection
        detections = model(input_tensor)

        # Process the results
        num_detections = int(detections.pop('num_detections'))
        detections = {key: value[0, :num_detections].numpy() 
                      for key, value in detections.items()}
        detections['num_detections'] = num_detections
        detections['detection_classes'] = detections['detection_classes'].astype(np.int64)

        # Return the results
        return jsonify({"detections": detections.tolist()})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)