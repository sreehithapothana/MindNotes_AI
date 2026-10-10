const express = require('express');
const router = express.Router();
const { upload, processUpload } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

router.post('/', protect, upload.single('file'), processUpload);

module.exports = router;
