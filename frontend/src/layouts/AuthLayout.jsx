import { Outlet, Navigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function AuthLayout() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9FC]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-lavender flex items-center justify-center animate-pulse">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-500">Loading MindNotes AI...</span>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FAF9FC] text-[#302C3B] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-lavender-light selection:text-lavender-dark">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-lavender-light/40 blur-3xl mix-blend-multiply" />
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-powder/50 blur-3xl mix-blend-multiply" />
        <div className="absolute bottom-[5%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-peach/40 blur-3xl mix-blend-multiply" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 rounded-2xl bg-lavender flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-gray-900 group-hover:text-lavender transition-colors">
            MindNotes AI
          </span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors py-1 px-3 rounded-lg hover:bg-white/70"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Home
        </Link>
      </header>

      {/* Main Form & Split Screen Body */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Bottom Minimal Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} MindNotes AI. AI-Powered Lecture & Meeting Assistant.
      </footer>
    </div>
  );
}
