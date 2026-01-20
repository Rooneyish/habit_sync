function Heatmap({ data, habitType }) {
  // Logic to ensure we show a meaningful grid (e.g., 20 weeks)
  const displayWeeks = 24; 
  const cells = Array.from({ length: displayWeeks * 7 }, (_, i) => {
    return data[i] || { intensity: 0, date: '' };
  });

  const getColor = (intensity) => {
    if (intensity === 0) return '#0a0a0a'; 
    if (habitType === 'boolean') return '#fff';
    const b = Math.floor(intensity * 255);
    return `rgb(${b}, ${b}, ${b})`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.labels}>
        <span>Mon</span><span>Wed</span><span>Fri</span>
      </div>
      <div style={styles.grid}>
        {Array.from({ length: displayWeeks }).map((_, wIndex) => (
          <div key={wIndex} style={styles.week}>
            {cells.slice(wIndex * 7, (wIndex + 1) * 7).map((day, dIndex) => (
              <div
                key={dIndex}
                title={day.date}
                style={{
                  ...styles.cell,
                  backgroundColor: getColor(day.intensity),
                  borderColor: day.intensity > 0 ? '#fff' : '#1a1a1a'
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', gap: '10px' },
  labels: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '9px', color: '#444', padding: '5px 0' },
  grid: { display: 'flex', gap: '4px' },
  week: { display: 'flex', flexDirection: 'column', gap: '4px' },
  cell: { width: '13px', height: '13px', border: '1px solid #1a1a1a', transition: 'all 0.2s' }
};

export default Heatmap;