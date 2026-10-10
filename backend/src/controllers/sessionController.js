const LectureMeeting = require('../models/LectureMeeting');

// @desc    Create a new session
// @route   POST /api/sessions
// @access  Private
const createSession = async (req, res, next) => {
  try {
    const { title, contentType, mode, originalFilename, transcript } = req.body;
    
    if (!title || !contentType || !mode) {
      res.status(400);
      throw new Error('Please add all required fields');
    }

    const session = await LectureMeeting.create({
      ownerId: req.user._id,
      title,
      contentType,
      mode,
      originalFilename,
      transcript
    });

    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user sessions with pagination, search, filter, and sort
// @route   GET /api/sessions
// @access  Private
const getSessions = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    
    const keyword = req.query.keyword
      ? {
          $or: [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { transcript: { $regex: req.query.keyword, $options: 'i' } }
          ]
        }
      : {};
      
    const mode = req.query.mode ? { mode: req.query.mode } : {};
    const sortParams = req.query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const query = { ownerId: req.user._id, ...keyword, ...mode };
    const count = await LectureMeeting.countDocuments(query);
    
    const sessions = await LectureMeeting.find(query)
      .sort(sortParams)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ sessions, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single session by ID
// @route   GET /api/sessions/:id
// @access  Private
const getSessionById = async (req, res, next) => {
  try {
    const session = await LectureMeeting.findById(req.params.id);

    if (session) {
      if (session.ownerId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to access this session');
      }
      res.json(session);
    } else {
      res.status(404);
      throw new Error('Session not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private
const updateSession = async (req, res, next) => {
  try {
    const session = await LectureMeeting.findById(req.params.id);

    if (!session) {
      res.status(404);
      throw new Error('Session not found');
    }

    if (session.ownerId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to update this session');
    }

    const updatedSession = await LectureMeeting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedSession);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private
const deleteSession = async (req, res, next) => {
  try {
    const session = await LectureMeeting.findById(req.params.id);

    if (!session) {
      res.status(404);
      throw new Error('Session not found');
    }

    if (session.ownerId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this session');
    }

    await session.deleteOne();
    res.json({ message: 'Session removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession
};
