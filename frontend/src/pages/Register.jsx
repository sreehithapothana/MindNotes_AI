import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader,
  ArrowRight,
  CheckCircle2,
  Mic,
  FileCheck,
  BrainCircuit,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
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

    const trimmedName = name.trim();
    const trimmedEmail = email ? email.trim() : '';

    if (!trimmedName) {
      setError('Please provide your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      // 1. Register user
      await api.post('/auth/register', { name: trimmedName, email: trimmedEmail, password });
      // 2. Auto-login immediately following registration
      const res = await api.post('/auth/login', { email: trimmedEmail, password });
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/80 overflow-hidden animate-fade-in grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
      {/* Left Column: Form Panel (7 cols on lg) */}
      <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between">
        <div>
          {/* Top Pill Accent */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-powder text-blue-700 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Create Free Account</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
            Create your MindNotes account
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Start turning lectures and meetings into organized, actionable knowledge.
          </p>

          {/* Error Alert Box */}
          {error && (
            <div className="mb-6 p-4 bg-red-50/90 text-red-700 text-sm rounded-2xl border border-red-200/80 flex items-start space-x-3 shadow-xs animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">Registration Error</span>
                <span className="text-xs text-red-600 leading-relaxed">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative group">
                <User className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-lavender transition-colors" />
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200/70 rounded-xl focus:ring-2 focus:ring-lavender-light focus:border-lavender focus:bg-white transition-all outline-none text-gray-900 text-sm placeholder:text-gray-400 font-medium"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

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
                <span className="text-[11px] text-gray-400 font-medium">Min. 6 characters</span>
              </div>
              <div className="relative group">
                <Lock className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-lavender transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a secure password"
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200/70 rounded-xl focus:ring-2 focus:ring-lavender-light focus:border-lavender focus:bg-white transition-all outline-none text-gray-900 text-sm placeholder:text-gray-400 font-medium"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="new-password"
                  minLength={6}
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
              className="btn-primary w-full py-3.5 text-base font-bold shadow-soft hover:shadow-md mt-4 cursor-pointer group"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="pt-6 border-t border-gray-100 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>Already have an account?</span>
          <Link
            to="/login"
            className="font-bold text-lavender-dark hover:text-lavender transition-colors underline-offset-2 hover:underline"
          >
            Sign in to existing account →
          </Link>
        </div>
      </div>

      {/* Right Column: Decorative Brand Panel (5 cols on lg) */}
      <div className="lg:col-span-5 bg-gradient-to-br from-powder/80 via-lavender-light/70 to-sage/50 p-8 sm:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-lavender-light/70 relative overflow-hidden">
        {/* Soft Ambient Circles */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-powder/30 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-lavender/25 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

        <div className="relative z-10">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-soft mb-6 text-lavender-dark">
            <BrainCircuit className="w-6 h-6" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-snug mb-3">
            Your Personal AI Knowledge Assistant.
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
            Everything you need to master lectures, meetings, and project discussions without tedious re-typing.
          </p>

          {/* Interactive Feature Highlights */}
          <div className="space-y-3">
            {/* Highlight 1 */}
            <div className="p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-white/80 shadow-xs flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-lavender-light flex items-center justify-center text-lavender-dark flex-shrink-0">
                <Mic className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">Audio & File Uploads</p>
                <p className="text-[11px] text-gray-500 truncate">MP3, WAV, M4A or pasted transcripts</p>
              </div>
            </div>

            {/* Highlight 2 */}
            <div className="p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-white/80 shadow-xs flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-sage flex items-center justify-center text-emerald-700 flex-shrink-0">
                <FileCheck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">Executive Minutes & Actions</p>
                <p className="text-[11px] text-gray-500 truncate">Explicit decisions, assignees & deadlines</p>
              </div>
            </div>

            {/* Highlight 3 */}
            <div className="p-3 bg-white/90 backdrop-blur-md rounded-2xl border border-white/80 shadow-xs flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-peach flex items-center justify-center text-orange-700 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">Verified MCQ Quizzes</p>
                <p className="text-[11px] text-gray-500 truncate">Practice exam questions from real content</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Security / Trust Badge */}
        <div className="relative z-10 pt-6 mt-6 border-t border-white/60 flex items-center justify-between text-[11px] text-gray-500 font-medium">
          <span>🔒 Encrypted Credentials</span>
          <span>⚡ Instant Setup</span>
        </div>
      </div>
    </div>
  );
}
