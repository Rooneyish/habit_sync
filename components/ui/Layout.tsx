import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LayoutDashboard, LogOut, Plus, Activity, Moon, Sun } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col md:flex-row font-sans text-black dark:text-white transition-colors duration-300">
      {/* Mobile Header */}
      <header className="md:hidden bg-white dark:bg-black border-b-2 border-black dark:border-white px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="bg-black dark:bg-white text-white dark:text-black p-1 rounded-sm">
             <Activity className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">HABITSYNC</span>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="text-black dark:text-white p-1">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button onClick={() => logout()} className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 p-1 rounded">
                <LogOut className="w-5 h-5" />
            </button>
        </div>
      </header>

      {/* Sidebar (Desktop) / Bottom Nav (Mobile) */}
      <aside className="
        fixed md:relative 
        bottom-0 w-full md:w-64 md:h-screen
        bg-white dark:bg-black border-t-2 md:border-t-0 md:border-r-2 border-black dark:border-white
        z-10 flex md:flex-col justify-between transition-colors duration-300
      ">
        <div className="hidden md:flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-black dark:bg-white text-white dark:text-black p-1.5 rounded-sm">
                <Activity className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">HABITSYNC</span>
          </div>
          
          <nav className="space-y-3">
            <NavLink to="/" icon={<LayoutDashboard />} label="Dashboard" active={isActive('/')} />
          </nav>
        </div>

        {/* Mobile Navigation Items */}
        <nav className="md:hidden flex justify-around w-full p-2 bg-white dark:bg-black">
           <MobileNavLink to="/" icon={<LayoutDashboard />} label="HABITS" active={isActive('/')} />
        </nav>

        {/* Mobile Floating Action Button (Center) */}
        <div className="md:hidden absolute -top-8 left-1/2 transform -translate-x-1/2">
            <Link to="/add" className="bg-black dark:bg-white text-white dark:text-black border-4 border-white dark:border-black w-16 h-16 rounded-full shadow-xl flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-200 transition-transform active:scale-95">
                <Plus className="w-8 h-8" />
            </Link>
        </div>

        {/* Desktop User Footer */}
        <div className="hidden md:flex p-6 border-t-2 border-black dark:border-white items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-sm truncate max-w-[120px]">{user?.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{user?.email}</span>
          </div>
          <div className="flex items-center gap-1">
             <button onClick={toggleTheme} className="p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-colors">
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
             </button>
             <button onClick={() => logout()} className="p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 pb-24 md:pb-10 overflow-y-auto h-[calc(100vh-65px)] md:h-screen bg-white dark:bg-black scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700">
        <div className="max-w-3xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
};

const NavLink = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-md border-2 transition-all ${
      active 
        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-md' 
        : 'bg-white dark:bg-black text-gray-600 dark:text-gray-400 border-transparent hover:border-gray-300 dark:hover:border-zinc-700 hover:text-black dark:hover:text-white'
    }`}
  >
    {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    <span className="font-semibold tracking-wide">{label}</span>
  </Link>
);

const MobileNavLink = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center p-2 w-16 ${
      active ? 'text-black dark:text-white opacity-100' : 'text-gray-400 dark:text-zinc-600 opacity-80'
    }`}
  >
    {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: active ? 2.5 : 2 })}
    <span className="text-[10px] mt-1 font-bold tracking-wider">{label}</span>
  </Link>
);