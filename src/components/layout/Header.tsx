
import { Search, Sun, HelpCircle, Bell } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

const Header = () => {
  return (
    <div className="fixed top-0 left-16 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-4">
          <img src="/logo.svg" alt="Manpower" className="h-8" />
          <h1 className="text-xl font-semibold text-gray-900">Data Management Portal</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Sun size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <HelpCircle size={20} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <Avatar className="h-8 w-8 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Header;
