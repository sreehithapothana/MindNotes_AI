const Quiz = require('../models/Quiz');
const LectureMeeting = require('../models/LectureMeeting');
const OpenAI = require('openai');

const generateQuiz = async (req, res, next) => {
  try {
    const { count = 5, difficulty = 'medium' } = req.body;
    const sessionId = req.params.sessionId;

    const session = await LectureMeeting.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.ownerId.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    if (!session.transcript || session.transcript.length < 100) {
      return res.status(400).json({ message: 'Transcript is too short or missing to generate a quiz.' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({ message: 'GROQ_API_KEY is not configured.' });
    }

    const openai = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' });
    
    const prompt = `You are an expert educator. Based on the following transcript, generate exactly ${count} multiple-choice questions at a ${difficulty} difficulty level.
    Ensure the correct answer is directly supported by the transcript material.
    
    Respond STRICTLY with a JSON object in this format:
    {
      "questions": [
        {
          "questionText": "...",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswerIndex": 0,
          "explanation": "Explanation of why this is correct."
        }
      ]
    }
    
    Transcript: ${session.transcript}`;

    const response = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const aiData = JSON.parse(response.choices[0].message.content);
    
    if (!aiData.questions || !Array.isArray(aiData.questions)) {
      throw new Error('Malformed AI response.');
    }

    // Delete existing quiz for this session if regenerating
    await Quiz.deleteMany({ sessionId });

    const newQuiz = await Quiz.create({
      sessionId,
      ownerId: req.user._id,
      questions: aiData.questions,
      attempts: []
    });

    // Return sanitized quiz (hide answers and explanations)
    const sanitizedQuestions = newQuiz.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options
    }));

    res.status(201).json({
      _id: newQuiz._id,
      sessionId: newQuiz.sessionId,
      questions: sanitizedQuestions
    });

  } catch (error) {
    next(error);
  }
};

const getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ sessionId: req.params.sessionId });
    if (!quiz) return res.status(404).json({ message: 'No quiz found for this session' });
    if (quiz.ownerId.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    const sanitizedQuestions = quiz.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options
    }));

    res.json({
      _id: quiz._id,
      sessionId: quiz.sessionId,
      questions: sanitizedQuestions,
      attempts: quiz.attempts
    });
  } catch (error) {
    next(error);
  }
};

const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body; // Array of selected indices
    const quiz = await Quiz.findById(req.params.quizId);
    
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    if (quiz.ownerId.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    let score = 0;
    const results = quiz.questions.map((q, index) => {
      const isCorrect = q.correctAnswerIndex === answers[index];
      if (isCorrect) score += 1;
      return {
        questionId: q._id,
        questionText: q.questionText,
        options: q.options,
        userAnswer: answers[index],
        correctAnswerIndex: q.correctAnswerIndex,
        explanation: q.explanation,
        isCorrect
      };
    });

    const attempt = {
      score,
      totalQuestions: quiz.questions.length
    };
    
    quiz.attempts.push(attempt);
    await quiz.save();

    res.json({
      score,
      totalQuestions: quiz.questions.length,
      results
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateQuiz, getQuiz, submitQuiz };
