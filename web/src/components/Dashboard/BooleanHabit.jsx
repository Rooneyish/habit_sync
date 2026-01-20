function BooleanHabit({ habit, log, onUpdate }) {
  const isDone = log?.completed || false;
  return (
    <div onClick={() => onUpdate({ completed: !isDone })} style={styles.container}>
      <div style={{...styles.checkbox, backgroundColor: isDone ? '#fff' : 'transparent'}}>
        {isDone && <span style={styles.checkmark}>✓</span>}
      </div>
      <span style={styles.name}>{habit.name}</span>
    </div>
  );
}
const styles = {
  container: { display: 'flex', alignItems: 'center', padding: '20px 16px', cursor: 'pointer' },
  checkbox: { width: '28px', height: '28px', border: '2px solid #fff', marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  checkmark: { color: '#000', fontWeight: 'bold' },
  name: { fontSize: '16px' }
};
export default BooleanHabit;