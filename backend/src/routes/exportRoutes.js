const express = require('express');
const router = express.Router();
const { exportPdf, exportDocx } = require('../controllers/exportController');
const { protect } = require('../middleware/auth');

router.get('/pdf/:id', protect, exportPdf);
router.get('/docx/:id', protect, exportDocx);

module.exports = router;
