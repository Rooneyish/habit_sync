import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../services/storage';
import { HabitType } from '../types';

export const AddHabit: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<HabitType>('boolean');
  const [unit, setUnit] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    try {
      // Logic now matches our single-user storage.ts
      await api.createHabit(title, type, unit || undefined);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <h1 className="text-3xl font-black uppercase tracking-tight">Create Habit</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase mb-2">Habit Name</label>
          <input 
            className="w-full border-2 border-black dark:border-white p-3 bg-transparent outline-none font-bold"
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g. Reading"
          />
        </div>
        {/* Type selection logic here... */}
        <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black p-4 font-black uppercase">
          Save Habit
        </button>
      </form>
    </div>
  );
};