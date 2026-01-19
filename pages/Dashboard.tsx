import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/storage';
import { Habit, HabitLog } from '../types';
import { Plus, Check, Hash, Calendar, BarChart2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayLogs, setTodayLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [numericValue, setNumericValue] = useState<string>('');

  const fetchData = async () => {
    if (!user) return;
    try {
      const [fetchedHabits, fetchedLogs] = await Promise.all([
        api.getHabits(user.id),
        api.getTodayLogs(user.id)
      ]);
      setHabits(fetchedHabits);
      setTodayLogs(fetchedLogs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleBooleanToggle = async (habitId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    const today = format(new Date(), 'yyyy-MM-dd');
    const isCompleted = todayLogs.some(l => l.habitId === habitId);
    
    // Optimistic Update
    if (isCompleted) {
        setTodayLogs(prev => prev.filter(l => l.habitId !== habitId));
    } else {
        setTodayLogs(prev => [...prev, { 
            id: 'temp', habitId, date: today, value: 1, completed: true 
        }]);
    }
    
    await api.logHabit(habitId, today, 1, true);
    fetchData(); // Sync
  };

  const startEditingNumeric = (habitId: string, currentValue: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingHabitId(habitId);
    setNumericValue(currentValue > 0 ? currentValue.toString() : '');
  };

  const saveNumericValue = async (habitId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const val = parseFloat(numericValue);
    
    if (!isNaN(val)) {
        // Optimistic
        const newLogs = todayLogs.filter(l => l.habitId !== habitId);
        if (val > 0) {
            newLogs.push({ id: 'temp', habitId, date: today, value: val, completed: true });
        }
        setTodayLogs(newLogs);
        
        await api.logHabit(habitId, today, val, false);
    }
    
    setEditingHabitId(null);
    fetchData();
  };

  if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400 font-mono">LOADING...</div>;

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-black dark:text-white tracking-tight uppercase">Today</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mt-1 uppercase tracking-widest">{format(new Date(), 'EEEE, MMM do')}</p>
        </div>
        <Link 
          to="/add" 
          className="hidden md:flex items-center gap-2 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black px-5 py-2.5 rounded-sm transition-colors font-bold tracking-wide"
        >
          <Plus size={18} />
          <span>NEW HABIT</span>
        </Link>
      </div>

      {habits.length === 0 ? (
        <div className="bg-gray-50 dark:bg-zinc-900 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg p-12 flex flex-col items-center justify-center text-center">
            <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-4 rounded-full mb-6">
                <Calendar className="w-8 h-8 text-black dark:text-white" />
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">NO HABITS DEFINED</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">Define your rules. Track your execution.</p>
            <Link to="/add" className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-sm font-bold tracking-wide hover:bg-gray-800 dark:hover:bg-gray-200">CREATE HABIT</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {habits.map(habit => {
            const log = todayLogs.find(l => l.habitId === habit.id);
            const isCompleted = !!log;
            const currentValue = log?.value || 0;

            return (
              <div 
                key={habit.id} 
                onClick={() => navigate(`/habits/${habit.id}`)}
                className={`group cursor-pointer bg-white dark:bg-black rounded-md border-2 p-5 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] ${
                    isCompleted ? 'border-black dark:border-white shadow-md dark:shadow-zinc-700' : 'border-gray-200 dark:border-zinc-800 hover:border-black dark:hover:border-white'
                }`}
              >
                <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                    {/* Status Indicator / Toggle */}
                    {habit.type === 'boolean' ? (
                        <button
                            onClick={(e) => handleBooleanToggle(habit.id, e)}
                            className={`w-12 h-12 rounded-sm border-2 flex items-center justify-center transition-all ${
                                isCompleted 
                                ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black' 
                                : 'bg-white dark:bg-black border-gray-300 dark:border-zinc-700 text-transparent hover:border-black dark:hover:border-white'
                            }`}
                        >
                            <Check size={24} strokeWidth={4} />
                        </button>
                    ) : (
                        <div className={`w-12 h-12 rounded-sm border-2 flex items-center justify-center bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-black dark:text-white`}>
                             <Hash size={20} />
                        </div>
                    )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className={`font-bold text-lg leading-tight hover:underline ${isCompleted ? 'text-black dark:text-white' : 'text-gray-800 dark:text-zinc-300'}`}>
                            {habit.title}
                        </h3>
                        <BarChart2 className="w-4 h-4 text-gray-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-bold text-white dark:text-black bg-black dark:bg-white px-2 py-0.5 rounded-sm uppercase tracking-wider">{habit.type}</span>
                        {habit.unit && (
                             <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                {habit.unit}
                             </span>
                        )}
                    </div>
                  </div>
                </div>

                {/* Numeric Input Area */}
                {habit.type === 'numeric' && (
                    <div className="flex items-center gap-2 w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
                        {editingHabitId === habit.id ? (
                            <div className="flex items-center gap-2 w-full">
                                <input 
                                    type="number" 
                                    value={numericValue}
                                    onChange={(e) => setNumericValue(e.target.value)}
                                    className="w-full sm:w-24 px-3 py-2 border-2 border-black dark:border-white rounded-sm font-mono text-lg focus:outline-none bg-white dark:bg-black text-black dark:text-white"
                                    placeholder="0"
                                    autoFocus
                                />
                                <button 
                                    onClick={() => saveNumericValue(habit.id)}
                                    className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200"
                                >
                                    SAVE
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={(e) => startEditingNumeric(habit.id, currentValue, e)}
                                className={`flex items-center gap-2 px-4 py-2 border-2 rounded-sm font-mono font-bold transition-colors w-full sm:w-auto justify-center ${
                                    currentValue > 0 
                                    ? 'border-black dark:border-white bg-gray-100 dark:bg-zinc-800 text-black dark:text-white' 
                                    : 'border-gray-300 dark:border-zinc-700 text-gray-400 dark:text-zinc-500 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
                                }`}
                            >
                                <span className="text-lg">{currentValue}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">{habit.unit}</span>
                            </button>
                        )}
                    </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};