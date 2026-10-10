import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Loader, FileCheck, AlertCircle, RefreshCw, Download, HelpCircle } from 'lucide-react';
import api from '../services/api';

export default function StudyNotes() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const fetchSession = async () => {
    try {
      const res = await api.get(`/sessions/${id}`);
      setSession(res.data);
    } catch (err) {
      setError('Failed to load study notes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [id]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const res = await api.post(`/ai/study-notes/${id}`);
      setSession(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'AI Generation failed.');
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = (format) => {
    const token = localStorage.getItem('token');
    const url = `http://localhost:5000/api/export/${format}/${id}?token=${token}`;
    window.open(url, '_blank');
  };

  if (loading) return <div className="flex justify-center mt-32"><Loader className="w-8 h-8 animate-spin text-lavender" /></div>;
  if (error) return <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 mt-6 max-w-4xl mx-auto flex items-center shadow-sm"><AlertCircle className="w-5 h-5 mr-3"/>{error}</div>;

  const hasAIContent = session?.summary || (session?.studyNotes && session.studyNotes.length > 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-sage flex items-center justify-center mr-3 shadow-sm">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            {session?.title}
          </h1>
          <p className="text-gray-500 mt-2">Structured study notes and definitions extracted by MindNotes AI.</p>
        </div>
        <div className="flex space-x-3">
          {hasAIContent && !generating && (
            <>
              <button onClick={() => handleExport('pdf')} className="btn-secondary">
                <Download className="w-4 h-4 mr-2 text-lavender-dark" /> PDF
              </button>
              <button onClick={() => handleExport('docx')} className="btn-secondary">
                <Download className="w-4 h-4 mr-2 text-lavender-dark" /> DOCX
              </button>
            </>
          )}
          <button 
            onClick={handleGenerate}
            disabled={generating}
            className="btn-primary"
          >
            {generating ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            {hasAIContent ? 'Regenerate' : 'Generate Notes'}
          </button>
        </div>
      </div>

      {!hasAIContent && !generating ? (
        <div className="card-soft p-16 text-center bg-gray-50/30">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
            <FileCheck className="w-10 h-10 text-lavender-light" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ready for AI Analysis</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Click the button below to automatically extract structured study topics, definitions, and key revision notes.</p>
          <button onClick={handleGenerate} className="btn-primary px-8 py-3 text-lg">
            <RefreshCw className="w-5 h-5 mr-2" /> Generate Notes
          </button>
        </div>
      ) : generating ? (
        <div className="card-soft p-16 text-center bg-gradient-to-b from-white to-sage/20">
          <Loader className="w-12 h-12 text-lavender animate-spin mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900">Structuring Study Notes...</h3>
          <p className="text-gray-500 mt-2">Identifying key academic concepts and definitions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="card-soft p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sage/30 rounded-bl-full -mr-4 -mt-4"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 relative z-10">Lecture Overview</h2>
              <p className="text-gray-700 leading-relaxed relative z-10 text-lg">{session.summary}</p>
            </div>

            <div className="card-soft p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-lavender-light flex items-center justify-center mr-3">
                  <BookOpen className="w-4 h-4 text-lavender-dark" />
                </span>
                Structured Topics
              </h2>
              <div className="space-y-8">
                {session.studyNotes?.map((note, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-lavender-light">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-white border-2 border-lavender rounded-full"></div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{note.topic}</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="card-soft p-6 sticky top-28 bg-gradient-to-b from-white to-powder/30">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3 shadow-sm">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                </div>
                Key Definitions
              </h2>
              {session.definitions?.length > 0 ? (
                <div className="space-y-4">
                  {session.definitions.map((def, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <p className="font-bold text-lavender-dark mb-1">{def.term}</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{def.definition}</p>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-500 italic">No definitions found.</p>}
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Test Your Knowledge</h3>
                <Link to={`/quiz/${id}`} className="btn-primary w-full shadow-md">
                  <HelpCircle className="w-4 h-4 mr-2" /> Generate Quiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
