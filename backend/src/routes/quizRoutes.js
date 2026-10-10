const express = require('express');
const router = express.Router();
const { generateQuiz, getQuiz, submitQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

router.post('/:sessionId/generate', protect, generateQuiz);
router.get('/session/:sessionId', protect, getQuiz);
router.post('/:quizId/submit', protect, submitQuiz);

module.exports = router;
