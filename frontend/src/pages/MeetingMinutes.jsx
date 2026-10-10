import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Loader, CheckSquare, Users, AlertCircle, RefreshCw, Download } from 'lucide-react';
import api from '../services/api';

export default function MeetingMinutes() {
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
      setError('Failed to load meeting minutes.');
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
      const res = await api.post(`/ai/meeting-minutes/${id}`);
      setSession(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'AI Generation failed. Please try again.');
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

  const hasAIContent = session?.summary || (session?.actionItems && session.actionItems.length > 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-powder flex items-center justify-center mr-3 shadow-sm">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            {session?.title}
          </h1>
          <p className="text-gray-500 mt-2">Executive summary, decisions, and action items extracted by MindNotes AI.</p>
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
            {hasAIContent ? 'Regenerate' : 'Generate Minutes'}
          </button>
        </div>
      </div>

      {!hasAIContent && !generating ? (
        <div className="card-soft p-16 text-center bg-gray-50/30">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
            <FileText className="w-10 h-10 text-lavender-light" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ready for AI Analysis</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Click the button below to analyze the transcript and automatically extract executive summaries, decisions, and trackable action items.</p>
          <button onClick={handleGenerate} className="btn-primary px-8 py-3 text-lg">
            <RefreshCw className="w-5 h-5 mr-2" /> Generate Minutes
          </button>
        </div>
      ) : generating ? (
        <div className="card-soft p-16 text-center bg-gradient-to-b from-white to-powder/20">
          <Loader className="w-12 h-12 text-lavender animate-spin mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900">AI is Analyzing the Transcript...</h3>
          <p className="text-gray-500 mt-2">Extracting key decisions and identifying owners.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="card-soft p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lavender/5 rounded-bl-full -mr-4 -mt-4"></div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center relative z-10">
                <span className="w-8 h-8 rounded-lg bg-lavender-light flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 text-lavender-dark" />
                </span>
                Executive Summary
              </h2>
              <p className="text-gray-700 leading-relaxed relative z-10 text-lg">{session.summary}</p>
              
              {session.bulletNotes?.length > 0 && (
                <ul className="mt-6 space-y-3 relative z-10">
                  {session.bulletNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-lavender mt-2.5 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700 leading-relaxed">{note}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="card-soft p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-8 h-8 rounded-lg bg-peach flex items-center justify-center mr-3">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                </span>
                Decisions Made
              </h2>
              {session.decisions?.length > 0 ? (
                <div className="space-y-3 bg-gray-50/50 rounded-xl p-6 border border-gray-100">
                  {session.decisions.map((dec, idx) => (
                    <div key={idx} className="flex items-start">
                      <span className="w-2 h-2 rounded-full bg-orange-400 mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-800 font-medium">{dec}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-500 italic">No explicit decisions recorded.</p>}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="card-soft p-6 sticky top-28 bg-gradient-to-b from-white to-sage/20">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center mr-3 shadow-sm">
                  <CheckSquare className="w-4 h-4 text-emerald-600" />
                </div>
                Action Items
              </h2>
              {session.actionItems?.length > 0 ? (
                <div className="space-y-4">
                  {session.actionItems.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-lavender transition-colors">
                      <p className="font-semibold text-gray-900 mb-3 leading-tight">{item.task}</p>
                      <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                        <span className="bg-powder text-blue-700 px-2.5 py-1 rounded-md">{item.assignee || 'Unassigned'}</span>
                        <span className="bg-peach text-orange-700 px-2.5 py-1 rounded-md">{item.deadline || 'No Date'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No action items identified.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
