const OpenAI = require('openai');

const generateMeetingMinutes = async (transcript) => {
  const openai = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' });
  const prompt = `You are a professional meeting assistant. Based on the following transcript, extract the meeting minutes in strict JSON format. 
  Rules:
  1. Generate a concise summary.
  2. Extract important points as a bullet list.
  3. Identify key topics.
  4. Extract decisions made.
  5. Extract action items (tasks, assignees, deadlines). Use "Not specified" for unknown owners or deadlines.
  6. Extract questions raised and their answers or unresolved status.
  7. NEVER invent decisions, people, dates, or commitments not in the transcript.
  
  JSON Format:
  {
    "summary": "A brief overview...",
    "bulletNotes": ["Important point 1", "Important point 2"],
    "keyTopics": ["Topic 1", "Topic 2"],
    "decisions": ["Decision 1", "Decision 2"],
    "actionItems": [{"task": "Do X", "assignee": "John", "deadline": "Friday"}],
    "qna": [{"question": "What is the budget?", "answer": "Not specified"}]
  }
  
  Transcript: ${transcript}`;

  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
};

const generateStudyNotes = async (transcript) => {
  const openai = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' });
  const prompt = `You are an expert academic tutor. Based on the following lecture transcript, generate structured study notes in strict JSON format.
  Rules:
  1. Generate a concise overview (summary).
  2. Extract key structured notes categorized by topic.
  3. Extract important terminology and definitions.
  4. Suggest potential exam or revision questions with answers based on the material.
  
  JSON Format:
  {
    "summary": "Lecture overview...",
    "studyNotes": [{"topic": "Concept 1", "content": "Detailed explanation..."}],
    "definitions": [{"term": "Term", "definition": "Definition"}],
    "qna": [{"question": "Potential exam question?", "answer": "Answer based on text"}]
  }
  
  Transcript: ${transcript}`;

  const response = await openai.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(response.choices[0].message.content);
};

module.exports = { generateMeetingMinutes, generateStudyNotes };
