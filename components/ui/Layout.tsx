import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, PlusCircle } from 'lucide-react';

export const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col md:flex-row">
      {/* Sidebar / Navigation */}
      <nav className="w-full md:w-64 border-b-2 md:border-b-0 md:border-r-2 border-black dark:border-white p-6 space-y-8">
        <div className="flex items-center gap-3">
          <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-sm">
            <Activity size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">HabitSync</span>
        </div>

        <div className="flex md:flex-col gap-2">
          <Link 
            to="/" 
            className={`flex items-center gap-3 px-4 py-3 rounded-sm font-bold transition-colors ${
              location.pathname === '/' ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-gray-100 dark:hover:bg-zinc-900'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="hidden md:inline">DASHBOARD</span>
          </Link>
          <Link 
            to="/add" 
            className={`flex items-center gap-3 px-4 py-3 rounded-sm font-bold transition-colors ${
              location.pathname === '/add' ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-gray-100 dark:hover:bg-zinc-900'
            }`}
          >
            <PlusCircle size={20} />
            <span className="hidden md:inline">NEW HABIT</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 max-w-5xl">
        <Outlet />
      </main>
    </div>
  );
};