import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/storage';
import { ChevronLeft, CheckSquare, Hash } from 'lucide-react';

export const AddHabit: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'boolean' | 'numeric'>('boolean');
  const [unit, setUnit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;

    // Validation
    if (type === 'numeric' && !unit.trim()) {
        alert("Please specify a unit for this numeric habit.");
        return;
    }

    setIsSubmitting(true);
    try {
      await api.createHabit(user.id, title, type, unit);
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto pt-4">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8 transition-colors font-semibold tracking-wide"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        BACK
      </button>

      <div className="bg-white dark:bg-black rounded-lg border-2 border-black dark:border-white p-6 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
        <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2 uppercase tracking-tight">Create Habit</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">Define the rules for your new routine.</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* STEP 1: Name */}
          <div className="space-y-3">
            <label htmlFor="title" className="block text-sm font-bold text-black dark:text-white uppercase tracking-wider">
              1. Habit Name
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., MEDITATION, READING, RUNNING"
              className="w-full px-4 py-3 rounded-sm border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-black text-black dark:text-white focus:border-black dark:focus:border-white focus:ring-0 outline-none transition-colors font-bold text-lg placeholder:text-gray-300 dark:placeholder:text-zinc-600 uppercase"
              required
              autoFocus
            />
          </div>

          {/* STEP 2: Type */}
          <div className="space-y-3">
             <label className="block text-sm font-bold text-black dark:text-white uppercase tracking-wider">
              2. Habit Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setType('boolean')}
                    className={`p-4 border-2 rounded-sm flex items-start gap-4 transition-all text-left ${
                        type === 'boolean' 
                        ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black' 
                        : 'border-gray-200 dark:border-zinc-700 hover:border-black dark:hover:border-white text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                >
                    <CheckSquare className="w-6 h-6 shrink-0 mt-0.5" />
                    <div>
                        <span className="block font-bold uppercase tracking-wide">Yes / No</span>
                        <span className="text-xs opacity-80 mt-1">Simple completion. E.g., "Did I workout today?"</span>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => setType('numeric')}
                    className={`p-4 border-2 rounded-sm flex items-start gap-4 transition-all text-left ${
                        type === 'numeric' 
                        ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black' 
                        : 'border-gray-200 dark:border-zinc-700 hover:border-black dark:hover:border-white text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                    }`}
                >
                    <Hash className="w-6 h-6 shrink-0 mt-0.5" />
                    <div>
                        <span className="block font-bold uppercase tracking-wide">Numeric</span>
                        <span className="text-xs opacity-80 mt-1">Measurable quantity. E.g., Pages read, Minutes run.</span>
                    </div>
                </button>
            </div>
          </div>

          {/* STEP 3: Unit (Conditional) */}
          {type === 'numeric' && (
             <div className="space-y-3 animate-fade-in">
                <label htmlFor="unit" className="block text-sm font-bold text-black dark:text-white uppercase tracking-wider">
                3. Unit of Measurement
                </label>
                <input
                    type="text"
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g., PAGES, MINUTES, KM"
                    className="w-full px-4 py-3 rounded-sm border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-black text-black dark:text-white focus:border-black dark:focus:border-white focus:ring-0 outline-none transition-colors font-bold text-lg placeholder:text-gray-300 dark:placeholder:text-zinc-600 uppercase"
                    required={type === 'numeric'}
                />
            </div>
          )}

          <div className="pt-4">
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-4 px-4 rounded-sm font-extrabold uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-lg border-2 border-transparent"
            >
                {isSubmitting ? 'SAVING...' : 'CREATE HABIT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};