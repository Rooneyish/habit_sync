import { useState } from 'react';
import { createHabit } from '../../api/client';

function CreateHabit({ onBack, onCreated }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ name: '', type: '', unit: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (finalData) => {
    setLoading(true);
    await createHabit(finalData);
    onCreated();
  };

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backButton}>← Cancel</button>
      <h1 style={styles.title}>New Habit</h1>
      
      {step === 1 && (
        <>
          <label style={styles.label}>Name</label>
          <input style={styles.input} autoFocus value={data.name} onChange={e => setData({...data, name: e.target.value})} />
          <button style={styles.btn} onClick={() => setStep(2)}>Next →</button>
        </>
      )}

      {step === 2 && (
        <div style={styles.col}>
          <button style={styles.typeBtn} onClick={() => handleSubmit({...data, type: 'boolean'})}>Done / Not Done</button>
          <button style={styles.typeBtn} onClick={() => setStep(3)}>Numeric Value</button>
        </div>
      )}

      {step === 3 && (
        <>
          <label style={styles.label}>Unit (e.g. pages)</label>
          <input style={styles.input} autoFocus value={data.unit} onChange={e => setData({...data, unit: e.target.value})} />
          <button style={styles.btn} onClick={() => handleSubmit({...data, type: 'numeric'})}>Create</button>
        </>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '500px' },
  backButton: { background: 'none', border: '1px solid #fff', color: '#fff', padding: '8px 16px', marginBottom: '20px' },
  title: { fontSize: '32px' },
  label: { display: 'block', marginBottom: '10px' },
  input: { width: '100%', padding: '12px', background: '#000', border: '2px solid #fff', color: '#fff', marginBottom: '20px' },
  btn: { width: '100%', padding: '12px', background: '#fff', color: '#000', border: 'none', fontWeight: 'bold' },
  typeBtn: { width: '100%', padding: '20px', background: '#000', border: '2px solid #fff', color: '#fff', marginBottom: '10px', textAlign: 'left' },
  col: { display: 'flex', flexDirection: 'column' }
};

export default CreateHabit;