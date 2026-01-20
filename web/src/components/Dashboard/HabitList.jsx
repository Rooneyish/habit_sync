import { useState, useEffect } from 'react';
import { getActiveHabits, getTodayLogs, upsertLog } from '../../api/client';
import BooleanHabit from './BooleanHabit';
import NumericHabit from './NumericHabit';

function HabitList({ onCreateNew }) {
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [h, l] = await Promise.all([getActiveHabits(), getTodayLogs()]);
      setHabits(h);
      const logsMap = {};
      l.forEach(log => logsMap[log.habitId] = log);
      setLogs(logsMap);
      setLoading(false);
    } catch (e) { setLoading(false); }
  };

  const handleLogUpdate = async (habitId, data) => {
    const updatedLog = await upsertLog({ habitId, ...data });
    setLogs(prev => ({ ...prev, [habitId]: updatedLog }));
  };

  if (loading) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Today</h1>
        <button onClick={onCreateNew} style={styles.createButton}>+ New Habit</button>
      </div>
      <div style={styles.habitList}>
        {habits.map((habit, i) => (
          <div key={habit._id} style={{...styles.habitItem, borderBottom: i === habits.length-1 ? 'none' : '1px solid #fff'}}>
            {habit.type === 'boolean' ? (
              <BooleanHabit habit={habit} log={logs[habit._id]} onUpdate={(d) => handleLogUpdate(habit._id, d)} />
            ) : (
              <NumericHabit habit={habit} log={logs[habit._id]} onUpdate={(d) => handleLogUpdate(habit._id, d)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { color: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  title: { fontSize: '32px', margin: 0 },
  createButton: { padding: '10px 20px', border: '2px solid #fff', backgroundColor: 'transparent', color: '#fff', cursor: 'pointer' },
  habitList: { border: '2px solid #fff' },
  habitItem: { backgroundColor: '#000' },
  center: { textAlign: 'center', padding: '60px', color: '#fff' }
};

export default HabitList;