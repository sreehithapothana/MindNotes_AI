import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader,
  ArrowRight,
  CheckCircle2,
  Mic,
  FileText,
  Network,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email ? email.trim() : '';
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email: trimmedEmail, password });
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/80 overflow-hidden animate-fade-in grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
      {/* Left Column: Form Panel (7 cols on lg) */}
      <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between">
        <div>
          {/* Mobile Brand Accent */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-lavender-light/70 text-lavender-dark text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-lavender" />
            <span>Welcome Back</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
            Sign in to MindNotes AI
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            Access your saved lecture notes, smart meeting minutes, and AI study guides.
          </p>

          {/* Error Alert Box */}
          {error && (
            <div className="mb-6 p-4 bg-red-50/90 text-red-700 text-sm rounded-2xl border border-red-200/80 flex items-start space-x-3 shadow-xs animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">Authentication Failed</span>
                <span className="text-xs text-red-600 leading-relaxed">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-lavender transition-colors" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200/70 rounded-xl focus:ring-2 focus:ring-lavender-light focus:border-lavender focus:bg-white transition-all outline-none text-gray-900 text-sm placeholder:text-gray-400 font-medium"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative group">
                <Lock className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-lavender transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200/70 rounded-xl focus:ring-2 focus:ring-lavender-light focus:border-lavender focus:bg-white transition-all outline-none text-gray-900 text-sm placeholder:text-gray-400 font-medium"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base font-bold shadow-soft hover:shadow-md mt-3 cursor-pointer group"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="pt-8 border-t border-gray-100 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>Don't have an account yet?</span>
          <Link
            to="/register"
            className="font-bold text-lavender-dark hover:text-lavender transition-colors underline-offset-2 hover:underline"
          >
            Create an account free →
          </Link>
        </div>
      </div>

      {/* Right Column: Decorative Brand & Mockup Panel (5 cols on lg) */}
      <div className="lg:col-span-5 bg-gradient-to-br from-lavender-light/80 via-powder/60 to-peach/50 p-8 sm:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-lavender-light/70 relative overflow-hidden">
        {/* Soft Decorative Ambient Circles */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-lavender/20 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-powder/40 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

        <div className="relative z-10">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-soft mb-6 text-lavender-dark">
            <Sparkles className="w-6 h-6" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-snug mb-3">
            Instant Knowledge from Every Spoken Word.
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
            Whisper transcription, executive meeting minutes, action items with owners, and interactive quizzes.
          </p>

          {/* Interactive Floating Micro-Card Mockups */}
          <div className="space-y-3">
            {/* Mock Item 1 */}
            <div className="p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-white/80 shadow-xs flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-sage flex items-center justify-center text-emerald-700 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">Meeting Action Items</p>
                <p className="text-[11px] text-gray-500 truncate">Assigned with deadlines & priorities</p>
              </div>
            </div>

            {/* Mock Item 2 */}
            <div className="p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-white/80 shadow-xs flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-powder flex items-center justify-center text-blue-700 flex-shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">Study Guides & Definitions</p>
                <p className="text-[11px] text-gray-500 truncate">Automatic revision notes for exams</p>
              </div>
            </div>

            {/* Mock Item 3 */}
            <div className="p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-white/80 shadow-xs flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-peach flex items-center justify-center text-orange-700 flex-shrink-0">
                <Network className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">Mind-Map Nodes</p>
                <p className="text-[11px] text-gray-500 truncate">Visual retention & concept hierarchies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Pill Tags */}
        <div className="relative z-10 pt-6 mt-6 border-t border-white/60 flex flex-wrap gap-2 text-[11px] font-semibold text-gray-600">
          <span className="px-2.5 py-1 bg-white/80 rounded-lg">✓ Whisper AI</span>
          <span className="px-2.5 py-1 bg-white/80 rounded-lg">✓ Grounded Q&A</span>
          <span className="px-2.5 py-1 bg-white/80 rounded-lg">✓ PDF/DOCX Export</span>
        </div>
      </div>
    </div>
  );
}
