const mongoose = require('mongoose');

const lectureMeetingSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, index: true },
  contentType: { type: String, enum: ['audio', 'text'], required: true },
  mode: { type: String, enum: ['meeting', 'lecture'], required: true },
  originalFilename: { type: String },
  transcript: { type: String },
  summary: { type: String },
  bulletNotes: [String],
  keyTopics: [String],
  decisions: [String],
  actionItems: [{
    task: String,
    assignee: String,
    deadline: String,
    completed: { type: Boolean, default: false }
  }],
  studyNotes: [{
    topic: String,
    content: String
  }],
  definitions: [{
    term: String,
    definition: String
  }],
  qna: [{
    question: String,
    answer: String
  }],
  chatHistory: [{
    role: { type: String, enum: ['user', 'assistant'] },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  processingStatus: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending' },
}, { timestamps: true });

lectureMeetingSchema.index({ title: 'text' });
lectureMeetingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('LectureMeeting', lectureMeetingSchema);
