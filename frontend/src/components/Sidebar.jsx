import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Upload, History, Settings, Sparkles, LogOut, FileText, CheckSquare, BookOpen, MessageSquare, HelpCircle } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Upload & Transcribe', icon: Upload, path: '/upload' },
    { name: 'History', icon: History, path: '/history' },
  ];

  return (
    <div className="w-64 bg-white border-r border-lavender-light flex flex-col h-full hidden md:flex shadow-sm z-10">
      <div className="h-20 flex items-center px-6 border-b border-lavender-light/50">
        <div className="w-8 h-8 rounded-xl bg-lavender flex items-center justify-center mr-3 shadow-sm">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-extrabold text-xl text-gray-900 tracking-tight">MindNotes AI</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-lavender-light text-lavender-dark shadow-sm'
                  : 'text-gray-500 hover:bg-powder/50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className={`mr-3 h-5 w-5 ${item.name === 'Dashboard' ? '' : 'opacity-70'}`} />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-lavender-light/50 bg-gray-50/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-500 rounded-xl hover:bg-peach/50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 opacity-70" />
          Logout
        </button>
      </div>
    </div>
  );
}
