import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Loader, Save, MessageSquare, BookOpen, CheckSquare, Edit3 } from 'lucide-react';
import api from '../services/api';

export default function Transcript() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/sessions/${id}`);
        setSession(res.data);
        setTitle(res.data.title);
        setTranscriptText(res.data.transcript || '');
      } catch (err) {
        setError('Failed to load session details.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put(`/sessions/${id}`, { title, transcript: transcriptText });
      setSession(res.data);
      setIsEditing(false);
    } catch (err) {
      alert('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center mt-32"><Loader className="w-8 h-8 animate-spin text-lavender" /></div>;
  if (error) return <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 mt-6 max-w-4xl mx-auto shadow-sm">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-lavender-light shadow-soft">
        <div className="flex-1 w-full">
          {isEditing ? (
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold w-full bg-gray-50 border border-gray-200 rounded-xl p-2 focus:ring-2 focus:ring-lavender-light outline-none"
            />
          ) : (
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
              <span className={`w-3 h-3 rounded-full mr-3 ${session.mode === 'meeting' ? 'bg-powder border-blue-500' : 'bg-sage border-emerald-500'} border-2`}></span>
              {session.title}
            </h1>
          )}
          <p className="text-gray-500 mt-1 ml-6 text-sm">
            {new Date(session.createdAt).toLocaleString()} • <span className="capitalize">{session.mode}</span> Mode
          </p>
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          {isEditing ? (
            <>
              <button onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn-secondary">
              <Edit3 className="w-4 h-4 mr-2 text-lavender-dark" /> Edit
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="card-soft p-8 h-[600px] flex flex-col bg-white">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center border-b border-gray-100 pb-4">
              <FileText className="w-5 h-5 mr-2 text-lavender-dark" />
              Source Transcript
            </h2>
            {isEditing ? (
              <textarea 
                className="w-full flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-lavender-light outline-none resize-none"
                value={transcriptText}
                onChange={(e) => setTranscriptText(e.target.value)}
              ></textarea>
            ) : (
              <div className="flex-1 overflow-y-auto pr-4 text-gray-700 leading-loose whitespace-pre-wrap text-lg font-serif">
                {session.transcript || <span className="italic text-gray-400">No transcript content available.</span>}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">AI Tools</h3>
          
          <Link to={`/chat/${session._id}`} className="flex flex-col items-center p-6 bg-white border border-lavender-light rounded-2xl hover:shadow-md transition-all group">
            <div className="w-12 h-12 bg-powder rounded-full flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="font-bold text-gray-900 group-hover:text-lavender-dark transition-colors">Chat</span>
            <span className="text-xs text-gray-500 text-center mt-1">Ask questions</span>
          </Link>
          
          {session.mode === 'meeting' ? (
            <Link to={`/meeting-minutes/${session._id}`} className="flex flex-col items-center p-6 bg-white border border-lavender-light rounded-2xl hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-peach rounded-full flex items-center justify-center text-orange-600 mb-3 group-hover:scale-110 transition-transform">
                <CheckSquare className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-900 group-hover:text-lavender-dark transition-colors">Minutes</span>
              <span className="text-xs text-gray-500 text-center mt-1">Decisions & Actions</span>
            </Link>
          ) : (
            <>
              <Link to={`/study-notes/${session._id}`} className="flex flex-col items-center p-6 bg-white border border-lavender-light rounded-2xl hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-sage rounded-full flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="font-bold text-gray-900 group-hover:text-lavender-dark transition-colors">Study Notes</span>
                <span className="text-xs text-gray-500 text-center mt-1">Structured summary</span>
              </Link>
              
              <Link to={`/quiz/${session._id}`} className="flex flex-col items-center p-6 bg-white border border-lavender-light rounded-2xl hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-lavender-light rounded-full flex items-center justify-center text-lavender-dark mb-3 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="font-bold text-gray-900 group-hover:text-lavender-dark transition-colors">Quiz Studio</span>
                <span className="text-xs text-gray-500 text-center mt-1">Test knowledge</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
