import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Sparkles, Mail, Lock, User, Loader } from 'lucide-react';
import api from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      // Auto login after registration
      const res = await api.post('/auth/login', { email, password });
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-soft border border-lavender-light relative overflow-hidden animate-fade-in">
      <div className="absolute top-0 right-0 w-32 h-32 bg-powder/50 rounded-bl-full -mr-4 -mt-4"></div>
      
      <div className="text-center mb-8 relative z-10">
        <div className="w-14 h-14 bg-lavender rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create an account</h2>
        <p className="text-gray-500 mt-2">Start turning conversations into clarity</p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 text-center">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <div className="relative group">
          <User className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-lavender transition-colors" />
          <input
            type="text"
            placeholder="Full Name"
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-lavender-light focus:bg-white transition-all outline-none text-gray-900"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="relative group">
          <Mail className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-lavender transition-colors" />
          <input
            type="email"
            placeholder="Email address"
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-lavender-light focus:bg-white transition-all outline-none text-gray-900"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="relative group">
          <Lock className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-lavender transition-colors" />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-lavender-light focus:bg-white transition-all outline-none text-gray-900"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5 text-base mt-2 shadow-md"
        >
          {loading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : 'Create Account'}
        </button>
      </form>
      <div className="mt-8 text-center relative z-10">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-lavender-dark hover:text-lavender transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
