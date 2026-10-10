import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mic, FileText, ChevronRight, Clock, Plus, BarChart2, BookOpen, Users } from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const [recentSessions, setRecentSessions] = useState([]);
  const [stats, setStats] = useState({ total: 0, meetings: 0, lectures: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/sessions?limit=5');
        setRecentSessions(res.data.sessions);
        
        // Calculate basic stats from recent data if full stats endpoint doesn't exist
        // The current API just returns sessions, so we'll use that for a generic count.
        const allRes = await api.get('/sessions?limit=100');
        const allSessions = allRes.data.sessions || [];
        setStats({
          total: allSessions.length,
          meetings: allSessions.filter(s => s.mode === 'meeting').length,
          lectures: allSessions.filter(s => s.mode === 'lecture').length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-lavender-light/40 to-powder/30 rounded-3xl p-10 border border-white shadow-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lavender/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Turn conversations into clarity.</h1>
          <p className="text-lg text-gray-500 mb-8">Upload your lectures and meetings. Let MindNotes AI generate intelligent summaries, study notes, and action items instantly.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/upload" className="btn-primary px-6 py-3 text-base group">
              <Mic className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Upload Audio
            </Link>
            <Link to="/upload" className="btn-secondary px-6 py-3 text-base">
              <FileText className="w-5 h-5 mr-2 text-lavender-dark" />
              Paste Transcript
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {!loading && stats.total > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-soft p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-lavender-light flex items-center justify-center text-lavender-dark">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Sessions</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
            </div>
          </div>
          <div className="card-soft p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-powder flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Meetings</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.meetings}</h3>
            </div>
          </div>
          <div className="card-soft p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-sage flex items-center justify-center text-emerald-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Lectures</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.lectures}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div className="space-y-4">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Sessions</h2>
          <Link to="/history" className="text-sm font-medium text-lavender-dark hover:text-lavender transition-colors flex items-center">
            View all <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="card-soft p-6 h-32 animate-pulse bg-white/50 border-gray-100"></div>
            ))}
          </div>
        ) : recentSessions.length === 0 ? (
          <div className="card-soft p-12 text-center border-dashed border-2 border-gray-200 bg-gray-50/50">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FileText className="w-8 h-8 text-lavender-light" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No sessions yet</h3>
            <p className="text-gray-500 mb-6">Create your first AI-powered session to get started.</p>
            <Link to="/upload" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" /> Create Session
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentSessions.map((session) => (
              <Link key={session._id} to={`/transcript/${session._id}`} className="card-soft p-6 hover:shadow-md transition-shadow group relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${session.mode === 'meeting' ? 'bg-powder' : 'bg-sage'}`}></div>
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${session.mode === 'meeting' ? 'bg-powder text-blue-700' : 'bg-sage text-emerald-700'}`}>
                    {session.mode}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(session.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-lavender-dark transition-colors line-clamp-1">{session.title}</h3>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {session.summary ? session.summary : 'Transcript ready for AI analysis.'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
