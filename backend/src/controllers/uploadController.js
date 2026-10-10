const multer = require('multer');
const fs = require('fs');
const OpenAI = require('openai');
const LectureMeeting = require('../models/LectureMeeting');

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`)
});

const upload = multer({ 
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB Whisper Limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio and video files are allowed!'), false);
    }
  }
});

const processUpload = async (req, res, next) => {
  try {
    const { title, mode, textContent } = req.body;
    let transcript = textContent || '';
    
    if (!title || !mode) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Title and mode are required' });
    }

    // Create DB entry immediately to track status
    const session = await LectureMeeting.create({
      ownerId: req.user._id,
      title,
      contentType: req.file ? 'audio' : 'text',
      mode,
      originalFilename: req.file ? req.file.originalname : undefined,
      processingStatus: req.file ? 'processing' : 'completed',
      transcript: transcript
    });

    if (req.file) {
      if (!process.env.GROQ_API_KEY) {
        fs.unlinkSync(req.file.path);
        session.processingStatus = 'failed';
        await session.save();
        return res.status(503).json({ message: "GROQ_API_KEY is not configured in the backend environment. Please add it to your .env file." });
      }

      const openai = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' });
      
      try {
        const audioFile = fs.createReadStream(req.file.path);
        const transcription = await openai.audio.transcriptions.create({
          file: audioFile,
          model: 'whisper-large-v3'
        });
        
        session.transcript = transcription.text;
        session.processingStatus = 'completed';
        await session.save();
      } catch (err) {
        session.processingStatus = 'failed';
        await session.save();
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(502).json({ message: 'Transcription failed: ' + err.message });
      } finally {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      }
    }
    
    res.status(201).json(session);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    next(error);
  }
};

module.exports = { upload, processUpload };
