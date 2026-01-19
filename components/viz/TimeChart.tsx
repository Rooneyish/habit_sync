import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Habit, HabitLog } from '../../types';
import { eachDayOfInterval, format } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';

interface ChartProps {
  habit: Habit;
  logs: HabitLog[];
}

export const CumulativeTrendChart: React.FC<ChartProps> = ({ habit, logs }) => {
  const { theme } = useTheme();
  const startDate = new Date(habit.createdAt);
  const today = new Date();
  
  // Theme colors
  const strokeColor = theme === 'light' ? '#000000' : '#FFFFFF';
  const gridColor = theme === 'light' ? '#e5e7eb' : '#333333';
  const tooltipBg = theme === 'light' ? '#FFFFFF' : '#000000';
  const tooltipBorder = theme === 'light' ? '#000000' : '#FFFFFF';
  const tooltipText = theme === 'light' ? '#000000' : '#FFFFFF';
  
  const days = eachDayOfInterval({ start: startDate, end: today });
  
  let runningTotal = 0;
  
  const data = days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const log = logs.find(l => l.date === dateStr);
    
    const dailyVal = log ? (log.value || 0) : 0;
    runningTotal += dailyVal;
    
    return {
      date: format(day, 'MMM d'),
      fullDate: dateStr,
      total: runningTotal
    };
  });

  if (data.length === 0) {
     return <div className="text-gray-400 dark:text-zinc-600 text-xs font-mono text-center py-10 uppercase">No data recorded.</div>;
  }

  return (
    <div className="h-64 w-full font-mono text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.1}/>
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="date" 
            stroke={strokeColor} 
            tick={{ fill: strokeColor, fontSize: 10 }} 
            tickMargin={10}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke={strokeColor} 
            tick={{ fill: strokeColor, fontSize: 10 }} 
          />
          <Tooltip 
             contentStyle={{ 
                 backgroundColor: tooltipBg,
                 border: `2px solid ${tooltipBorder}`, 
                 borderRadius: '0px', 
                 boxShadow: `4px 4px 0px 0px ${tooltipText}`,
                 fontFamily: 'monospace',
                 color: tooltipText
             }}
             itemStyle={{ color: tooltipText }}
             labelStyle={{ fontWeight: 'bold', marginBottom: '5px', color: tooltipText }}
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke={strokeColor} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorTotal)" 
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};