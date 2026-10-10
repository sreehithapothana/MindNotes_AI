const LectureMeeting = require('../models/LectureMeeting');
const { generateMeetingMinutes, generateStudyNotes } = require('../services/aiService');

const processMeetingMinutes = async (req, res, next) => {
  try {
    const session = await LectureMeeting.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.ownerId.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    if (!session.transcript) return res.status(400).json({ message: 'No transcript available for this session' });

    const aiData = await generateMeetingMinutes(session.transcript);

    // Update session
    session.summary = aiData.summary;
    session.bulletNotes = aiData.bulletNotes;
    session.keyTopics = aiData.keyTopics;
    session.decisions = aiData.decisions;
    session.actionItems = aiData.actionItems;
    session.qna = aiData.qna;
    
    await session.save();
    res.json(session);
  } catch (error) {
    next(error);
  }
};

const processStudyNotes = async (req, res, next) => {
  try {
    const session = await LectureMeeting.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.ownerId.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    if (!session.transcript) return res.status(400).json({ message: 'No transcript available for this session' });

    const aiData = await generateStudyNotes(session.transcript);

    // Update session
    session.summary = aiData.summary;
    session.studyNotes = aiData.studyNotes;
    session.definitions = aiData.definitions;
    session.qna = aiData.qna;
    
    await session.save();
    res.json(session);
  } catch (error) {
    next(error);
  }
};

module.exports = { processMeetingMinutes, processStudyNotes };
