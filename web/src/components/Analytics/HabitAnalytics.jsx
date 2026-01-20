import { useState, useEffect } from "react";
import { getHabitAnalytics } from "../../api/client";
import Heatmap from "../Charts/Heatmap";
import CumulativeTrend from "../Charts/CumulativeTrend";

function HabitAnalytics({ habitId, onBack }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const data = await getHabitAnalytics(habitId);
        setAnalytics(data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading analytics:", error);
        setLoading(false);
      }
    };
    loadAnalytics();
  }, [habitId]); // Reloads whenever you click a different habit

  if (loading || !analytics)
    return <div style={styles.center}>Fetching Latest Stats...</div>;

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backButton}>
        ← Back
      </button>
      <header style={styles.header}>
        <h1 style={styles.title}>{analytics.habit.name}</h1>
      </header>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>CURRENT STREAK</span>
          <span style={styles.statValue}>{analytics.streak || 0}d</span>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statLabel}>
            TOTAL {analytics.habit.unit?.toUpperCase() || "UNITS"}
          </span>
          <span style={styles.statValue}>{analytics.totalValue || 0}</span>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statLabel}>DAILY AVG</span>
          <span style={styles.statValue}>{analytics.averageValue || 0}</span>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statLabel}>DAYS LOGGED</span>
          <span style={styles.statValue}>{analytics.totalLogs || 0}</span>
        </div>
      </div>
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Activity Map</h2>
        <div style={styles.chartWrapper}>
          <Heatmap data={analytics.heatmap} habitType={analytics.habit.type} />
        </div>
      </div>
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Growth Trend</h2>
        <div style={styles.chartWrapper}>
          <CumulativeTrend data={analytics.trend} unit={analytics.habit.unit} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { color: "#fff", backgroundColor: "#000" },
  header: { marginBottom: "40px" },
  backButton: {
    padding: "8px 16px",
    border: "1px solid #fff",
    background: "none",
    color: "#fff",
    cursor: "pointer",
    marginBottom: "20px",
  },
  title: { fontSize: "42px", margin: 0 },
statsGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
    gap: '15px', 
    marginBottom: '40px' 
  },
  statCard: { 
    border: '1px solid #333', 
    padding: '20px', 
    backgroundColor: '#050505',
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'center'
  },
  statLabel: { fontSize: '9px', color: '#666', letterSpacing: '1.5px', marginBottom: '8px' },
  statValue: { fontSize: '24px', fontWeight: 'bold', color: '#fff' },
  section: { marginBottom: "50px" },
  sectionTitle: {
    fontSize: "12px",
    letterSpacing: "2px",
    color: "#444",
    marginBottom: "15px",
    textTransform: "uppercase",
  },
  chartWrapper: {
    border: "1px solid #222",
    padding: "20px",
    backgroundColor: "#050505",
  },
  center: { textAlign: "center", padding: "100px", color: "#fff" },
};

export default HabitAnalytics;
