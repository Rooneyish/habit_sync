import { useState, useEffect } from 'react';

function NumericHabit({ habit, log, onUpdate }) {
  const [val, setVal] = useState(log?.value || 0);

  useEffect(() => { 
    setVal(log?.value || 0); 
  }, [log]);

  const handleManualUpdate = () => {
    onUpdate({ value: parseFloat(val) || 0 });
  };

  return (
    <div style={styles.container}>
      <span style={styles.name}>{habit.name}</span>
      <div style={styles.inputGroup}>
        <input 
          type="number" 
          value={val} 
          onChange={(e) => setVal(e.target.value)}
          style={styles.input} 
        />
        <span style={styles.unit}>{habit.unit}</span>
        <button onClick={handleManualUpdate} style={styles.updateButton}>
          Update
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 16px', backgroundColor: '#000' },
  name: { flex: 1, color: '#fff' },
  inputGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
  input: { width: '80px', padding: '10px', border: '2px solid #fff', backgroundColor: '#000', color: '#fff', textAlign: 'right', outline: 'none' },
  unit: { fontSize: '14px', color: '#666', minWidth: '40px' },
  updateButton: {
    padding: '10px 15px',
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '11px',
    textTransform: 'uppercase'
  }
};

export default NumericHabit;