import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  Bell,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Master Schedule', href: '/schedule', icon: Calendar },
  { name: 'Book', href: '/booking', icon: CalendarPlus },
  { name: 'Reservations', href: '/reservations', icon: ClipboardList },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Layout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const getPageTitle = () => {
    const path = location.pathname;
    const state = location.state;
    if (path.includes('/reservations/') && path.includes('/report')) return 'Report an Issue';
    if (path.includes('/reservations/')) return 'Reservation Details';
    if (path === '/reservations') return 'My Reservations';
    if (path === '/dashboard') return 'Analytics Dashboard';
    if (path === '/schedule') return 'Master Schedule';
    if (path === '/booking') return 'Book a Facility';
    if (path === '/reports') return 'Reports & Issues';
    if (path === '/users') return 'User Management';
    if (path === '/admin/manual-booking') {
      return state?.bookingId || state?.bookingData ? 'Edit Booking' : 'Add Manual Booking';
    }
    if (path === '/settings') return 'Settings';
    return 'Dashboard';
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const names = user.name.split(' ');
    return names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0][0];
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F4F6F8]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-[#003f8f] text-white
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src="https://aka-cdn.uce.edu.ec/ares/tmp/SIIU/anuncios/sello_400.png"
                  alt="Escudo UCE"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-white">SportHub</h3>
                <p className="text-xs text-white/60">Universidad Central del Ecuador</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-white/80"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-[#cbab42] text-[#003f8f]'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="px-6 py-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#cbab42] rounded-full flex items-center justify-center">
                <span className="text-[#003f8f] font-semibold">{getUserInitials()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-white/60 truncate">{user?.email || 'user@uce.edu.ec'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-gray-900">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ef4444] rounded-full" />
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-900">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500">
                  {user?.studentId ? `Student ID: ${user.studentId}` : user?.role || 'User'}
                </p>
              </div>
              <div className="w-10 h-10 bg-[#003f8f] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{getUserInitials()}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

