import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HelpCircle, Loader, AlertCircle, CheckCircle, XCircle, ArrowRight, BookOpen, Target, Settings, PlayCircle } from 'lucide-react';
import api from '../services/api';

export default function Quiz() {
  const { id } = useParams(); // Session ID
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  
  // Quiz config
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');

  // Quiz state
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  const fetchQuiz = async () => {
    try {
      const res = await api.get(`/quizzes/${id}`);
      setQuiz(res.data);
      setAnswers(new Array(res.data.questions.length).fill(null));
      // Show most recent attempt if exists
      if (res.data.attempts && res.data.attempts.length > 0) {
        // Just acknowledging it exists, but we'll let user take it again
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to fetch quiz');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const res = await api.post(`/quizzes/${id}/generate`, { count, difficulty });
      setQuiz(res.data);
      setAnswers(new Array(res.data.questions.length).fill(null));
      setSubmitted(false);
      setResult(null);
      setCurrentQIndex(0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate quiz');
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectOption = (qIndex, oIndex) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = oIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post(`/quizzes/${quiz._id}/submit`, { answers });
      setResult(res.data);
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < quiz.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  };

  if (loading && !quiz && !generating) return <div className="flex justify-center mt-32"><Loader className="w-8 h-8 animate-spin text-lavender" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-peach flex items-center justify-center mr-3 shadow-sm">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            Quiz Studio
          </h1>
          <p className="text-gray-500 mt-2">Test your knowledge with AI-generated questions from the transcript.</p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center"><AlertCircle className="w-5 h-5 mr-3"/>{error}</div>}

      {!quiz ? (
        <div className="card-soft p-10 bg-white">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-gray-100">
              <Settings className="w-10 h-10 text-lavender-light" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Configure Your Quiz</h3>
            
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                <input 
                  type="number" 
                  min="1" max="15" 
                  value={count} 
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-lavender-light focus:bg-white transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-lavender-light focus:bg-white transition-all outline-none"
                >
                  <option value="easy">Easy (Recall basic facts)</option>
                  <option value="medium">Medium (Understand concepts)</option>
                  <option value="hard">Hard (Apply and analyze)</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={generating}
              className="btn-primary w-full py-3 text-lg mt-6"
            >
              {generating ? <Loader className="w-5 h-5 mr-2 animate-spin" /> : <PlayCircle className="w-5 h-5 mr-2" />}
              {generating ? 'Generating Quiz...' : 'Start Quiz'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Progress / Score Header */}
          <div className="card-soft p-6 flex flex-col md:flex-row justify-between items-center bg-white">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-12 h-12 rounded-full bg-lavender-light flex items-center justify-center text-lavender-dark font-bold text-lg">
                {submitted ? `${result.score}/${result.totalQuestions}` : `${currentQIndex + 1}/${quiz.questions.length}`}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{submitted ? 'Quiz Results' : 'Active Quiz'}</h3>
                {submitted && (
                  <p className="text-sm font-medium text-lavender-dark">
                    Score: {Math.round((result.score / result.totalQuestions) * 100)}%
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-3">
              {submitted ? (
                <button onClick={() => { setQuiz(null); }} className="btn-secondary">
                  Take Another Quiz
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={answers.includes(null) || loading}
                  className="btn-primary"
                >
                  {loading ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Submit Answers
                </button>
              )}
            </div>
          </div>

          {/* Question Display */}
          {!submitted ? (
            <div className="card-soft p-8 bg-white relative overflow-hidden min-h-[400px] flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lavender-light/30 rounded-bl-full -mr-4 -mt-4"></div>
              
              <div className="flex-1 relative z-10">
                <span className="text-sm font-bold text-lavender uppercase tracking-wider mb-2 block">Question {currentQIndex + 1}</span>
                <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
                  {quiz.questions[currentQIndex].questionText}
                </h2>
                
                <div className="space-y-3">
                  {quiz.questions[currentQIndex].options.map((opt, oIndex) => (
                    <button
                      key={oIndex}
                      onClick={() => handleSelectOption(currentQIndex, oIndex)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center ${
                        answers[currentQIndex] === oIndex 
                          ? 'border-lavender bg-lavender/5 text-lavender-dark font-medium shadow-sm transform scale-[1.01]' 
                          : 'border-gray-100 hover:border-lavender-light hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 ${
                        answers[currentQIndex] === oIndex ? 'border-lavender bg-lavender' : 'border-gray-300'
                      }`}>
                        {answers[currentQIndex] === oIndex && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-10 pt-6 border-t border-gray-100 relative z-10">
                <button 
                  onClick={prevQuestion}
                  disabled={currentQIndex === 0}
                  className="btn-secondary disabled:opacity-30"
                >
                  Previous
                </button>
                <button 
                  onClick={nextQuestion}
                  disabled={currentQIndex === quiz.questions.length - 1}
                  className="btn-secondary disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {result.results.map((r, i) => (
                <div key={r.questionId} className={`card-soft p-6 border-2 ${r.isCorrect ? 'border-emerald-100 bg-emerald-50/20' : 'border-red-100 bg-red-50/20'}`}>
                  <div className="flex items-start mb-4">
                    {r.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-emerald-500 mr-3 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                    )}
                    <h3 className="text-lg font-bold text-gray-900 leading-relaxed">{r.questionText}</h3>
                  </div>
                  
                  <div className="ml-9 space-y-2 mb-6">
                    {r.options.map((opt, oIdx) => {
                      let btnClass = "w-full text-left p-3 rounded-xl border text-sm flex items-center";
                      if (oIdx === r.correctAnswerIndex) {
                        btnClass += " border-emerald-500 bg-emerald-50 text-emerald-800 font-medium";
                      } else if (oIdx === r.userAnswer && !r.isCorrect) {
                        btnClass += " border-red-500 bg-red-50 text-red-800 line-through opacity-70";
                      } else {
                        btnClass += " border-gray-200 bg-white text-gray-500 opacity-50";
                      }
                      
                      return (
                        <div key={oIdx} className={btnClass}>
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="ml-9 p-4 bg-white rounded-xl border border-gray-100 text-sm">
                    <span className="font-bold text-gray-900 block mb-1">Explanation:</span>
                    <span className="text-gray-600 leading-relaxed">{r.explanation}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
