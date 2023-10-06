const express = require('express');
const uploadPhotoController = require('../controllers/uploadPhotoController');

const router = express.Router();

router.post('/upload', uploadPhotoController.postUpload);
router.get('/lastUpload', uploadPhotoController.getUpload);

module.exports = router;
