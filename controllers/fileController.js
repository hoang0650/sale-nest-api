const {Image} = require('../models/fileModel') 
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const multer = require('multer'); // Added multer for handling multiple files
async function uploadImages(req, res) {
  try {
    if (!req.files) {
      return res.status(400).send('No files uploaded.');
    }

    const uploadedImages = [];
    
    // Loop through uploaded files
    for (const file of req.files) {
      const resizedImageBuffer = await sharp(file.buffer)
        .resize(800)
        .jpeg({ quality: 80 })
        .toBuffer();

      const image = new Image({
        filename: `${uuidv4()}.jpg`,
        data: resizedImageBuffer,
        contentType: 'image/jpeg'
      });

      await image.save();
      uploadedImages.push(image);
    }

    res.json({ message: 'Images uploaded successfully!', images: uploadedImages });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading files.');
  }
}

async function getAllImage(req, res) {
  const { search } = req.query;

  try {
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { filename: { $regex: search, $options: 'i' } }, // tìm kiếm theo tên
          { data: { $regex: search, $options: 'i' } }, // tìm kiếm theo mô tả
          { contentType: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const products = await Image.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

module.exports = {uploadImages,getAllImage,getImageById}