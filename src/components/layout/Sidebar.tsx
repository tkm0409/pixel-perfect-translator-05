
import { Home, BarChart2, PieChart, Calendar, FileText, Folder, Globe, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, href: '/' },
    { icon: BarChart2, href: '/analytics' },
    { icon: PieChart, href: '/reports' },
    { icon: Calendar, href: '/calendar' },
    { icon: FileText, href: '/documents' },
    { icon: Folder, href: '/files' },
    { icon: Globe, href: '/global' },
    { icon: Settings, href: '/settings' },
  ];

  return (
    <div className="fixed left-0 top-16 h-full w-16 bg-gray-200/90 border-r border-gray-200 flex flex-col items-center py-4 space-y-6">
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={index}
            to={item.href}
            className={`p-3 rounded-lg transition-all duration-200 hover:bg-blue-100 ${
              isActive ? 'bg-accent text-accent-foreground' : 'text-gray-500'
            }`}
          >
            <Icon size={20} />
          </Link>
        );
      })}
    </div>
  );
};

export default Sidebar;
