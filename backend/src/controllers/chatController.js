const LectureMeeting = require('../models/LectureMeeting');
const OpenAI = require('openai');

function chunkText(text, chunkSize = 800) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  return chunks;
}

function retrieveRelevantChunks(query, chunks, topK = 3) {
  if (chunks.length <= topK) return chunks.join('\n\n');
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  if (queryWords.length === 0) return chunks.slice(0, topK).join('\n\n');
  
  const scoredChunks = chunks.map(chunk => {
    const chunkLower = chunk.toLowerCase();
    let score = 0;
    queryWords.forEach(qw => {
      if (chunkLower.includes(qw)) score++;
    });
    return { chunk, score };
  });
  
  scoredChunks.sort((a, b) => b.score - a.score);
  return scoredChunks.slice(0, topK).map(sc => sc.chunk).join('\n...[transcript truncated]...\n');
}

const getChatHistory = async (req, res, next) => {
  try {
    const session = await LectureMeeting.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.ownerId.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    
    res.json(session.chatHistory || []);
  } catch (error) {
    next(error);
  }
};

const askQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: 'Question is required' });

    const session = await LectureMeeting.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.ownerId.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({ message: 'GROQ_API_KEY is not configured.' });
    }

    const chunks = chunkText(session.transcript || '');
    const relevantContext = retrieveRelevantChunks(question, chunks, 3);
    
    const openai = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' });
    
    const systemPrompt = `You are a helpful assistant answering questions strictly based on the provided session transcript.
Rules:
1. ONLY use the provided transcript context to answer the question.
2. If the answer is not available in the transcript, say "I cannot find the answer to this question in the transcript."
3. Do not invent or hallucinate information.
4. Where practical, quote or mention supporting excerpts.

Transcript Context:
${relevantContext}
`;
    
    const messages = [
      { role: 'system', content: systemPrompt }
    ];
    
    // Add last 4 messages for conversational context
    const recentHistory = (session.chatHistory || []).slice(-4);
    recentHistory.forEach(msg => {
      messages.push({ role: msg.role, content: msg.content });
    });
    
    messages.push({ role: 'user', content: question });

    const response = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: messages
    });

    const answer = response.choices[0].message.content;

    // Save to history
    session.chatHistory.push({ role: 'user', content: question });
    session.chatHistory.push({ role: 'assistant', content: answer });
    await session.save();

    res.json(session.chatHistory);
  } catch (error) {
    next(error);
  }
};

module.exports = { getChatHistory, askQuestion };
