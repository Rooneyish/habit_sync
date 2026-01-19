import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout'; // Ensure this file exists
import { Dashboard } from './pages/Dashboard';
import { AddHabit } from './pages/AddHabit';
import { HabitDetails } from './pages/HabitDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="add" element={<AddHabit />} />
            <Route path="habits/:id" element={<HabitDetails />} />
          </Route>
          {/* Catch-all: Redirect everything else to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;