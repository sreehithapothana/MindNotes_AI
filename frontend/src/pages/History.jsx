import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Loader, Calendar, FileText, CheckSquare, BookOpen, Trash2, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import api from '../services/api';

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  // Filters
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(9);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/sessions', {
        params: { keyword, mode, page, limit }
      });
      setSessions(res.data.sessions);
      setTotal(res.data.total);
    } catch (err) {
      setError('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [mode, page]); // Re-fetch on filter change or page change

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchSessions();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this session?')) return;
    try {
      await api.delete(`/sessions/${id}`);
      fetchSessions();
    } catch (err) {
      alert('Failed to delete session');
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your History</h1>
        <p className="text-gray-500 mt-2">Find and manage all your past meetings and lectures.</p>
      </div>

      <div className="card-soft p-4 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search titles or transcripts..." 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-lavender-light focus:bg-white transition-all outline-none"
            />
          </div>
          <div className="w-full md:w-48 relative">
            <Filter className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
            <select 
              value={mode} 
              onChange={(e) => { setMode(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-lavender-light focus:bg-white transition-all outline-none appearance-none"
            >
              <option value="">All Types</option>
              <option value="meeting">Meetings</option>
              <option value="lecture">Lectures</option>
            </select>
          </div>
          <button type="submit" className="btn-primary py-3 px-6 whitespace-nowrap">
            Search
          </button>
        </form>
      </div>

      {error && <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-xl border border-red-100">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="card-soft h-48 animate-pulse bg-white/50 border-gray-100"></div>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="card-soft p-16 text-center bg-gray-50/50">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No sessions found</h3>
          <p className="text-gray-500">Try adjusting your search or upload a new recording.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div key={session._id} className="card-soft flex flex-col hover:shadow-md transition-shadow group relative overflow-hidden bg-white">
              <div className={`absolute top-0 left-0 w-full h-1 ${session.mode === 'meeting' ? 'bg-powder' : 'bg-sage'}`}></div>
              
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${session.mode === 'meeting' ? 'bg-powder text-blue-700' : 'bg-sage text-emerald-700'}`}>
                    {session.mode}
                  </span>
                  <button 
                    onClick={() => handleDelete(session._id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-lavender-dark transition-colors">{session.title}</h3>
                
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  {new Date(session.createdAt).toLocaleDateString()}
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                  {session.summary || 'Transcript available for AI processing.'}
                </p>
              </div>
              
              <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex justify-between items-center">
                <Link to={`/transcript/${session._id}`} className="text-sm font-semibold text-lavender-dark hover:text-lavender transition-colors">
                  View Full
                </Link>
                <div className="flex space-x-2">
                  <Link to={`/chat/${session._id}`} className="p-1.5 text-gray-400 hover:text-lavender hover:bg-lavender-light/30 rounded-lg transition-colors" title="Chat">
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                  <Link to={session.mode === 'meeting' ? `/meeting-minutes/${session._id}` : `/study-notes/${session._id}`} className="p-1.5 text-gray-400 hover:text-lavender hover:bg-lavender-light/30 rounded-lg transition-colors" title="AI Notes">
                    {session.mode === 'meeting' ? <CheckSquare className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 space-x-4">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="p-2 border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-colors bg-white shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <span className="text-sm font-medium text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="p-2 border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 transition-colors bg-white shadow-sm"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
}
