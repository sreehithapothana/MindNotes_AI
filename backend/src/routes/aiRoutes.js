const express = require('express');
const router = express.Router();
const { processMeetingMinutes, processStudyNotes } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/meeting-minutes/:id', protect, processMeetingMinutes);
router.post('/study-notes/:id', protect, processStudyNotes);

module.exports = router;
