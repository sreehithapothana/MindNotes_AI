import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Bell, Search, User } from 'lucide-react';

export default function Topbar() {
  const { user } = useContext(AuthContext);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-lavender-light flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex-1 max-w-lg">
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400 group-focus-within:text-lavender transition-colors" />
          <input 
            type="text" 
            placeholder="Search your notes..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-lavender-light focus:bg-white transition-all outline-none"
          />
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <button className="relative p-2 text-gray-400 hover:text-lavender transition-colors rounded-full hover:bg-lavender-light/30">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-peach rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
          <div className="w-9 h-9 rounded-full bg-powder text-lavender-dark flex items-center justify-center font-bold shadow-sm">
            {user?.name?.charAt(0) || <User className="w-4 h-4"/>}
          </div>
          <span className="text-sm font-medium text-gray-900 hidden md:block">{user?.name}</span>
        </div>
      </div>
    </header>
  );
}
