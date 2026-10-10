# AI-Powered Lecture and Meeting Assistant

A full-stack web application that transforms audio recordings or text transcripts into structured notes, meeting minutes, action items, study materials, and quizzes using Generative AI.

## Features
- **Upload & Transcribe**: Upload MP3/WAV/M4A files for automatic transcription using OpenAI Whisper.
- **Meeting Minutes**: AI automatically extracts executive summaries, decisions, action items (with owners and deadlines), and Q&A.
- **Lecture Study Notes**: AI automatically extracts structured topics, key definitions, and potential exam questions.
- **Chat with Transcript**: Ask an AI assistant questions specifically restricted to your transcript content (RAG-based).
- **Quiz Generator**: Dynamically generate multiple-choice quizzes (Easy/Medium/Hard) to test your knowledge against the transcript.
- **Export**: Export professional PDF and DOCX documents containing your minutes or study notes.
- **Search & History**: Fully searchable and filterable history dashboard of all your sessions.

## Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS v4, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Mongoose)
- **Authentication**: JWT, bcrypt
- **AI Integration**: OpenAI (Whisper for STT, GPT-4o-mini for LLM generation)
- **Export**: pdfkit, docx

## Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- OpenAI API Key

## Configuration

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `backend` folder with the following credentials:

```env
# MongoDB Connection String
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/noteassist?retryWrites=true&w=majority"

# JWT Secret for Authentication
JWT_SECRET="your_super_secret_jwt_key_here"

# OpenAI API Key for AI features and Transcription
OPENAI_API_KEY="sk-proj-your-api-key-here"
```
*(Note: If you are behind a corporate firewall that blocks DNS SRV, use the standard connection string format instead of `mongodb+srv://`)*

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`

## Running the Application

**Start the Backend API:**
```bash
cd backend
npm run dev
```
*(Runs on http://localhost:5000)*

**Start the Frontend UI:**
```bash
cd frontend
npm run dev
```
*(Runs on http://localhost:5173)*

## Testing & Automation
Python test scripts are provided to verify the core backend workflows without the UI:
- `test_auth.py`: Tests registration, login, rate limiting, and route protection.
- `test_upload.py`: Tests text pasting and Multer audio upload blocks.
- `test_e2e.py`: Tests the entire end-to-end CRUD lifecycle (Registration -> Auth -> Upload -> Edit -> History Search -> Delete).

To run a test, execute it via Python:
`python scratch/test_e2e.py`

## Troubleshooting
- **AI Generation returns "Error: 429 You have no credits remaining"**: Your OpenAI API key is valid but the billing account has zero balance. Add credits at platform.openai.com.
- **MongoDB Connection Error**: Check your MONGODB_URI and ensure your IP address is whitelisted in your MongoDB Atlas Network Access settings.
