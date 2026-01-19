import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, name);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6 transition-colors duration-300">
      <div className="w-full max-w-md">
         <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-16 bg-white dark:bg-black border-4 border-black dark:border-white text-black dark:text-white rounded-sm flex items-center justify-center mb-4">
                <Activity className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-black dark:text-white tracking-tighter">HABITSYNC</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide">NEW USER SETUP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-black dark:text-white uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-sm border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:ring-0 outline-none font-medium placeholder:text-gray-400 dark:placeholder:text-zinc-600 transition-colors"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-black dark:text-white uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-sm border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:ring-0 outline-none font-medium placeholder:text-gray-400 dark:placeholder:text-zinc-600 transition-colors"
              placeholder="user@example.com"
              required
            />
          </div>
          <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-sm font-extrabold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors uppercase tracking-widest text-sm">
            Create System Account
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-black dark:text-white">
             <span className="text-gray-500 dark:text-gray-400">Existing user? </span>
            <Link to="/login" className="text-black dark:text-white font-bold hover:underline border-b-2 border-transparent hover:border-black dark:hover:border-white uppercase">Login</Link>
        </div>
      </div>
    </div>
  );
};