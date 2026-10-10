const express = require('express');
const router = express.Router();
const { getChatHistory, askQuestion } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.get('/:id', protect, getChatHistory);
router.post('/:id', protect, askQuestion);

module.exports = router;
