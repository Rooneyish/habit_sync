import { useState } from 'react';
import HabitList from './components/Dashboard/HabitList';
import HabitListView from './components/Analytics/HabitListView';
import HabitAnalytics from './components/Analytics/HabitAnalytics';
import CreateHabit from './components/HabitCreation/CreateHabit';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBackToDashboard = () => {
    setShowCreate(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div style={styles.container}>
      {!selectedHabitId && !showCreate && (
        <nav style={styles.nav}>
          <button
            onClick={() => setCurrentTab('dashboard')}
            style={{...styles.navButton, ...(currentTab === 'dashboard' ? styles.navButtonActive : {})}}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('analytics')}
            style={{...styles.navButton, ...(currentTab === 'analytics' ? styles.navButtonActive : {})}}
          >
            Analytics
          </button>
        </nav>
      )}

      <main style={styles.main}>
        {showCreate ? (
          <CreateHabit onBack={handleBackToDashboard} onCreated={handleBackToDashboard} />
        ) : selectedHabitId ? (
          <HabitAnalytics habitId={selectedHabitId} onBack={() => setSelectedHabitId(null)} />
        ) : currentTab === 'dashboard' ? (
          <HabitList key={refreshKey} onCreateNew={() => setShowCreate(true)} />
        ) : (
          <HabitListView onHabitSelect={(id) => setSelectedHabitId(id)} />
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#000', color: '#fff' },
  nav: { display: 'flex', borderBottom: '2px solid #fff', position: 'sticky', top: 0, backgroundColor: '#000', zIndex: 100 },
  navButton: { flex: 1, padding: '18px', border: 'none', backgroundColor: '#000', color: '#fff', fontSize: '16px', cursor: 'pointer', borderRight: '2px solid #fff', fontWeight: '500' },
  navButtonActive: { backgroundColor: '#fff', color: '#000' },
  main: { maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }
};

export default App;