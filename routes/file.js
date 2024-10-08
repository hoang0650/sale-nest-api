var express = require('express');
var router = express.Router();
const {uploadImages, getImageById, getAllImage} = require('../controllers/fileController');
const multer = require('multer');
// Cấu hình multer để lưu trữ ảnh tạm thời
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload an image
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: The file to upload.
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       500:
 *         description: Server error
 */
router.post('/upload/image',upload.array('images',30), uploadImages);
/**
 * @swagger
 * /api/image/{filename}:
 *   get:
 *     summary: Get an image by filename
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The filename of the image
 *     responses:
 *       200:
 *         description: Image retrieved successfully
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Image not found
 */
router.get('/upload/image/:id', getImageById);
/**
 * @swagger
 * /api/image/{filename}:
 *   get:
 *     summary: Get all image by filename
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The filename of the image
 *     responses:
 *       200:
 *         description: Image retrieved successfully
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Image not found
 */
router.get('/upload/image', getAllImage);

module.exports = router;
