import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/storage';
import { Habit, HabitLog } from '../types';
import { Heatmap } from '../components/viz/Heatmap';
import { CumulativeTrendChart } from '../components/viz/TimeChart';
import { ChevronLeft, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export const HabitDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [habit, setHabit] = useState<Habit | null>(null);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user || !id) return;
      try {
        const h = await api.getHabit(id);
        if (!h) {
            navigate('/');
            return;
        }
        const l = await api.getHabitLogs(id);
        setHabit(h);
        setLogs(l);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, user, navigate]);

  const handleDelete = async () => {
      if (confirm('Are you sure you want to archive/delete this habit?')) {
          if (habit) await api.deleteHabit(habit.id);
          navigate('/');
      }
  };

  if (loading || !habit) return <div className="p-8 text-center text-gray-500 dark:text-gray-400 font-mono">LOADING DETAIL...</div>;

  // Calculate some quick stats
  const totalValue = logs.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const daysActive = logs.length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <button 
            onClick={() => navigate('/')}
            className="flex items-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mb-6 transition-colors font-bold tracking-wide text-xs uppercase"
        >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Return to Dashboard
        </button>
        
        <div className="flex items-start justify-between">
            <div>
                <h1 className="text-3xl font-black text-black dark:text-white tracking-tighter uppercase mb-2">{habit.title}</h1>
                <div className="flex items-center gap-3">
                    <span className="bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 text-xs font-bold uppercase rounded-sm">{habit.type}</span>
                    {habit.unit && <span className="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase">UNIT: {habit.unit}</span>}
                    <span className="text-xs text-gray-400 dark:text-zinc-500">Created: {format(new Date(habit.createdAt), 'MMM d, yyyy')}</span>
                </div>
            </div>
            <button 
                onClick={handleDelete}
                className="text-gray-400 dark:text-zinc-600 hover:text-red-600 dark:hover:text-red-400 transition-colors p-2"
                title="Archive Habit"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-black dark:border-white p-4 rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] bg-white dark:bg-black">
              <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Total Volume</span>
              </div>
              <p className="text-3xl font-mono font-bold text-black dark:text-white">{totalValue}</p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 uppercase mt-1">{habit.type === 'boolean' ? 'Completions' : habit.unit}</p>
          </div>
          <div className="border-2 border-black dark:border-white p-4 rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] bg-white dark:bg-black">
              <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Days Active</span>
              </div>
              <p className="text-3xl font-mono font-bold text-black dark:text-white">{daysActive}</p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 uppercase mt-1">Check-ins</p>
          </div>
      </div>

      {/* Heatmap */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b-2 border-black dark:border-white pb-2 uppercase tracking-wide text-black dark:text-white">Daily History</h2>
        <div className="bg-white dark:bg-black p-4 border-2 border-gray-200 dark:border-zinc-800 rounded-sm">
            <Heatmap logs={logs} isNumeric={habit.type === 'numeric'} />
        </div>
      </div>

      {/* Trend Chart */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold border-b-2 border-black dark:border-white pb-2 uppercase tracking-wide text-black dark:text-white">Cumulative Growth</h2>
        <div className="bg-white dark:bg-black p-4 border-2 border-gray-200 dark:border-zinc-800 rounded-sm">
            <CumulativeTrendChart habit={habit} logs={logs} />
        </div>
      </div>
    </div>
  );
};