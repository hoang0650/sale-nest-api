const {Image} = require('../models/fileModel') 
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // Resize ảnh và chuyển đổi sang JPEG
    const resizedImageBuffer = await sharp(req.file.buffer)
      .resize(800)
      .jpeg({ quality: 80 })
      .toBuffer();

    // Tạo một đối tượng ảnh mới và lưu vào MongoDB
    const image = new Image({
      filename: `${uuidv4()}.jpg`,
      data: resizedImageBuffer,
      contentType: 'image/jpeg'
    });

    await image.save();

    res.json({ message: 'Image uploaded successfully!', imageId: image._id });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading file.');
  }
}

async function getImageById(req, res) {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).send('Image not found.');
    }

    res.set('Content-Type', image.contentType);
    res.send(image.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving image.');
  }
}

module.exports = {uploadImage,getImageById}