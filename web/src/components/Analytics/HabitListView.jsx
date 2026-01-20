import { useState, useEffect } from 'react';
import { getActiveHabits } from '../../api/client';

function HabitListView({ onHabitSelect }) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHabits = async () => {
      try {
        const data = await getActiveHabits();
        setHabits(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load habits", error);
        setLoading(false);
      }
    };
    loadHabits();
  }, []);

  if (loading) return <div style={styles.center}>Loading Analytics...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Analytics</h1>
      <div style={styles.habitList}>
        {habits.map((habit, index) => (
          <div
            key={habit._id}
            style={{
              ...styles.habitItem,
              borderBottom: index === habits.length - 1 ? 'none' : '1px solid #333'
            }}
            onClick={() => onHabitSelect(habit._id)}
          >
            <span style={styles.habitName}>{habit.name}</span>
            <span style={styles.arrow}>→</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { color: '#fff' },
  title: { fontSize: '32px', marginBottom: '32px' },
  center: { textAlign: 'center', padding: '60px', color: '#fff' },
  habitList: { border: '1px solid #333', backgroundColor: '#000' },
  habitItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '25px 20px',
    cursor: 'pointer',
    backgroundColor: '#000',
    transition: 'background 0.2s'
  },
  habitName: { fontSize: '18px', color: '#fff' },
  arrow: { fontSize: '20px', color: '#666' }
};

export default HabitListView;