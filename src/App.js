import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './Home';
import Dashboard from './Dashboard';
import LearnMore from './LearnMore';
import Notes from './Notes';
import Calendar from './Calendar';
import AuthGuard from './AuthGuard';
import TodoApp from './TodoApp';
import Timer from './Timer';
import AIScheduler from './AIScheduler';
import AdminDashboard from './AdminDashboard';
import HabitTracker from './HabitTracker';
import Profile from './Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/admindashboard" element={<AdminDashboard/>} />
        <Route path="/habit" element={<HabitTracker/>} />
        <Route path="/setting" element={<Profile/>} />

        <Route 
          path="/dashboard" 
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } 
        />
        <Route 
          path="/notes" 
          element={
            <AuthGuard>
              <Notes />
            </AuthGuard>
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <AuthGuard>
              <Calendar />
            </AuthGuard>
          } 
        />
        <Route 
          path="/todo" 
          element={
            <AuthGuard>
              <TodoApp />
            </AuthGuard>
          } 
        />
        <Route 
          path="/timer" 
          element={
            <AuthGuard>
              <Timer />
            </AuthGuard>
          } 
        />
        <Route 
          path="/ai" 
          element={
            <AuthGuard>
              <AIScheduler />
            </AuthGuard>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;