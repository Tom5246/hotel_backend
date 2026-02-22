const express = require('express');
const router = express.Router();
const UploadController = require('../controllers/UploadController');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload/single', UploadController.uploadSingle, UploadController.uploadImage);
router.post('/upload/multiple', upload.array('files', 10), UploadController.uploadMultiple);

module.exports = router;