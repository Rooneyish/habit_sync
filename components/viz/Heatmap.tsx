import React, { useMemo } from 'react';
import { eachDayOfInterval, subDays, format, getDay, parseISO } from 'date-fns';
import { HabitLog } from '../../types';

interface HeatmapProps {
  logs: HabitLog[];
  isNumeric?: boolean;
}

export const Heatmap: React.FC<HeatmapProps> = ({ logs, isNumeric = false }) => {
  const days = useMemo(() => {
    const today = new Date();
    // Show last 365 days
    const startDate = subDays(today, 364);
    
    return eachDayOfInterval({
      start: startDate,
      end: today,
    });
  }, []);

  // Calculate max value for numeric scaling
  const maxValue = useMemo(() => {
    if (!isNumeric) return 1;
    return Math.max(...logs.map(l => l.value), 1);
  }, [logs, isNumeric]);

  const getIntensity = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayLog = logs.find(l => l.date === dateStr);
    
    // Default no data
    if (!dayLog || dayLog.value <= 0) return 'bg-gray-100 dark:bg-zinc-900 border border-transparent';

    // Boolean Logic: If it exists and > 0, it's black (light mode) / white (dark mode)
    if (!isNumeric) return 'bg-black dark:bg-white border border-black dark:border-white';

    // Numeric Logic: Scale opacity based on value vs max
    const ratio = dayLog.value / maxValue;

    // Light mode: Light Gray -> Black
    // Dark mode: Dark Gray -> White
    if (ratio < 0.25) return 'bg-gray-300 dark:bg-zinc-700 border border-gray-400 dark:border-zinc-600';
    if (ratio < 0.50) return 'bg-gray-500 dark:bg-zinc-500 border border-gray-600 dark:border-zinc-400';
    if (ratio < 0.75) return 'bg-gray-700 dark:bg-zinc-300 border border-gray-800 dark:border-zinc-200';
    return 'bg-black dark:bg-white border border-black dark:border-white';
  };

  // Group days by week
  const weeks = useMemo(() => {
    const weeksArray: Date[][] = [];
    let currentWeek: Date[] = [];

    days.forEach((day) => {
      if (getDay(day) === 0 && currentWeek.length > 0) {
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    if (currentWeek.length > 0) weeksArray.push(currentWeek);
    return weeksArray;
  }, [days]);

  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700">
      <div className="flex gap-1 min-w-max">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                title={`${format(day, 'MMM d, yyyy')}: ${logs.find(l => l.date === format(day, 'yyyy-MM-dd'))?.value || 0}`}
                className={`w-3 h-3 rounded-sm transition-colors duration-200 ${getIntensity(day)}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 items-center text-[10px] text-gray-500 dark:text-gray-400 mt-3 font-bold uppercase tracking-wider">
        <span>Less</span>
        <div className="flex gap-1 items-center">
            <div className="w-2.5 h-2.5 bg-gray-100 dark:bg-zinc-900 rounded-sm"></div>
            <div className="w-2.5 h-2.5 bg-gray-300 dark:bg-zinc-700 rounded-sm"></div>
            <div className="w-2.5 h-2.5 bg-gray-500 dark:bg-zinc-500 rounded-sm"></div>
            <div className="w-2.5 h-2.5 bg-black dark:bg-white rounded-sm"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};